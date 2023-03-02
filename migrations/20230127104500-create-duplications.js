'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await queryInterface.createTable('Duplications', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        product_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: 'Products',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        color: {
          allowNull: false,
          type: Sequelize.STRING
        },
        size: {
          allowNull: false,
          type: Sequelize.STRING
        },
        original_price: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        description: {
          allowNull: false,
          type: Sequelize.STRING
        },
        image: {
          allowNull: false,
          type: Sequelize.STRING
        },
        color_image: {
          allowNull: false,
          type: Sequelize.STRING
        },
        stock: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        gender: {
          allowNull: false,
          type: Sequelize.TINYINT
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
      await queryInterface.addIndex('Duplications', ['product_id', 'color', 'size'],
        {
          unique: true
        })
    } catch (error) {
      console.log(error)
    }
  },
  async down (queryInterface, Sequelize) {
    try {
      await queryInterface.dropTable('Duplications')
    } catch (error) {
      console.log(error)
    }
  }
}
