// Sipariş  tablosu. Bir siparişin birden fazla ürünü olabilir.

module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    'OrderItem',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      lineTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: 'order_items',
      underscored: true,
      timestamps: true,
    }
  );

  return OrderItem;
};
