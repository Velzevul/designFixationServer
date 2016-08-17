var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema

var studySchema = new Schema({
  participantId: String,
  sessionId: String,
  condition: String,
  taskAlias: String,
  createdAt: Date,
  current: Boolean
})

module.exports = mongoose.model('Study', studySchema)
