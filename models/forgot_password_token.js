'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Forgot_password_token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Forgot_password_token.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull:false,
    }
  }, {
    sequelize,
    modelName: 'Forgot_password_token',
    tableName: 'Forgot_password_tokens',
    underscored: true,
  });
  return Forgot_password_token;
};