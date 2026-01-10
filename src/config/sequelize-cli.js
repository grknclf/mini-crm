// Migration için  db ayarlarını tanımladım.
// Migrate komutunun .env de bulunan DATABASE_URL üzerinden doğru dbye bağlanmasını sağlamaya ölıştım.

require('dotenv').config();

const common = {
  dialect: 'postgres',
  logging: false
};

const sslOptions =
  process.env.DB_SSL === 'true'
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {};

const fromParts = (fallbackDbName) => ({
  ...common,
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  database: process.env.DB_NAME || fallbackDbName,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || null,
  dialectOptions: sslOptions
});

module.exports = {
  development: process.env.DATABASE_URL
    ? {
        ...common,
        use_env_variable: 'DATABASE_URL',
        dialectOptions: sslOptions
      }
    : fromParts('mini_crm_dev'),

  test: process.env.DATABASE_URL
    ? {
        ...common,
        use_env_variable: 'DATABASE_URL',
        dialectOptions: sslOptions
      }
    : fromParts('mini_crm_test'),

  production: {
    ...common,
    use_env_variable: 'DATABASE_URL',
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
  }
};
