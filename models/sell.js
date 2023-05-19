'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sell extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Sell_detail, { as: 'sell_details' });
    }
  }
  Sell.init({
    sellCode: {
      allowNull: false,
      type: DataTypes.CHAR(15)
    },
    sellDate: {
      allowNull: false,
      type: DataTypes.DATEONLY
    },
    subtotal: {
      defaultValue: 0,
      type: DataTypes.DOUBLE,
      validate:{
        isFloat :true
      }
    },
    discount: {
      defaultValue: 0,
      type: DataTypes.DOUBLE,
      validate: {
        isFloat: true
      }
    },
    discountPercent: {
      defaultValue: 0,
      type: DataTypes.FLOAT,
      validate: {
        isFloat: true
      }
    },
    tax: {
      defaultValue: 0,
      type: DataTypes.DOUBLE,
      validate: {
        isFloat: true
      }
    },
    taxPercent: {
      defaultValue: 0,
      type: DataTypes.FLOAT,
      validate: {
        isFloat: true
      }
    },
    grandTotal: {
      defaultValue: 0,
      type: DataTypes.DOUBLE
      ,
      validate: {
        isFloat: true
      }
    },
    paymentMethod: {
      allowNull: false,
      type: DataTypes.CHAR(2)
    },
    payAmount: {
      defaultValue: 0,
      type: DataTypes.DOUBLE,
      validate: {
        isFloat: true
      }
    },
    changeAmount: {
      defaultValue: 0,
      type: DataTypes.DOUBLE,
      validate: {
        isFloat: true
      }
    },
  }, {
    sequelize,
    modelName: 'Sell',
    tableName: 'Sells',
    underscored: true,
    paranoid: true,
  });
  return Sell;
};