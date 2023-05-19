'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcryptjs');
module.exports = {
  async up (queryInterface, Sequelize) {

    let pwd = await bcrypt.hash('password', 10);

    await queryInterface.bulkInsert('Users', [{
      name: 'Admin',
      email: 'admin@app.com',
      password: pwd,
      role: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'User',
      email: 'user@app.com',
      password: pwd,
      role: 2,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
