'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sell_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Sell, {foreignKey: 'sellId', as: 'sells'});
      this.belongsTo(models.Item, {foreignKey: 'itemId', as: 'item'});
    }
  }
  Sell_detail.init({
    sellId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    itemId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    qty: {
      defaultValue: 0,
      type: DataTypes.DOUBLE,
      validate:{
        isFloat: true
      }
    },
    base_price: {
      defaultValue: 0,
      type: DataTypes.DOUBLE,
      validate: {
        isFloat: true
      }
    },
    sellPrice: {
      defaultValue: 0,
      type: DataTypes.DOUBLE,
      validate: {
        isFloat: true
      }
    },
    subtotal: {
      defaultValue: 0,
      type: DataTypes.DOUBLE,
      validate: {
        isFloat: true
      }
    },
    total: {
      defaultValue: 0,
      type: DataTypes.DOUBLE,
      validate: {
        isFloat: true
      }
    },
  }, {
    sequelize,
    modelName: 'Sell_detail',
    tableName: 'Sell_details',
    underscored: true,
    paranoid: true,
  });
  return Sell_detail;
};