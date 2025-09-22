const HealthProduct = require('../models/HealthProduct');
const { isValidObjectId } = require('../utils/safeQuery');
const {
  sanitizeCategory,
  parseInStockFlag,
  buildPriceFilter,
  makeTextSearchOr,
  parsePagination,
  parseSort,
} = require('../utils/queryBuilders');

function buildFilter(query) {
  const filter = {};
  const { category, inStock, q, priceMin, priceMax } = query;

  const cat = sanitizeCategory(category);
  if (cat) filter.category = cat;

  const inStockFlag = parseInStockFlag(inStock);
  if (typeof inStockFlag === 'boolean') filter.inStock = inStockFlag;

  const or = makeTextSearchOr(q, ['name', 'genericName']);
  if (or) filter.$or = or;

  const price = buildPriceFilter(priceMin, priceMax);
  if (price) filter.price = price;
  return filter;
}

exports.getHealthProducts = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query, 12, 50);
    const filter = buildFilter(req.query);
    const sort = parseSort(req.query.sort);

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
