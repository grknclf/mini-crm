// Bu dosyada Express uygulamasını kurdum. Middleware, route ve merkezi hata yaklama kısını toparladım.

const express = require('express');
const logger = require('./lib/logger');
const requestContext = require('./middlewares/requestContext');

const customersRouter = require('./routes/customers');
const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');

const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./docs/openapi.json');

const app = express();

app.use(express.json());
app.use(requestContext);

if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    const start = Date.now();

    logger.info('request.start', {
      trace_id: req.traceId,
      method: req.method,
      path: req.originalUrl,
    });

    res.on('finish', () => {
      logger.info('request.end', {
        trace_id: req.traceId,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        duration_ms: Date.now() - start,
      });
    });

    next();
  });
}

app.use('/api/customers', customersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/products', productsRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use((err, req, res, next) => {
  const statusCode = Number(err?.statusCode) || 500;

  logger.error('request.error', {
    trace_id: req.traceId,
    status: statusCode,
    message: err?.message,
    details: err?.details,
  });

  res.status(statusCode).json({
    message: err?.message || 'Bir hata oluştu',
    traceId: req.traceId,
    details: err?.details,
  });
});

module.exports = app;
