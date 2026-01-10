const app = require('./app');
const { sequelize } = require('./models');
const config = require('./config');
const logger = require('./lib/logger');

async function start() {
  try {
    await sequelize.authenticate();
    logger.info('DB connection OK');

    app.listen(config.app.port, () => {
      logger.info(`Server listening on port ${config.app.port}`);
    });
  } catch (err) {
      console.error('Unable to start server:', err);

    logger.error('Unable to start server', { err });
    process.exit(1);
  }
}

start();
