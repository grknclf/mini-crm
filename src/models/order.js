// Sipariş Tablosu Her sipariş bir müşteriye bağlı.

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
      },

      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      }
    },
    {
      tableName: 'orders',
      underscored: true,
      timestamps: true
    }
  );

  return Order;
};
