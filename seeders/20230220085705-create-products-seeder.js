'use strict'

const productRawData = require('./productRawData.json').data

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const productArray = productRawData.map(raw => {
        return ({
          name: raw.name,
          tag: raw.tag,
          subcategory_id: raw.subcategoryId,
          category_id: raw.categoryId,
          created_at: new Date(),
          updated_at: new Date()
        })
      })
      await queryInterface.bulkInsert('Products', productArray)
      console.log('---product seeders done---')
    } catch (error) {
      console.log(error)
    }
  },
  async down (queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete('Products')
    } catch (error) {
      console.log(error)
    }
  }
}
