'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      unit: {
        allowNull: false,
        type: Sequelize.STRING(15)
      },
      base_price: {
          allowNull: false,
          defaultValue: 0,
          type: Sequelize.DOUBLE.UNSIGNED
      },
      sell_price: {
        allowNull : false,
        defaultValue: 0,
        type: Sequelize.DOUBLE.UNSIGNED
      },
      stock: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.DOUBLE.UNSIGNED
      },
      category_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        references: {
          model:{
            tableName : 'Categories'
          },
          key: 'id'
        }
      },
      thumbnail: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    // Prepare transaction to remove constraint befor dropping table
    const t = await queryInterface.sequelize.transaction();
    const options =  { raw: true, transaction: t};

    try {

      //disable foreign key check
      await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, options);

      //drop table
      await queryInterface.dropTable('Items', { transaction : t});

      //enable foreign key check after dropping table
      await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, options);

      // If the execution reaches this line, no errors were thrown.
      // We commit the transaction.
      await t.commit();

    } catch (error) {

      // If the execution reaches this line, an error was thrown.
      // We rollback the transaction.
      await t.rollback();

    }
  }
};