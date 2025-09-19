const Product = require('../models/Product');

// Build Mongo filter from query params
function buildFilter(query) {
  const filter = {};
  const { category, inStock, prescription, q, priceMin, priceMax, type } = query;

  if (type) filter.type = type;
  if (category && category !== 'all') filter.category = category;
  if (typeof inStock !== 'undefined') filter.inStock = inStock === 'true';
  if (prescription === 'required') filter.prescription = true;
  if (prescription === 'none') filter.prescription = false;
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { genericName: { $regex: q, $options: 'i' } },
    ];
  }
  const price = {};
  if (priceMin) price.$gte = Number(priceMin);
  if (priceMax) price.$lte = Number(priceMax);
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
    const product = await Product.findById(req.params.id);
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
    if (req.query.type) match.type = req.query.type;
    const categories = await Product.distinct('category', match);
    res.json(categories.sort());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};