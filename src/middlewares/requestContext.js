// Her request için bir traceId üretip aldım.

const crypto = require('crypto');

module.exports = function requestContext(req, res, next) {
  const incoming = req.header('X-Request-Id');
  const id =
    incoming && String(incoming).trim()
      ? String(incoming).trim()
      : crypto.randomUUID();

  req.traceId = id;
  res.setHeader('X-Request-Id', id);
  next();
};
