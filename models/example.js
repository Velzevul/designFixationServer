var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema

var exampleSchema = new Schema({
  query: String,
  relevance: Number,
  example: {
    id: String,
    src: String,
    aspectRatio: Number
  },
  imageSearchPage: String,
  createdAt: Date,
  sessionId: String
})

module.exports = mongoose.model('Example', exampleSchema)
