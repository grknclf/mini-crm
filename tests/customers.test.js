jest.setTimeout(30000);

const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Customers API', () => {
  test('GET /api/customers initially returns empty array', async () => {
    const res = await request(app).get('/api/customers');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test('POST /api/customers returns 400 when email and phone missing', async () => {
    const res = await request(app).post('/api/customers').send({ firstName: 'Test' });

    expect(res.statusCode).toBe(400);
  });

  test('POST /api/customers creates customer with minimal valid data (email)', async () => {
    const res = await request(app)
      .post('/api/customers')
      .send({ firstName: 'Test', email: 'test@test.com' });

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.firstName).toBe('Test');
    expect(res.body.email).toBe('test@test.com');
  });

  test('POST /api/customers prevents duplicate by email', async () => {
    await request(app).post('/api/customers').send({ firstName: 'A', email: 'dup@test.com' });

    const res = await request(app)
      .post('/api/customers')
      .send({ firstName: 'B', email: 'dup@test.com' });

    expect(res.statusCode).toBe(409);
  });

  test('POST /api/customers normalizes phone number', async () => {
    const res = await request(app).post('/api/customers').send({
      firstName: 'Phone',
      phone: '0532 111 22 33',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.phone).toBe('+905321112233');
  });

  test('DELETE /api/customers/:id performs soft delete', async () => {
    const createRes = await request(app)
      .post('/api/customers')
      .send({ firstName: 'DeleteMe', email: 'deleteme@test.com' });

    const id = createRes.body.id;

    const delRes = await request(app).delete(`/api/customers/${id}`);
    expect(delRes.statusCode).toBe(200);

    const listRes = await request(app).get('/api/customers');
    const ids = listRes.body.map((x) => x.id);

    expect(ids).not.toContain(id);
  });
});

describe('Orders API', () => {
  test('GET /api/orders returns array (200)', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/orders creates order with existing customerId', async () => {
    const cRes = await request(app)
      .post('/api/customers')
      .send({ firstName: 'OrderCustomer', email: 'order.customer@test.com' });

    expect(cRes.statusCode).toBe(201);
    const customerId = cRes.body.id;

    const oRes = await request(app)
      .post('/api/orders')
      .send({ customerId, totalAmount: 100.5, status: 'pending' });

    expect(oRes.statusCode).toBe(201);
    expect(oRes.body.id).toBeDefined();
    expect(oRes.body.customerId).toBe(customerId);
    expect(oRes.body.status).toBe('pending');
  });

  test('POST /api/orders creates order when customer does not exist (guest customer flow)', async () => {
    const oRes = await request(app)
      .post('/api/orders')
      .send({
        totalAmount: 50,
        customer: { firstName: 'GuestUser', email: 'guest.user@test.com' },
      });

    expect(oRes.statusCode).toBe(201);
    expect(oRes.body.id).toBeDefined();
    expect(oRes.body.customerId).toBeDefined();
    expect(oRes.body.status).toBeDefined();
  });

  test('POST /api/orders returns 400 when no customerId and customer.firstName missing', async () => {
    const oRes = await request(app).post('/api/orders').send({ totalAmount: 10, customer: {} });

    expect(oRes.statusCode).toBe(400);
  });

  test('POST /api/orders with items decrements stock for trackStock=true products', async () => {
    const cRes = await request(app)
      .post('/api/customers')
      .send({ firstName: 'StockUser', email: 'stock.user@test.com' });

    const customerId = cRes.body.id;

    const p1 = await request(app).post('/api/products').send({
      name: 'Stoklu Ürün',
      sku: 'SKU-STOK-1',
      price: 10,
      trackStock: true,
      stockQuantity: 5,
    });
    expect(p1.statusCode).toBe(201);

    const p2 = await request(app).post('/api/products').send({
      name: 'Stoksuz Ürün',
      sku: 'SKU-NOSTOCK-1',
      price: 7.5,
      trackStock: false,
    });
    expect(p2.statusCode).toBe(201);

    const oRes = await request(app)
      .post('/api/orders')
      .send({
        customerId,
        items: [
          { productId: p1.body.id, quantity: 2 },
          { productId: p2.body.id, quantity: 3 },
        ],
      });

    expect(oRes.statusCode).toBe(201);
    expect(oRes.body.totalAmount).toBe('42.50');

    const p1After = await request(app).get(`/api/products/${p1.body.id}`);
    expect(p1After.statusCode).toBe(200);
    expect(p1After.body.stockQuantity).toBe(3);

    const p2After = await request(app).get(`/api/products/${p2.body.id}`);
    expect(p2After.statusCode).toBe(200);
    expect(p2After.body.stockQuantity).toBeNull();
  });

  test('POST /api/orders with items returns 400 when stock is insufficient', async () => {
    const cRes = await request(app)
      .post('/api/customers')
      .send({ firstName: 'StockFailUser', email: 'stock.fail@test.com' });

    const customerId = cRes.body.id;

    const p = await request(app).post('/api/products').send({
      name: 'Az Stok Ürün',
      sku: 'SKU-LOW-1',
      price: 5,
      trackStock: true,
      stockQuantity: 1,
    });
    expect(p.statusCode).toBe(201);

    const oRes = await request(app)
      .post('/api/orders')
      .send({
        customerId,
        items: [{ productId: p.body.id, quantity: 2 }],
      });

    expect(oRes.statusCode).toBe(400);
  });
});

describe('Products API', () => {
  test('POST /api/products creates product and prevents duplicate SKU', async () => {
    const res1 = await request(app).post('/api/products').send({
      name: 'Ürün 1',
      sku: 'SKU-DUP-1',
      price: 1.25,
      trackStock: true,
      stockQuantity: 10,
    });
    expect(res1.statusCode).toBe(201);

    const res2 = await request(app).post('/api/products').send({
      name: 'Ürün 2',
      sku: 'SKU-DUP-1',
      price: 2,
      trackStock: false,
    });
    expect(res2.statusCode).toBe(409);
  });
});
