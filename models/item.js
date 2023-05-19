'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Category, {as: 'category'});
    }
  }
  Item.init({
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit: {
      allowNull: false,
      type: DataTypes.STRING(15)
    },
    basePrice: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.DOUBLE.UNSIGNED,
      validate: {
        isFloat: true,
      }
    },
    sellPrice: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.DOUBLE.UNSIGNED,
      validate: {
        isFloat: true
      }
    },
    stock: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.DOUBLE.UNSIGNED,
      validate: {
        isFloat: true
      }
    },
    categoryId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Category',
        key: 'id'
      }
    },
    thumbnail: {
      allowNull: true,
      type: DataTypes.TEXT
    },
  }, {
    sequelize,
    modelName: 'Item',
    tableName: 'Items',
    underscored: true,
    paranoid: true,
  });
  return Item;
};