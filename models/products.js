'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
  // The `models/index` file will call this method automatically.
    static associate (models) {
      // define association here
      Products.hasMany(models.Duplications, { foreignKey: 'productId' })
      Products.belongsTo(models.Subcategories, { foreignKey: 'subcategoryId' })
      Products.belongsTo(models.Categories, { foreignKey: 'categoryId' })
    }
  }
  Products.init({
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
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subcategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Products',
    tableName: 'Products',
    underscored: true
  })
  return Products
}
