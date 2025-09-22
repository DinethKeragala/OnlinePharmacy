const HealthProduct = require('../models/HealthProduct');
const { safeRegexContains, toFiniteNumber, isValidObjectId } = require('../utils/safeQuery');

function buildFilter(query) {
  const filter = {};
  const { category, inStock, q, priceMin, priceMax } = query;

  if (typeof category === 'string' && category !== 'all') {
    const trimmed = category.trim();
    if (trimmed && /^[\w\s-]{1,64}$/.test(trimmed)) {
      filter.category = trimmed;
    }
  }
  if (typeof inStock !== 'undefined') filter.inStock = inStock === 'true';
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

exports.getHealthProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 12, 50);
    const skip = (page - 1) * limit;
    const filter = buildFilter(req.query);

    let sort = { createdAt: -1 };
    if (req.query.sort === 'price_asc') sort = { price: 1 };
    if (req.query.sort === 'price_desc') sort = { price: -1 };
    if (req.query.sort === 'rating_desc') sort = { rating: -1 };

    const [total, items] = await Promise.all([
      HealthProduct.countDocuments(filter),
      HealthProduct.find(filter).sort(sort).skip(skip).limit(limit),
    ]);

    res.json({ data: items, page, pages: Math.ceil(total / limit) || 1, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getHealthProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
    const item = await HealthProduct.findById(id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getHealthCategories = async (req, res) => {
  try {
    const categories = await HealthProduct.distinct('category');
    res.json(categories.sort());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
