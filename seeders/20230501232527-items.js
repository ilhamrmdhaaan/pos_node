'use strict';

/** @type {import('sequelize-cli').Migration} */
const { faker } = require('@faker-js/faker');
const items = [...Array(100)].map((item) => (
  {
    code: faker.random.alphaNumeric(10),
    'name': faker.commerce.product(),
    unit: faker.science.unit().symbol,
    base_price: faker.finance.amount(5000, 20000, 0),
    sell_price: faker.finance.amount(21000, 40000, 0),
    stock: faker.finance.pin(3),
    category_id: faker.finance.amount(1, 3, 0),
    thumbnail: faker.image.food(640, 480, true),
    created_at: new Date(),
    updated_at: new Date()
  }
))
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Items', items, {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Items', null, {});
  }
};
