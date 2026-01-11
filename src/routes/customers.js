// Müşteri endpoint'lerini tanımladım.

const express = require('express');
const router = express.Router();
const customerService = require('../services/customerService');

// GET /api/customers
router.get('/', async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const customers = await customerService.listCustomers({ limit, offset });
    res.json(customers);
  } catch (err) {
    next(err);
  }
});

// GET /api/customers/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ message: 'Geçersiz müşteri id' });
    }

    const customer = await customerService.getCustomerById(id);
    res.json(customer);
  } catch (err) {
    next(err);
  }
});

// POST /api/customers
router.post('/', async (req, res, next) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (err) {
    next(err);
  }
});

// PUT /api/customers/:id
router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ message: 'Geçersiz müşteri id' });
    }

    const customer = await customerService.updateCustomer(id, req.body);
    res.json(customer);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/customers/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ message: 'Geçersiz müşteri id' });
    }

    const result = await customerService.deleteCustomer(id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
