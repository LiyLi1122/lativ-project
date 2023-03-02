'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const categoryTypeNames = [
        '上衣類',
        '襯衫類',
        '外套類',
        '下身類',
        '洋裝',
        '內衣類',
        '家居福',
        '配件'
      ]

      await queryInterface.bulkInsert('Categories', categoryTypeNames.map(cate => {
        return {
          name: cate,
          created_at: new Date(),
          updated_at: new Date()
        }
      }))
      console.log('---category seeders done---')
    } catch (error) {
      console.log(error)
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete('Categories')
    } catch (error) {
      console.log(error)
    }
  }
}
