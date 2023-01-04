require('dotenv').config()
const port = process.env.PORT || 8080

const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('hello'))

app.listen(port, () => console.log(`app is listening ${port}`))
