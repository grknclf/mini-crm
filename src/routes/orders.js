// Sipariş endpoint'lerini tanımlıyorum.

const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');

// GET /api/orders
router.get('/', async (req, res, next) => {
  try {
    const orders = await orderService.listOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// POST /api/orders
router.post('/', async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
