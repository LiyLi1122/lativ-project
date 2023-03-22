
require('dotenv').config()

const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' })
const doc = {
  info: {
    title: 'Lativ-Project apis',
    description: '請先登入取得 Token'
  },
  servers: [
    {
      url: process.env.LOCAL_HOST,
      description: 'Local Server'
    },
    {
      url: process.env.AWS_HOST,
      description: 'AWS Server'
    }
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  },
  schemes: ['http', 'https']
}

// 輸出檔案名稱
const outputFile = './swagger_output.json'
// 指向 API 根文件位置(規定格式要用 Array)
const endpointFiles = ['./app.js']

swaggerAutogen(outputFile, endpointFiles, doc)
