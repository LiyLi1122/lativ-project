const swaggerAutogen = require('swagger-autogen')()
// 輸出檔案名稱
const outputFile = './swagger_output.json'
// 指向 API 根文件位置(規定格式要用 Array)
const endpointFiles = ['./app.js']

swaggerAutogen(outputFile, endpointFiles)
