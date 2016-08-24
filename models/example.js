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
  imageDescription: String,
  imageDescriptionStems: [],
  stemDictionary: Schema.Types.Mixed,
  createdAt: Date,
  sessionId: String
})

module.exports = mongoose.model('Example', exampleSchema)
