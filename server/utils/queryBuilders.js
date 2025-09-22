const { safeRegexContains, toFiniteNumber } = require('./safeQuery');

function sanitizeCategory(val) {
  if (typeof val !== 'string' || val === 'all') return undefined;
  const trimmed = val.trim();
  if (trimmed && /^[\w\s-]{1,64}$/.test(trimmed)) return trimmed;
  return undefined;
}

function parseInStockFlag(val) {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') return val === 'true';
  return undefined;
}

function buildPriceFilter(min, max) {
  const pmin = toFiniteNumber(min);
  const pmax = toFiniteNumber(max);
  const price = {};
  if (pmin !== null) price.$gte = pmin;
  if (pmax !== null) price.$lte = pmax;
  return Object.keys(price).length ? price : undefined;
}

function makeTextSearchOr(q, fields = ['name', 'genericName'], maxLen = 128) {
  if (!q) return undefined;
  const rx = safeRegexContains(String(q).slice(0, maxLen));
  return fields.map((f) => ({ [f]: rx }));
}

function parsePagination(query, defaultLimit = 12, maxLimit = 50) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || defaultLimit), maxLimit);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function parseSort(sortParam) {
  switch (sortParam) {
    case 'price_asc':
      return { price: 1 };
    case 'price_desc':
      return { price: -1 };
    case 'rating_desc':
      return { rating: -1 };
    default:
      return { createdAt: -1 };
  }
}

module.exports = {
  sanitizeCategory,
  parseInStockFlag,
  buildPriceFilter,
  makeTextSearchOr,
  parsePagination,
  parseSort,
};
