const { sequelize, Products, Subcategories, Duplications } = require('../models')
const { Op } = require('sequelize')

module.exports = {
  getProducts: async (req, res, next) => {
    // 取得所有商品資料
    // #swagger.tags = ['Products']
    /* #swagger.parameters['pageIndex'] =
      {
        in: 'query',
        description: '頁碼(預設為 0)'
      }
    */
    /* #swagger.parameters['mainCategory'] =
      {
        in: 'query',
        description: '輸入主類別(預設為 0 ，女生為 0、男生為 1)'
      }
    */
    try {
      const limit = 24
      const offset = req.query.pageIndex ? Number(req.query.pageIndex) * limit : 0
      const gender = req.query.mainCategory ? req.query.mainCategory : 0

      console.log(`--- /products, page 為 ${req.query.page} | offset 為 ${offset} | limit 為 ${limit} | gender 為 ${gender} ---`)

      const results = await Duplications.findAll({
        where: { gender },
        attributes: [
          [sequelize.col('Product.id'), 'id'],
          [sequelize.col('Product.name'), 'name'],
          ['original_price', 'originalPrice'],
          'image'
        ],
        include: [
          {
            model: Products,
            attributes: []
          }
        ],
        group: ['product_id'],
        offset,
        limit,
        raw: true
      })

      console.log('--- /products, results.length 為 ---', results.length)
      console.log('--- /products, results 為 ---', results)

      res.status(200).json({ data: results })
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
  getProduct: async (req, res, next) => {
    // 取得特定(product id)商品詳細內容
    // #swagger.tags = ['Products']
    /* #swagger.parameters['id'] =
      {
        in: 'path',
        description: '取得特定(product id)商品詳細內容'
      }
    */
    try {
      const { id } = req.params
      const idMatchList = new Set()
      let colorMatchList
      const data = {}

      console.log('--- /products/:id, id 為---', id)
      // 撈取資料
      const results = await Products.findAll({
        where: { id },
        include: [
          {
            model: Duplications,
            attributes: []
          }
        ],
        attributes: ['id', 'name',
          [sequelize.col('Duplications.color'), 'color'],
          [sequelize.col('Duplications.size'), 'size'],
          [sequelize.col('Duplications.original_price'), 'originalPrice'],
          [sequelize.col('Duplications.image'), 'image'],
          [sequelize.col('Duplications.color_image'), 'colorImage'],
          [sequelize.col('Duplications.description'), 'description'],
          [sequelize.col('Duplications.stock'), 'stock']
        ],
        raw: true
      })

      // 將資料庫資料整理成目標內容
      for (const result of results) {
        // 處理前半部: 用 productId 檢查保留唯一值
        if (!idMatchList.has(result.productId)) {
          idMatchList.add(result.productId)
          data.id = result.id
          data.name = result.name
          data.originalPrice = result.originalPrice
          data.discountPrice = Math.round(result.originalPrice * 0.8)
          data.description = result.description
          data.infoList = []
          // 在新增 productId 時 colorList 就要歸零
          colorMatchList = new Set()
        }
        // 處理中半部: 用 color 檢查保留唯一值
        if (!colorMatchList.has(result.color)) {
          colorMatchList.add(result.color)
          // 不存在就下面內容
          data.infoList.push({
            color: result.color,
            image: result.image,
            colorImage: result.colorImage,
            itemList: []
          })
        }
        // 處理後半部: 根據 color 分別將屬於顏色的 size、stock 塞入、並拼接前面處理的內容
        data.infoList = data.infoList.map(info => {
          if (info.color === result.color) {
            info.itemList.push({
              size: result.size,
              stock: result.stock
            })
          }
          return info
        })
      }
      console.log('--- /products/:id, result 為 ---', results)
      console.log('--- /products/:id, result.length 為 ---', results.length)
      console.log('--- /products/:id, data 為 ---', data)

      res.status(200).json({ data })
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
  getTypeProduct: async (req, res, next) => {
    // 提供特定類型(subcategory id)商品簡略資料
    // #swagger.tags = ['Products']
    /* #swagger.parameters['pageIndex'] =
      {
        in: 'query',
        description: '頁碼(預設為 0)'
      }
    */
    /* #swagger.parameters['mainCategory'] =
      {
        in: 'query',
        description: '輸入主類別(預設為 0 ，女生為 0、男生為 1)'
      }
    */

    try {
      const { id } = req.params
      const { pageIndex, mainCategory } = req.query
      const limit = 24
      const offset = pageIndex ? Number(pageIndex) * limit : 0
      const gender = mainCategory || 0
      const data = {}
      const matchList = new Set()

      console.log(`--- /products/subcategories/:id, id 為 ${id} | page 為 ${req.query.page} | offset 為 ${offset} | limit 為 ${limit} | gender 為 ${gender} ---`)

      const results = await Duplications.findAll({
        attributes: [
          [sequelize.col('Product.Subcategory.id'), 'id'],
          [sequelize.col('Product.Subcategory.name'), 'name'],
          'productId',
          [sequelize.col('Product.name'), 'productName'],
          [sequelize.col('Product.tag'), 'productTag'],
          [sequelize.col('original_price'), 'originalPrice'],
          [sequelize.col('color_image'), 'colorImage'],
          'image'],
        where: { gender },
        include:
        {
          model: Products,
          attributes: [],
          where: {
            Subcategory_id: id
          },
          include: {
            model: Subcategories,
            attributes: []
          }
        },
        offset,
        limit,
        raw: true
      })
      for (const result of results) {
        // 用 {} 確認是否有該 key，若沒有該 key 則新增
        if (data.id !== result.id) {
          data.id = result.id
          data.name = result.name
          data.infoList = []
        }
        // 新增顏色 object
        if (!matchList.has(result.productTag)) {
          matchList.add(result.productTag)
          data.infoList.push({
            tag: result.productTag,
            itemList: []
          })
        }
        // 根據顏色進行分流，新增 info object (這邊只有一層所以可以用 map)
        data.infoList = data.infoList.map(info => {
          if (info.tag === result.productTag) {
            info.itemList.push({
              productId: result.productId,
              productName: result.productName,
              originalPrice: result.originalPrice,
              discountPrice: Math.round(result.originalPrice * 0.8),
              image: result.image,
              colorImage: result.colorImage
            })
          }
          return info
        })
      }
      console.log('--- /products/subcategories/id, results 為 ---', results)
      console.log('--- /products/subcategories/id, results.length 為 ---', results.length)

      res.status(200).json({ data })
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
  searchProducts: async (req, res, next) => {
    // #swagger.tags = ['Products']
    /* #swagger.parameters['pageIndex'] =
      {
        in: 'query',
        description: '頁碼(預設為 0)'
      }
    */
    /* #swagger.parameters['mainCategory'] =
      {
        in: 'query',
        description: '輸入主類別(預設為 0 ，女生為 0、男生為 1)'
      }
    */
    /* #swagger.parameters['keyword'] =
      {
        in: 'query',
        description: '輸入關鍵字'
      }
    */
    try {
      const { keyword, mainCategory, pageIndex } = req.query
      const limit = 24
      const offset = pageIndex ? pageIndex * limit : 0
      const gender = mainCategory || 0

      console.log(`--- /products/search, keyword 為 ${keyword} | page 為 ${pageIndex} | offset 為 ${offset} | limit 為 ${limit} | gender 為 ${gender} ---`)

      const results = await Duplications.findAll({
        where: { gender },
        attributes: [
          [sequelize.col('Product.id'), 'id'],
          [sequelize.col('Product.name'), 'name'],
          'size',
          'originalPrice',
          'image',
          'stock',
          'gender'
        ],
        include: {
          model: Products,
          attributes: [],
          where: {
            name: {
              [Op.like]: `%${keyword}%`
            }
          }
        },
        offset,
        limit,
        raw: true
      })
      // 用 image 區分，index 作為插入 image 的相關資料依據
      const data = []
      let index = -1 // 因為最初會多加一次，所以要先扣掉
      const matchList = new Set()
      for (const result of results) {
        if (!matchList.has(result.image)) {
          matchList.add(result.image)
          data.push({
            image: result.image,
            infoList: []
          })
          index++
        }
        if (data[index].image.includes(result.image)) {
          console.log(data[index].image, result.image)
          data[index].infoList.push({
            id: result.id,
            name: result.name,
            originalPrice: result.originalPrice,
            discountPrice: Math.round(result.originalPrice * 0.8),
            size: result.size,
            stock: result.stock
          })
        }
      }
      console.log('--- /products/search, results 為 ---', results)
      console.log('--- /products/search, results.length 為 ---', results.length)

      res.status(200).json({ data })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}
