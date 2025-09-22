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
    res.json(categories.sort());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: create a new product (sanitize input and whitelist fields)
exports.createProduct = async (req, res) => {
  try {
    const body = req.body || {};

    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 200) : '';
    const description = typeof body.description === 'string' ? body.description.trim().slice(0, 5000) : '';
    const genericName = typeof body.genericName === 'string' ? body.genericName.trim().slice(0, 200) : undefined;
    const categoryRaw = typeof body.category === 'string' ? body.category.trim() : '';
    const category = /^[\w\s-]{1,64}$/.test(categoryRaw) ? categoryRaw : '';
    const type = typeof body.type === 'string' && (body.type === 'medicine' || body.type === 'health') ? body.type : 'medicine';

    const priceNum = toFiniteNumber(body.price);
    const price = priceNum !== null ? Math.max(0, priceNum) : null;

    const inStock = typeof body.inStock === 'boolean' ? body.inStock : Boolean(body.inStock);
    const stockNum = toFiniteNumber(body.stock);
    const stock = stockNum !== null ? Math.max(0, Math.floor(stockNum)) : 0;

    const prescription = typeof body.prescription === 'boolean' ? body.prescription : Boolean(body.prescription);

    const ratingNum = toFiniteNumber(body.rating);
    const rating = ratingNum !== null ? Math.max(0, Math.min(5, ratingNum)) : undefined;

    let imageUrl;
    if (typeof body.imageUrl === 'string') {
      const u = body.imageUrl.trim();
      if (u.length <= 1024 && /^(https?:)\/\//i.test(u)) imageUrl = u;
    }

    let tags;
    if (Array.isArray(body.tags)) {
      tags = body.tags
        .filter((t) => typeof t === 'string')
        .map((t) => t.trim())
        .filter((t) => t)
        .slice(0, 20)
        .map((t) => t.slice(0, 50));
      if (!tags.length) tags = undefined;
    }

    if (!name || !description || price === null || !category) {
      return res.status(400).json({ message: 'Missing or invalid required fields' });
    }

    const doc = new Product({
      name,
      description,
      genericName,
      price,
      category,
      imageUrl,
      inStock,
      stock,
      prescription,
      type,
      tags,
      rating,
    });
    const saved = await doc.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};