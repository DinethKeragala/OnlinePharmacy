const Product = require('../models/Product');
const { safeRegexContains, toFiniteNumber, isValidObjectId } = require('../utils/safeQuery');

// Build Mongo filter from query params
function buildFilter(query) {
  const filter = {};
  const { category, inStock, prescription, q, priceMin, priceMax, type } = query;

  // type: whitelist allowed types only
  if (typeof type === 'string' && (type === 'medicine' || type === 'health')) {
    filter.type = type;
  }

  // category: accept only simple safe strings
  if (typeof category === 'string' && category !== 'all') {
    const trimmed = category.trim();
    if (trimmed && /^[\w\s-]{1,64}$/.test(trimmed)) {
      filter.category = trimmed;
    }
  }
  if (typeof inStock !== 'undefined') filter.inStock = inStock === 'true';
  if (prescription === 'required') filter.prescription = true;
  if (prescription === 'none') filter.prescription = false;
  if (q) {
    const rx = safeRegexContains(String(q).slice(0, 128));
    filter.$or = [ { name: rx }, { genericName: rx } ];
  }
  const price = {};
  const pmin = toFiniteNumber(priceMin);
  const pmax = toFiniteNumber(priceMax);
  if (pmin !== null) price.$gte = pmin;
  if (pmax !== null) price.$lte = pmax;
  if (Object.keys(price).length) filter.price = price;

  return filter;
}

exports.getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 12, 50);
    const skip = (page - 1) * limit;

    const filter = buildFilter(req.query);

    // sorting
    let sort = { createdAt: -1 };
    if (req.query.sort === 'price_asc') sort = { price: 1 };
    if (req.query.sort === 'price_desc') sort = { price: -1 };
    if (req.query.sort === 'rating_desc') sort = { rating: -1 };

    const [total, items] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter).sort(sort).skip(skip).limit(limit)
    ]);

    res.json({
      data: items,
      page,
      pages: Math.ceil(total / limit) || 1,
      total,
    });
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
    const match = {};
    if (typeof req.query.type === 'string' && (req.query.type === 'medicine' || req.query.type === 'health')) {
      match.type = req.query.type;
    }
    const categories = await Product.distinct('category', match);
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