'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Categories.hasMany(models.Products, { foreignKey: 'categoryId' })
    }
  }
  Categories.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Categories',
    tableName: 'Categories',
    underscored: true
  })
  return Categories
}
