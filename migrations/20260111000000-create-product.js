'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      sku: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      currency: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'TRY',
      },

      price_type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'list',
      },

      track_stock: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      stock_quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('products');
  },
};
