
const swaggerAutogen = require('swagger-autogen')()
const doc = {
  info: {
    title: 'Lativ-Project apis'
  },
  host: 'lativ-database.c9y6fmfie00t.ap-northeast-1.rds.amazonaws.com:3000',
  schemes: ['http', 'https']
}

// 輸出檔案名稱
const outputFile = './swagger_output.json'
// 指向 API 根文件位置(規定格式要用 Array)
const endpointFiles = ['./app.js']

swaggerAutogen(outputFile, endpointFiles, doc)
