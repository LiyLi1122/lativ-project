'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Duplications extends Model {
    // The `models/index` file will call this method automatically.
    static associate (models) {
      // define association here
      Duplications.belongsTo(models.Products, { foreignKey: 'productId' })
    }
  }
  Duplications.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false
    },
    originalPrice: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING
    },
    image: {
      allowNull: false,
      type: DataTypes.STRING
    },
    colorImage: {
      allowNull: false,
      type: DataTypes.STRING
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gender: {
      type: DataTypes.TINYINT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Duplications',
    tableName: 'Duplications',
    underscored: true
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['productId', 'color', 'size']
      }
    ]
  })
  return Duplications
}
