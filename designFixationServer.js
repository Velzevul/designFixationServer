var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http, {origins: '*:*', path: '/designFixationServer'})
var mongoose = require('mongoose')
var uuid = require('node-uuid')

var Example = require('./models/example')
var Query = require('./models/query')
var Task = require('./models/task')
var Study = require('./models/study')

var testStudy = {
  participantId: 'test',
  sessionId: 'test',
  condition: 'system',
  taskAlias: 'cars'
}

var port = process.env.DESIGNFIXATION_SERVER_PORT || 3000
mongoose.connect(`mongodb://${process.env.DESIGNFIXATION_SERVER_DB_USER}:${process.env.DESIGNFIXATION_SERVER_DB_PASS}@${process.env.DESIGNFIXATION_SERVER_DB_HOST}/${process.env.DESIGNFIXATION_SERVER_DB_NAME}`)

var imageDescriptionRegex = /<a class="_gUb" href="[^"]*" style="font-style:italic">([^<]*)<\/a>/

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
    Query.find({sessionId: msg.sessionId})
      .then(queries => {
        Example.find({sessionId: msg.sessionId})
          .then(examples => {
            Task.findOne({taskAlias: msg.taskAlias})
              .then(task => {
                socket.emit('data', {queries, examples, task})
              })
          })
      })
  })

  socket.on('get study', () => {
    Study.findOne({'current': true})
      .then(study => {
        if (study) {
          socket.emit('study', study)
        } else {
          socket.emit('study', testStudy)
        }
      })
  })

  socket.on('create study', (msg) => {
    var study = new Study(Object.assign({}, msg, {
      createdAt: Date.now(),
      current: true,
      sessionId: uuid.v4()
    }))

    study.save((err, study) => {
      if (err) {
        socket.emmi('error', err)
      } else {
        socket.broadcast.emit('study', study)
      }
    })
  })

  socket.on('kill study', () => {
    Study.findOne({'current': true})
      .then(study => {
        if (study) {
          study.current = false

          study.save((err, study) => {
            if (err) {
              socket.emmi('error', err)
            } else {
              socket.broadcast.emit('study', testStudy)
            }
          })
        }
      })
  })

  socket.on('create example', (msg) => {
    request({
      url: `https://www.google.com/searchbyimage?&image_url=${msg.example.src}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
      }
    }, (err, res, body) => {
      var imageMatch = body.match(imageDescriptionRegex)
      console.log(imageMatch)

      var example = new Example(Object.assign({}, msg, {
        createdAt: Date.now(),
        imageDescription: imageMatch[1]
      }))

      example.save((err, example) => {
        if (err) {
          socket.emit('error', err)
        } else {
          socket.broadcast.emit('confirm create example', example)
        }
      })
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
        socket.broadcast.emit('confirm create query', query)
      }
    })
  })
})

http.listen(port, () => {
  console.log(`listening on ${port}`)
})
