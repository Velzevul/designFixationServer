var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema

var exampleSchema = new Schema({
  id: String,
  isCollected: Boolean,
  url: String,
  aspectRatio: Number,
  createdAt: Date
})

var historySchema = new Schema({
  type: String,
  pinId: {
    type: String,
    default: null
  },
  pinUrl: {
    type: String,
    default: null
  },
  query: {
    type: String,
    default: null
  },
  category: {
    type: String,
    default: null
  },
  topic: {
    type: String,
    default: null
  },
  boardAuthor: {
    type: String,
    default: null
  },
  boardName: {
    type: String,
    default: null
  },
  participantId: String,
  examples: [exampleSchema],
  createdAt: Date
})

module.exports = mongoose.model('History', historySchema)
