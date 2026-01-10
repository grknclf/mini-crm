'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending'
      },

      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.addIndex('orders', ['customer_id'], {
      name: 'ix_orders_customer_id'
    });
  },

  async down(queryInterface) {
    try {
      await queryInterface.removeIndex('orders', 'ix_orders_customer_id');
    } catch (e) {
    }

    await queryInterface.dropTable('orders');
  }
};
