'use strict'
const faker = require('faker')
const bcryptjs = require('bcryptjs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert('Users', Array.from({ length: 10 }, (_, index) => {
        return {
          name: faker.name.findName(),
          email: `test${index + 1}@test.com`,
          password: bcryptjs.hashSync('123', 10),
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          created_at: new Date(),
          updated_at: new Date()
        }
      }))
      console.log('---user seeders done---')
    } catch (error) {
      console.log(error)
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {})
  }
}
