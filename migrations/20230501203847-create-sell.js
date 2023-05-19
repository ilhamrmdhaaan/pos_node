'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sells', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sell_code: {
        allowNull: false,
        type: Sequelize.CHAR(15)
      },
      sell_date: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      subtotal: {
        defaultValue: 0,
        type: Sequelize.DOUBLE
      },
      discount: {
        defaultValue: 0,
        type: Sequelize.DOUBLE
      },
      discount_percent: {
        defaultValue: 0,
        type: Sequelize.FLOAT
      },
      tax: {
        defaultValue: 0,
        type: Sequelize.DOUBLE
      },
      tax_percent: {
        defaultValue: 0,
        type: Sequelize.FLOAT
      },
      grand_total: {
        defaultValue: 0,
        type: Sequelize.DOUBLE
      },
      payment_method: {
        allowNull: false,
        type: Sequelize.CHAR(2)
      },
      pay_amount: {
        defaultValue: 0,
        type: Sequelize.DOUBLE
      },
      change_amount: {
        defaultValue: 0,
        type: Sequelize.DOUBLE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sells');
  }
};
