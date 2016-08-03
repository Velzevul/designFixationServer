var express = require('express')
var ObjectId = require('mongoose').Types.ObjectId

var History = require('../models/history')

var historyRoutes = express.Router()

// GetAll
historyRoutes.get('/', (req, res) => {
  History.find({})
    .sort('-createdAt')
    .then(histories => {
      res.json({
        success: true,
        data: {
          histories
        }
      })
    })
})

// Get latest
historyRoutes.get('/latest', (req, res) => {
  History.findOne({})
    .sort('-createdAt')
    .then(history => {
      res.json({
        success: true,
        data: {
          history
        }
      })
    })
})

// Create
historyRoutes.post('/', (req, res) => {
  var history = new History(Object.assign({}, req.body.history, {
    createdAt: Date.now()
  }))

  history.save((err, history) => {
    if (err) {
      res.status(400).json({
        success: false,
        data: err
      })
    } else {
      res.json({
        success: true,
        data: {
          history
        }
      })
    }
  })
})

// Create examples
historyRoutes.post('/:historyId/examples/', (req, res) => {
  History.findOne({_id: ObjectId(req.params.historyId)})
    .then(history => {
      var nExamples = history.examples.length

      for (let example of req.body.examples) {
        history.examples.push(history.examples.create(Object.assign({}, example, {
          createdAt: Date.now()
        })))
      }

      history.save((err, history) => {
        if (err) {
          res.status(400).json({
            success: false,
            data: err
          })
        } else {
          res.json({
            success: true,
            data: {
              examples: history.examples.slice(nExamples)
            }
          })
        }
      })
    })
})

module.exports = historyRoutes
