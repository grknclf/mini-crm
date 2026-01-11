// Loglama yapısını kuruyorum. Konsol, dosya ve veritabanı hedeflerine log atıyorum.

const winston = require('winston');
const Transport = require('winston-transport');
const path = require('path');
const fs = require('fs');

let sequelize = null;
try {
  ({ sequelize } = require('../models'));
} catch (_) {}

const logDir = path.resolve(process.cwd(), 'logs');
fs.mkdirSync(logDir, { recursive: true });

class DbErrorTransport extends Transport {
  constructor(opts = {}) {
    super(opts);
    this.sequelize = opts.sequelize || null;
    this.enabled = Boolean(this.sequelize);
  }

  log(info, callback) {
    setImmediate(() => this.emit('logged', info));

    try {
      const level = String(info.level || '').toLowerCase();

      if (!this.enabled || (level !== 'error' && level !== 'warn')) {
        return callback();
      }

      const message = info.message || '';
      const traceId = info.trace_id || info.traceId || null;
      const { level: _l, message: _m, ...meta } = info;

      this.sequelize
        .query(
          `
          INSERT INTO app_logs(level, message, trace_id, meta, created_at)
          VALUES (:level, :message, :trace_id, CAST(:meta AS jsonb), NOW())
          `,
          {
            replacements: {
              level,
              message,
              trace_id: traceId,
              meta: JSON.stringify(meta),
            },
          }
        )
        .then(() => callback())
        .catch(() => callback());
    } catch (_) {
      callback();
    }
  }
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: {
    service: process.env.SERVICE_NAME || 'mini-crm',
    env: process.env.NODE_ENV || 'development',
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDir, 'app.log'),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'warn',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    new DbErrorTransport({ sequelize }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join(logDir, 'exceptions.log') }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join(logDir, 'rejections.log') }),
  ],
});

module.exports = logger;
