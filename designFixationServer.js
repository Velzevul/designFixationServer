var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http, {origins: '*:*', path: '/designFixationServer'})
var mongoose = require('mongoose')

var Example = require('./models/example')
var Query = require('./models/query')
var Task = require('./models/task')

var port = process.env.DESIGNFIXATION_SERVER_PORT || 3000
mongoose.connect(`mongodb://${process.env.DESIGNFIXATION_SERVER_DB_USER}:${process.env.DESIGNFIXATION_SERVER_DB_PASS}@${process.env.DESIGNFIXATION_SERVER_DB_HOST}/${process.env.DESIGNFIXATION_SERVER_DB_NAME}`)

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

io.on('connection', (socket) => {
  console.log('connection established')

  socket.on('get data', (msg) => {
    console.log(msg)

    Query.find({sessionId: msg.sessionId})
      .then(queries => {
        Example.find({sessionId: msg.sessionId})
          .then(examples => {
            Task.findOne({alias: msg.taskAlias})
              .then(task => {
                socket.emit('data', {queries, examples, task})
              })
          })
      })
  })

  socket.on('create example', (msg) => {
    var example = new Example(Object.assign({}, msg, {
      createdAt: Date.now()
    }))

    example.save((err, example) => {
      if (err) {
        socket.emit('error', err)
      } else {
        socket.emit('confirm create', example)
      }
    })
  })

  socket.on('create query', (msg) => {
    var query = new Query(Object.assign({}, msg, {
      createdAt: Date.now()
    }))

    query.save((err, query) => {
      if (err) {
        socket.emit('error', err)
      } else {
        socket.emit('confirm create', query)
      }
    })
  })
})

http.listen(port, () => {
  console.log(`listening on ${port}`)
})
