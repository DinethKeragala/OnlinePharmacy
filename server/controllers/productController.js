const Product = require('../models/Product');
const { toFiniteNumber, isValidObjectId } = require('../utils/safeQuery');
const {
  sanitizeCategory,
  parseInStockFlag,
  buildPriceFilter,
  makeTextSearchOr,
  parsePagination,
  parseSort,
} = require('../utils/queryBuilders');

// --- Helpers for creation validation/sanitization ---
function badRequest(message) {
  const e = new Error(message);
  e.status = 400;
  return e;
}

function parseImageUrl(val) {
  if (typeof val !== 'string') return undefined;
  const u = val.trim();
  if (u && u.length <= 1024 && /^(https?:)\/\//i.test(u)) return u;
  return undefined;
}

function sanitizeTags(arr) {
  if (!Array.isArray(arr)) return undefined;
  const tags = arr
    .filter((t) => typeof t === 'string')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20)
    .map((t) => t.slice(0, 50));
  return tags.length ? tags : undefined;
}

function sanitizeType(val) {
  return typeof val === 'string' && (val === 'medicine' || val === 'health') ? val : 'medicine';
}

function sanitizeCreateProduct(body) {
  const src = body || {};
  const name = typeof src.name === 'string' ? src.name.trim().slice(0, 200) : '';
  const description = typeof src.description === 'string' ? src.description.trim().slice(0, 5000) : '';
  const genericName = typeof src.genericName === 'string' ? src.genericName.trim().slice(0, 200) : undefined;

  const category = sanitizeCategory(typeof src.category === 'string' ? src.category.trim() : undefined) || '';
  const type = sanitizeType(src.type);

  const priceNum = toFiniteNumber(src.price);
  const price = priceNum !== null ? Math.max(0, priceNum) : null;

  const inStock = typeof src.inStock === 'boolean' ? src.inStock : Boolean(src.inStock);
  const stockNum = toFiniteNumber(src.stock);
  const stock = stockNum !== null ? Math.max(0, Math.floor(stockNum)) : 0;

  const prescription = typeof src.prescription === 'boolean' ? src.prescription : Boolean(src.prescription);

  const ratingNum = toFiniteNumber(src.rating);
  const rating = ratingNum !== null ? Math.max(0, Math.min(5, ratingNum)) : undefined;

  const imageUrl = parseImageUrl(src.imageUrl);
  const tags = sanitizeTags(src.tags);

  if (!name || !description || price === null || !category) {
    throw badRequest('Missing or invalid required fields');
  }

  return { name, description, genericName, price, category, imageUrl, inStock, stock, prescription, type, tags, rating };
}

// Build Mongo filter from query params
function buildFilter(query) {
  const filter = {};
  const { category, inStock, prescription, q, priceMin, priceMax, type } = query;

  if (typeof type === 'string' && (type === 'medicine' || type === 'health')) {
    filter.type = type;
  }

  const cat = sanitizeCategory(category);
  if (cat) filter.category = cat;

  const inStockFlag = parseInStockFlag(inStock);
  if (typeof inStockFlag === 'boolean') filter.inStock = inStockFlag;

  if (prescription === 'required') filter.prescription = true;
  if (prescription === 'none') filter.prescription = false;

  const or = makeTextSearchOr(q, ['name', 'genericName']);
  if (or) filter.$or = or;

  const price = buildPriceFilter(priceMin, priceMax);
  if (price) filter.price = price;

  return filter;
}

// Apply product filters to a Mongoose Query using fixed-field chaining
function applyProductFilters(qry, query) {
  const { category, inStock, prescription, q, priceMin, priceMax, type } = query;

  if (typeof type === 'string' && (type === 'medicine' || type === 'health')) {
    qry = qry.where('type').equals(type);
  }

  const cat = sanitizeCategory(category);
  if (cat) qry = qry.where('category').equals(cat);

  const inStockFlag = parseInStockFlag(inStock);
  if (typeof inStockFlag === 'boolean') qry = qry.where('inStock').equals(inStockFlag);

  if (prescription === 'required') qry = qry.where('prescription').equals(true);
  if (prescription === 'none') qry = qry.where('prescription').equals(false);

  const or = makeTextSearchOr(q, ['name', 'genericName']);
  if (or) qry = qry.or(or);

  const price = buildPriceFilter(priceMin, priceMax);
  if (price) {
    if (price.$gte !== undefined) qry = qry.where('price').gte(price.$gte);
    if (price.$lte !== undefined) qry = qry.where('price').lte(price.$lte);
  }

  return qry;
}

exports.getProducts = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query, 12, 50);
    const sort = parseSort(req.query.sort);

    const countQuery = applyProductFilters(Product.countDocuments(), req.query);
    const listQuery = applyProductFilters(Product.find(), req.query).sort(sort).skip(skip).limit(limit);

    const [total, items] = await Promise.all([countQuery, listQuery]);

    res.json({ data: items, page, pages: Math.ceil(total / limit) || 1, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    let q = Product.find();
    if (typeof req.query.type === 'string' && (req.query.type === 'medicine' || req.query.type === 'health')) {
      q = q.where('type').equals(req.query.type);
    }
    const categories = await q.distinct('category');
    // Custom compare: sort by length first, then case-insensitive for ties
    const compareCategories = (a = '', b = '') => {
      const la = a.length, lb = b.length;
      if (la !== lb) return la - lb; // shorter first
      return a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true });
    };
    res.json(categories.sort(compareCategories));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: create a new product (sanitize input and whitelist fields)
exports.createProduct = async (req, res) => {
  try {
    const payload = sanitizeCreateProduct(req.body);
    const saved = await new Product(payload).save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    if (err && err.status === 400) return res.status(400).json({ message: err.message });
    return res.status(500).json({ message: 'Server error' });
  }
};