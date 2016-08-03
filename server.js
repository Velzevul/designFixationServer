var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var morgan = require('morgan')
var mongoose = require('mongoose')

var historyRoutes = require('./routes/history')

var port = process.env.PORT || 3000
mongoose.connect(`mongodb://${process.env.DESIGNFIXATION_SERVER_DB_USER}:${process.env.DESIGNFIXATION_SERVER_DB_PASS}@${process.env.DESIGNFIXATION_SERVER_DB_HOST}/${process.env.DESIGNFIXATION_SERVER_DB_NAME}`)

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// use morgan to log requests to the console
app.use(morgan('dev'))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token')
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, OPTIONS')
  res.header('Allow', 'GET, HEAD, POST, PUT, DELETE, OPTIONS')
  next()
})

app.get(`${process.env.DESIGNFIXATION_SERVER_API_PREFIX}/`, (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'working'
    }
  })
})

app.use(`${process.env.DESIGNFIXATION_SERVER_API_PREFIX}/history`, historyRoutes)
app.listen(port)
