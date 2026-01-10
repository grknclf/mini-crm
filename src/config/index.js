// Ortam (dev/test/prod) konfigürasyonunu topladım. Çalıştırma sırasında ortam değişkenlerinden gelen değerleri okuyup
// uygulama, log ve veritabanı ayarlarını tek bir yerden yönetmeye çalıştım.

const dotenv = require('dotenv');

dotenv.config();

const env = process.env.NODE_ENV || 'development';

const toInt = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const toBool = (v, fallback = false) => {
  if (v === undefined || v === null || v === '') return fallback;
  const s = String(v).toLowerCase();
  return s === 'true' || s === '1';
};

const dbSsl = toBool(process.env.DB_SSL, false);

const databaseUrl = process.env.DATABASE_URL
  ? String(process.env.DATABASE_URL).trim()
  : null;

const dbParts = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: toInt(process.env.DB_PORT, 5432),
  database: process.env.DB_NAME || 'mini_crm_dev',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || null
};

module.exports = {
  app: {
    env,
    port: toInt(process.env.APP_PORT, 3000)
  },
  log: {
    level:
      process.env.LOG_LEVEL ||
      (env === 'production' ? 'info' : env === 'test' ? 'info' : 'debug')
  },
  db: {
    dialect: 'postgres',
    url: databaseUrl,
    parts: dbParts,
    options: {
      dialectOptions: dbSsl
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
      logging: false
    }
  }
};
