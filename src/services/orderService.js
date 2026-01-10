// Sipariş oluşturma ve listeleme işlemlerini toparlamak amacıyla oluşturdum.

const { Order, Customer } = require('../models');
const logger = require('../lib/logger');

async function listOrders() {
  return Order.findAll({
    limit: 50,
    order: [['id', 'DESC']]
  });
}

async function createOrder(payload) {
  const { customerId, customer, totalAmount, status } = payload;

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
      address: customer.address ?? null
    });

    finalCustomerId = createdCustomer.id;

    logger.info('order.guest_customer_created', {
      customer_id: finalCustomerId
    });
  }

  const order = await Order.create({
    customerId: finalCustomerId,
    totalAmount: totalAmount ?? null,
    status: status ?? 'pending'
  });

  logger.info('order.created', {
    order_id: order.id,
    customer_id: finalCustomerId
  });

  return order;
}

module.exports = {
  listOrders,
  createOrder
};
