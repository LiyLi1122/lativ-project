'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await queryInterface.createTable('Subcategories', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          allowNull: false,
          unique: true,
          type: Sequelize.STRING
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        }
      })
    } catch (error) {
      console.log(error)
    }
  },
  async down (queryInterface, Sequelize) {
    try {
      await queryInterface.dropTable('Subcategories')
    } catch (error) {
      console.log(error)
    }
  }
}
