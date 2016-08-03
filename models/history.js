var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema

var exampleSchema = new Schema({
  id: String,
  isCollected: Boolean,
  url: String,
  createdAt: Date
})

var historySchema = new Schema({
  query: String,
  image: exampleSchema,
  examples: [exampleSchema],
  createdAt: Date
})

module.exports = mongoose.model('History', historySchema)
