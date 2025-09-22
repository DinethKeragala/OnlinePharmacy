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
    const sort = parseSort(req.query.sort);

    // Build chained queries to avoid constructing DB queries from user-shaped objects
    const applyFilters = (qry) => {
      const { category, inStock, q, priceMin, priceMax } = req.query;

      const cat = sanitizeCategory(category);
      if (cat) qry = qry.where('category').equals(cat);

      const inStockFlag = parseInStockFlag(inStock);
      if (typeof inStockFlag === 'boolean') qry = qry.where('inStock').equals(inStockFlag);

      const or = makeTextSearchOr(q, ['name', 'genericName']);
      if (or) qry = qry.or(or);

      const price = buildPriceFilter(priceMin, priceMax);
      if (price) {
        if (price.$gte !== undefined) qry = qry.where('price').gte(price.$gte);
        if (price.$lte !== undefined) qry = qry.where('price').lte(price.$lte);
      }

      return qry;
    };

    const countQuery = applyFilters(HealthProduct.countDocuments());
    const listQuery = applyFilters(HealthProduct.find()).sort(sort).skip(skip).limit(limit);

    const [total, items] = await Promise.all([countQuery, listQuery]);

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
    // Custom compare: sort by length first, then case-insensitive lexicographic for ties
    const compareCategories = (a = '', b = '') => {
      const la = a.length, lb = b.length;
      if (la !== lb) return la - lb; // shorter names first
      return a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true });
    };
    res.json(categories.sort(compareCategories));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
