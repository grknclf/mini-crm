// Ürün tablosu. Bazı ürünlerde stok takibi yapılabilir.

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'TRY',
      },

      priceType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'list',
      },

      trackStock: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      stockQuantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: 'products',
      underscored: true,
      timestamps: true,
    }
  );

  return Product;
};
