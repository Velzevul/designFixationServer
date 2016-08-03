var express = require('express')

var History = require('../models/history')

var historyRoutes = express.Router()

// GetAll
historyRoutes.get('/', (req, res) => {
  History.find({})
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

  history.save((err, article) => {
    if (err) {
      res.status(400).json({
        success: false,
        data: err
      })
    } else {
      res.json({
        success: true,
        data: {
          article
        }
      })
    }
  })
})

module.exports = historyRoutes
