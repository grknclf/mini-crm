// Müşteriyle ilgili iş kurallarının tümü. Müşteri oluşturma, güncelleme, listeleme.

const { Op } = require('sequelize');
const { Customer } = require('../models');
const logger = require('../lib/logger');
const { normalizePhone, normalizeEmail } = require('../helpers/customerNormalizer');

function httpError(statusCode, message, details = undefined) {
  const err = new Error(message);
  err.statusCode = statusCode;
  if (details !== undefined) err.details = details;
  return err;
}

async function listCustomers({ limit = 50, offset = 0 } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 200);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  return Customer.findAll({
    where: { isActive: true },
    limit: safeLimit,
    offset: safeOffset,
    order: [['id', 'DESC']]
  });
}

async function getCustomerById(id) {
  const customer = await Customer.findOne({
    where: { id, isActive: true }
  });

  if (!customer) {
    throw httpError(404, 'Müşteri bulunamadı');
  }

  return customer;
}

async function createCustomer(payload) {
  if (!payload || typeof payload !== 'object') {
    throw httpError(400, 'Geçersiz istek gövdesi');
  }

  const firstName = String(payload.firstName ?? '').trim();
  if (!firstName) {
    throw httpError(400, 'firstName zorunludur');
  }

  const lastName =
    payload.lastName === undefined || payload.lastName === null
      ? null
      : String(payload.lastName).trim() || null;

  const phone = normalizePhone(payload.phone);
  const email = normalizeEmail(payload.email);

  if (!email && !phone) {
    throw httpError(400, 'Mail veya telefon alanlarından en az biri zorunludur');
  }

  {
    const whereOr = [];
    if (email) whereOr.push({ email });
    if (phone) whereOr.push({ phone });

    const existing = await Customer.findOne({
      where: {
        isActive: true,
        [Op.or]: whereOr
      }
    });

    if (existing) {
      throw httpError(
        409,
        'Duplicate müşteri: aynı email veya telefon zaten kayıtlı'
      );
    }
  }

  logger.info('customer.create', {
    email_present: Boolean(email),
    phone_present: Boolean(phone)
  });

  const customer = await Customer.create({
    firstName,
    lastName,
    phone,
    email,
    address: payload.address ?? null,
    note: payload.note ?? null
  });

  return customer;
}

async function updateCustomer(id, payload) {
  if (!payload || typeof payload !== 'object') {
    throw httpError(400, 'Geçersiz istek gövdesi');
  }

  const customer = await getCustomerById(id);
  const next = {};

  if (payload.firstName !== undefined) {
    const v = String(payload.firstName ?? '').trim();
    if (!v) throw httpError(400, 'firstName boş olamaz');
    next.firstName = v;
  }

  if (payload.lastName !== undefined) {
    const v = payload.lastName === null ? null : String(payload.lastName).trim();
    next.lastName = v || null;
  }

  if (payload.phone !== undefined) {
    next.phone = normalizePhone(payload.phone);
  }

  if (payload.email !== undefined) {
    next.email = normalizeEmail(payload.email);
  }

  if (payload.address !== undefined) {
    next.address = payload.address ?? null;
  }

  if (payload.note !== undefined) {
    next.note = payload.note ?? null;
  }

  // email veya telefon şartı korunur
  const finalEmail =
    next.email !== undefined ? next.email : customer.email;
  const finalPhone =
    next.phone !== undefined ? next.phone : customer.phone;

  if (!finalEmail && !finalPhone) {
    throw httpError(400, 'Mail veya telefon alanlarından en az biri zorunludur');
  }
  if (next.email || next.phone) {
    const whereOr = [];
    if (next.email) whereOr.push({ email: next.email });
    if (next.phone) whereOr.push({ phone: next.phone });

    const dup = await Customer.findOne({
      where: {
        isActive: true,
        id: { [Op.ne]: customer.id },
        [Op.or]: whereOr
      }
    });

    if (dup) {
      throw httpError(
        409,
        'Duplicate müşteri: aynı email veya telefon zaten kayıtlı'
      );
    }
  }

  logger.info('customer.update', { customer_id: customer.id });

  await customer.update(next);
  return customer;
}

async function deleteCustomer(id) {
  const customer = await getCustomerById(id);

  logger.info('customer.delete', { customer_id: customer.id });

  await customer.update({ isActive: false });
  return { success: true };
}

module.exports = {
  listCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
