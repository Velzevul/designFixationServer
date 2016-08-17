var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema

var querySchema = new Schema({
  query: String,
  url: String,
  createdAt: Date,
  sessionId: String
})

module.exports = mongoose.model('Query', querySchema)
