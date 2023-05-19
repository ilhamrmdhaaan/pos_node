'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
    */

    await queryInterface.bulkInsert('Categories', [{
      name: 'Drink',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Food',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Snack',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */

    await queryInterface.bulkDelete('Categories', null, {});
  }
};
