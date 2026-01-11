// Sipariş oluşturma ve listeleme işlemlerini toparlamak amacıyla oluşturdum.

const { Order, Customer, Product, OrderItem, sequelize } = require('../models');
const logger = require('../lib/logger');

async function listOrders() {
  return Order.findAll({
    limit: 50,
    order: [['id', 'DESC']],
  });
}

async function createOrder(payload) {
  const { customerId, customer, totalAmount, status, items } = payload;

  const hasItems = Array.isArray(items) && items.length > 0;

  if (!hasItems) {
    let finalCustomerId = customerId;

    if (!finalCustomerId) {
      if (!customer || !customer.firstName) {
        const err = new Error('Müşteri yoksa en az firstName gönderilmelidir');
        err.statusCode = 400;
        throw err;
      }

      const createdCustomer = await Customer.create({
        firstName: customer.firstName,
        lastName: customer.lastName ?? null,
        phone: customer.phone ?? null,
        email: customer.email ?? null,
        address: customer.address ?? null,
      });

      finalCustomerId = createdCustomer.id;

      logger.info('order.guest_customer_created', {
        customer_id: finalCustomerId,
      });
    }

    const order = await Order.create({
      customerId: finalCustomerId,
      totalAmount: totalAmount ?? null,
      status: status ?? 'pending',
    });

    logger.info('order.created', {
      order_id: order.id,
      customer_id: finalCustomerId,
    });

    return order;
  }

  // Items'lı yeni akış: ürün doğrulama + stok düşme + order_items
  return sequelize.transaction(async (t) => {
    let finalCustomerId = customerId;

    if (!finalCustomerId) {
      if (!customer || !customer.firstName) {
        const err = new Error('Müşteri yoksa en az firstName gönderilmelidir');
        err.statusCode = 400;
        throw err;
      }

      const createdCustomer = await Customer.create(
        {
          firstName: customer.firstName,
          lastName: customer.lastName ?? null,
          phone: customer.phone ?? null,
          email: customer.email ?? null,
          address: customer.address ?? null,
        },
        { transaction: t }
      );

      finalCustomerId = createdCustomer.id;

      logger.info('order.guest_customer_created', {
        customer_id: finalCustomerId,
      });
    }

    const normalizedItems = items
      .map((x) => ({
        productId: Number(x?.productId),
        quantity: Number(x?.quantity),
      }))
      .filter((x) => Number.isFinite(x.productId) && x.productId > 0);

    if (
      !normalizedItems.length ||
      normalizedItems.some((x) => !Number.isFinite(x.quantity) || x.quantity <= 0)
    ) {
      const err = new Error('Sipariş kalemleri (items) geçersiz');
      err.statusCode = 400;
      throw err;
    }

    const qtyByProduct = new Map();
    for (const it of normalizedItems) {
      qtyByProduct.set(it.productId, (qtyByProduct.get(it.productId) || 0) + it.quantity);
    }

    const productIds = Array.from(qtyByProduct.keys());

    const products = await Product.findAll({
      where: { id: productIds, isActive: true },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (products.length !== productIds.length) {
      const found = new Set(products.map((p) => p.id));
      const missing = productIds.filter((id) => !found.has(id));
      const err = new Error('Ürün bulunamadı');
      err.statusCode = 404;
      err.details = { missingProductIds: missing };
      throw err;
    }

    let computedTotal = 0;
    const orderItemsPayload = [];

    for (const p of products) {
      const qty = qtyByProduct.get(p.id);

      if (p.trackStock) {
        const currentStock = Number(p.stockQuantity ?? 0);
        if (currentStock < qty) {
          const err = new Error('Stok yetersiz');
          err.statusCode = 400;
          err.details = { productId: p.id, requested: qty, available: currentStock };
          throw err;
        }

        await p.update({ stockQuantity: currentStock - qty }, { transaction: t });
      }

      const unitPrice = Number(p.price);
      const lineTotal = unitPrice * qty;
      computedTotal += lineTotal;

      orderItemsPayload.push({
        productId: p.id,
        quantity: qty,
        unitPrice: unitPrice.toFixed(2),
        lineTotal: lineTotal.toFixed(2),
      });
    }

    const order = await Order.create(
      {
        customerId: finalCustomerId,
        totalAmount: computedTotal.toFixed(2),
        status: status ?? 'pending',
      },
      { transaction: t }
    );

    await OrderItem.bulkCreate(
      orderItemsPayload.map((x) => ({ ...x, orderId: order.id })),
      { transaction: t }
    );

    logger.info('order.created', {
      order_id: order.id,
      customer_id: finalCustomerId,
      item_count: orderItemsPayload.length,
      total_amount: computedTotal.toFixed(2),
    });

    return order;
  });
}

module.exports = {
  listOrders,
  createOrder,
};
