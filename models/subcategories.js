'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Subcategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Subcategories.hasMany(models.Products, { foreignKey: 'subcategoryId' })
    }
  }
  Subcategories.init({
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
    modelName: 'Subcategories',
    tableName: 'Subcategories',
    underscored: true
  })
  return Subcategories
}
