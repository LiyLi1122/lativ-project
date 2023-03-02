'use strict'

const duplicationRawData = require('./duplicationRawData.json').data
const sizeList = ['S', 'M', 'L']
const duplicationArray = []

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      for (let i = 0; i < duplicationRawData.length; i++) {
        for (let j = 0; j < sizeList.length; j++) {
          duplicationArray.push(
            {
              product_id: duplicationRawData[i].productId,
              color: duplicationRawData[i].color,
              size: sizeList[j],
              original_price: duplicationRawData[i].originalPrice,
              image: duplicationRawData[i].image,
              description: duplicationRawData[i].description,
              color_image: duplicationRawData[i].colorImage,
              stock: 50,
              gender: duplicationRawData[i].gender,
              created_at: new Date(),
              updated_at: new Date()
            })
        }
      }
      await queryInterface.bulkInsert('Duplications', duplicationArray)
      console.log('---duplication seeders done---')
    } catch (error) {
      console.log(error)
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete('Duplications')
    } catch (error) {
      console.log(error)
    }
  }
}
