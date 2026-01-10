// Sequelize bağlantım ve modeller arası ilişkiler.

const { Sequelize } = require('sequelize');
const config = require('../config');
const logger = require('../lib/logger');

const sequelizeLogging =
  config.app.env === 'test'
    ? false
    : (msg) => logger.debug('sequelize', { trace_id: null, message: msg });

const sequelize = config.db.url
  ? new Sequelize(config.db.url, {
      dialect: config.db.dialect,
      logging: sequelizeLogging,
      ...config.db.options
    })
  : new Sequelize(
      config.db.parts.database,
      config.db.parts.username,
      config.db.parts.password,
      {
        host: config.db.parts.host,
        port: config.db.parts.port,
        dialect: config.db.dialect,
        logging: sequelizeLogging,
        ...config.db.options
      }
    );

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Customer = require('./customer')(sequelize, Sequelize.DataTypes);
db.Order = require('./order')(sequelize, Sequelize.DataTypes);

// İlişkiler
db.Customer.hasMany(db.Order, { foreignKey: 'customerId' });
db.Order.belongsTo(db.Customer, { foreignKey: 'customerId' });

module.exports = db;
