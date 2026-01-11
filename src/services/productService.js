// Ürün CRUD ve stok yönetimi.

const { Product } = require('../models');
const logger = require('../lib/logger');

async function listProducts() {
  return Product.findAll({
    limit: 100,
    order: [['id', 'DESC']],
  });
}

async function getProduct(id) {
  const product = await Product.findByPk(id);
  if (!product) {
    const err = new Error('Ürün bulunamadı');
    err.statusCode = 404;
    throw err;
  }
  return product;
}

async function createProduct(payload) {
  const name = String(payload?.name ?? '').trim();
  const sku = String(payload?.sku ?? '').trim();
  const price = Number(payload?.price);
  const currency = String(payload?.currency ?? 'TRY').trim() || 'TRY';
  const priceType = String(payload?.priceType ?? 'list').trim() || 'list';
  const trackStock = payload?.trackStock !== false; // default true
  const stockQuantity = payload?.stockQuantity;

  if (!name) {
    const err = new Error('name zorunludur');
    err.statusCode = 400;
    throw err;
  }

  if (!sku) {
    const err = new Error('sku zorunludur');
    err.statusCode = 400;
    throw err;
  }

  if (!Number.isFinite(price) || price < 0) {
    const err = new Error('price geçersiz');
    err.statusCode = 400;
    throw err;
  }

  if (trackStock) {
    const sq = Number(stockQuantity);
    if (!Number.isFinite(sq) || sq < 0) {
      const err = new Error('trackStock=true iken stockQuantity 0 veya pozitif olmalıdır');
      err.statusCode = 400;
      throw err;
    }
  }

  const exists = await Product.findOne({ where: { sku } });
  if (exists) {
    const err = new Error('SKU zaten kullanılıyor');
    err.statusCode = 409;
    throw err;
  }

  const created = await Product.create({
    name,
    sku,
    price,
    currency,
    priceType,
    trackStock,
    stockQuantity: trackStock ? Number(stockQuantity) : null,
    isActive: payload?.isActive !== false,
  });

  logger.info('product.created', { product_id: created.id, sku: created.sku });

  return created;
}

async function updateProduct(id, payload) {
  const product = await getProduct(id);

  const patch = {};

  if (payload?.name !== undefined) {
    patch.name = String(payload.name ?? '').trim();
    if (!patch.name) {
      const err = new Error('name boş olamaz');
      err.statusCode = 400;
      throw err;
    }
  }

  if (payload?.price !== undefined) {
    const price = Number(payload.price);
    if (!Number.isFinite(price) || price < 0) {
      const err = new Error('price geçersiz');
      err.statusCode = 400;
      throw err;
    }
    patch.price = price;
  }

  if (payload?.currency !== undefined) {
    patch.currency = String(payload.currency ?? '').trim() || 'TRY';
  }

  if (payload?.priceType !== undefined) {
    patch.priceType = String(payload.priceType ?? '').trim() || 'list';
  }

  if (payload?.isActive !== undefined) {
    patch.isActive = payload.isActive === true;
  }

  if (payload?.trackStock !== undefined) {
    patch.trackStock = payload.trackStock === true;
  }

  if (payload?.stockQuantity !== undefined) {
    const sq = Number(payload.stockQuantity);
    if (!Number.isFinite(sq) || sq < 0) {
      const err = new Error('stockQuantity geçersiz');
      err.statusCode = 400;
      throw err;
    }
    patch.stockQuantity = sq;
  }

  // If turning off stock tracking, stock_quantity can be null.
  if (patch.trackStock === false) {
    patch.stockQuantity = null;
  }

  await product.update(patch);

  logger.info('product.updated', { product_id: product.id });

  return product;
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
};
