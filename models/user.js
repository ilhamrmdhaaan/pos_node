'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.CHAR(65),
      allowNull: false
    },
    role: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 2
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true,
    paranoid: true
  });
  return User;
};