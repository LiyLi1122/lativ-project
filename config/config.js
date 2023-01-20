require('dotenv').config()

module.exports = {
  development: {
    username: process.env.MYSQL_DEV_USERNAME,
    password: process.env.MYSQL_DEV_PASSWORD,
    database: process.env.MYSQL_DEV_DATABASE,
    host: process.env.MYSQL_DEV_HOST,
    dialect: 'mysql'
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: process.env.MYSQL_PROD_USERNAME,
    password: process.env.MYSQL_PROD_PASSWORD,
    database: process.env.MYSQL_PROD_DATABASE,
    host: process.env.MYSQL_PROD_HOST,
    dialect: 'mysql'
  }
}
