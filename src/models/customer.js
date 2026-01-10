// Müşteri tablosu. Temel müşteri bilgileri ve soft delete mantığı burada tutulur.

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'Customer',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },

      lastName: {
        type: DataTypes.STRING,
        allowNull: true
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true
      },

      address: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      note: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      tableName: 'customers',
      underscored: true,
      timestamps: true
    }
  );

  return Customer;
};
