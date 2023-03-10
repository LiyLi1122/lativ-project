const crypto = require('crypto')
const { Duplications, Products, sequelize } = require('../models')
const { Op } = require('sequelize')

module.exports = {
  shoppingCartCheck: async (req, res, next) => {
    // 確認最後購物車總價
    // #swagger.tags = ['ShoppingCart']
    /* #swagger.parameters['cartList'] =
      {
        in: 'body',
        description: '傳遞結帳前購物車最終的商品列表，點選後會回傳綠界 html',
        schema: {
          'cartList': [
            {
              "productId":1,
              "size": "S",
              "color":"黑色",
              "piece": "1"
            },
            {
              "productId":1,
              "size": "S",
              "color":"磚桔",
              "piece": "2"
            }
          ]
        }
      }
    */

    console.log('--- post /shoppingCart ---')
    console.log('--- req.body ---', req.body)

    try {
      const { cartList } = req.body
      const deliveryFee = 60
      let totalAmount = 0
      const results = await Duplications.findAll({
        attributes: ['productId', [sequelize.col('Product.name'), 'name'], 'color', 'size', 'originalPrice'],
        where: {
          // 製作排除 piece 的 [{}, {}, {}] 讓 or 比對
          [Op.or]: cartList.map(r => {
            return {
              product_id: r.productId,
              size: r.size,
              color: r.color
            }
          })
        },
        include: {
          model: Products,
          attributes: []
        },
        raw: true
      })

      console.log('--- results ---', results)

      // 根據 cartList 比對資料庫結果執行 -> 商品數量 * 商品價格
      cartList.forEach(cart => {
        for (const result of results) {
          if (result.productId === cart.productId && result.size === cart.size && result.color === cart.color) {
            totalAmount += (Math.round(result.originalPrice * 0.8)) * cart.piece
          }
        }
      })
      console.log('--- totalAmount ---', totalAmount)

      const onTimeValue = () => {
        const date = new Date() // Fri Mar 10 2023 13:56:24 GMT+0800 (台北標準時間)
        const mm = date.getMonth() + 1 // +1 因為預設月份從 0 開始
        const dd = date.getDate()
        const hh = date.getHours()
        const mi = date.getMinutes()
        const ss = date.getSeconds()

        // 月份小於 9 要補 0，最後將 [] 的值用 join('') 串接成一個字串
        return [date.getFullYear(), '/' +
          (mm > 9 ? '' : '0') + mm, '/' +
          (dd > 9 ? '' : '0') + dd, ' ' +
          (hh > 9 ? '' : '0') + hh, ':' +
          (mi > 9 ? '' : '0') + mi, ':' +
          (ss > 9 ? '' : '0') + ss
        ].join('')
      }

      const EcpayPayment = require('../node_modules/ecpay_aio_nodejs/lib/ecpay_payment')
      const options = require('../node_modules/ecpay_aio_nodejs/conf/config-example')
      const params = {
        MerchantTradeNo: 'lativTradeNo' + Math.random().toString(36).slice(-8), // 20 碼 uid
        MerchantTradeDate: onTimeValue(), // ex: 2017/02/13 15:45:30
        PaymentType: 'aio', // 規定固定為 aio
        TotalAmount: String(totalAmount + deliveryFee), // 正整數 // + 運費
        TradeDesc: 'lativ 購物車車',
        ItemName: 'lativ 購物車',
        // 綠界在背後 post 到 ReturnURL 給後端內容為消費者付款結果參數
        ReturnURL: `${process.env.NGROK_URL}/api/shoppingCart/callback`,
        // ALL 所以 html 裡可以選擇多種不同付款方式
        ChoosePayment: 'ALL',
        EncryptType: '1', // 規定固定為 1
        ClientBackURL: `${process.env.NGROK_URL}/api/products`
      }

      // 根據 config 產生 html、並套件會自動附上 CheckMacValue 參數
      const createHtml = new EcpayPayment(options)
      // 根據 html 附上隱藏參數
      const html = createHtml.payment_client.aio_check_out_all(params)

      console.log('\n', html)

      res.status(200).json(html)
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
  getShoppingCart: async (req, res, next) => {
    // 根據參數取得詳細商品資料
    // #swagger.tags = ['ShoppingCart']
    /* #swagger.parameters['productQueryList'] =
      {
        in: 'query',
        description: '根據提供的 product id 字串列表，回傳更詳盡的 product id 內容'
      }
    */

    try {
      console.log('--- get /shoppingCart ---')
      console.log('--- req.query: ---', req.query)

      let { productQueryList } = req.query
      // 清除重複 product id (可能為同商品、不同顏色、不同尺寸)
      // 因為使用者會再修改購物車，所以需要給予 product id 整個內容
      productQueryList = [...new Set(productQueryList.split(','))]

      console.log('--- productQueryList: ---', productQueryList)

      // 針對 productId in product query list 撈資料
      const results = await Duplications.findAll(
        {
          attributes: [
            [sequelize.col('Product.id'), 'id'],
            [sequelize.col('Product.name'), 'name'],
            'color',
            'size',
            'originalPrice',
            'image',
            'colorImage',
            'stock'
          ],
          where: {
            productId: productQueryList
          },
          include:
            {
              model: Products,
              attributes: []
            },
          raw: true
        })
      // 整理資料
      const dataList = []
      const idMatchList = new Set()
      let colorMatchList
      let index = -1 // 針對

      for (const result of results) {
        const { id, name, color, size, originalPrice, image, colorImage, stock } = result
        if (!idMatchList.has(id)) {
          colorMatchList = new Set()
          idMatchList.add(id)
          dataList.push({
            id,
            name,
            originalPrice,
            discountPrice: Math.round(originalPrice * 0.8),
            infoList: []
          })
          index++
        }

        console.log('--------- dataList ---------', dataList)

        if (!colorMatchList.has(color)) {
          colorMatchList.add(color)
          dataList[index].infoList.push(
            {
              color,
              image,
              colorImage,
              itemList: []
            }
          )
        }
        dataList[index].infoList = dataList[index].infoList.map(info => {
          if (info.color === color) {
            info.itemList.push({
              size, stock
            })
          }
          return info
        })
      }
      console.log('--- data: ---', dataList)
      console.log('--- results: ---', results)
      console.log('--- results.length: ---', results.length)

      res.json(dataList)
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
  getPaymentCallback: async (req, res, next) => {
    try {
      // #swagger.tags = ['ShoppingCart']
      // #swagger.description = '給綠界 callback 的路由，經過此路由會在客戶端產生預設付款成功的 UI'
      console.log('--- post /shoppingCart/callback ---')
      console.log('--- req.body: ---', req.body)

      const { CheckMacValue, RtnCode } = req.body
      const hashKey = process.env.HASHKEY
      const hashIV = process.env.HASHIV
      let checkMacValue = ''
      delete req.body.CheckMacValue

      console.log('--- req.body.CheckMacValue: ---', CheckMacValue)
      console.log('--- req.body.RtnCode: ---', RtnCode)

      // 製作 CheckMacValue
      // 先將參數屬性從 A-Z 排序
      const sortList = Object.keys(req.body).sort((a, b) => a > b ? 1 : -1)
      for (const key of sortList) {
        checkMacValue += `${key}=${req.body[key]}&`
      }
      checkMacValue = `HashKey=${hashKey}&${checkMacValue}HashIV=${hashIV}`
      checkMacValue = encodeURIComponent(checkMacValue).toLowerCase()

      console.log('--- checkMacValue.toLowerCase() ---', checkMacValue)

      // 為符合綠界規定，特定字元轉換
      checkMacValue = checkMacValue
        .replace(/%20/g, '+')
        .replace(/%2d/g, '-')
        .replace(/%5f/g, '_')
        .replace(/%2e/g, '.')
        .replace(/%21/g, '!')
        .replace(/%2a/g, '*')
        .replace(/%28/g, '(')
        .replace(/%29/g, ')')
      // 根據綠界指定方式加密，16 進位編碼是常規設定，會跟 sha256 一起設定
      checkMacValue = crypto.createHash('sha256').update(checkMacValue).digest('hex').toUpperCase()

      console.log('--- handmade checkMacValue: ---', checkMacValue)

      // 檢查綠界回傳內容，確認並回傳給綠界
      if (RtnCode === '1' && checkMacValue === CheckMacValue) {
        res.write('1|OK')
      } else {
        res.write('0|Err')
      }
    } catch (error) {
      next(error)
    }
  }
}
