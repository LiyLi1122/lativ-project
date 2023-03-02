'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const subcategoryNames = [
        '聯名長T',
        '聯名短T',
        '休閒襯衫',
        '休閒外套',
        '休閒長褲',
        '襯衫式洋裝',
        '細肩帶背心'
      ]
      await queryInterface.bulkInsert('Subcategories', subcategoryNames.map(subcate => {
        return ({
          name: subcate,
          created_at: new Date(),
          updated_at: new Date()
        })
      }))
      console.log('---subcategory seeders done---')
    } catch (error) {
      console.log(error)
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete('Subcategories')
    } catch (error) {
      console.log(error)
    }
  }
}
