'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('app_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      level: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      trace_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      meta: {
        type: Sequelize.JSONB,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('app_logs', ['trace_id'], {
      name: 'ix_app_logs_trace_id',
    });

    await queryInterface.addIndex('app_logs', ['created_at'], {
      name: 'ix_app_logs_created_at',
    });
  },

  async down(queryInterface) {
    try {
      await queryInterface.removeIndex('app_logs', 'ix_app_logs_trace_id');
    } catch (e) {}
    try {
      await queryInterface.removeIndex('app_logs', 'ix_app_logs_created_at');
    } catch (e) {}
    await queryInterface.dropTable('app_logs');
  },
};
