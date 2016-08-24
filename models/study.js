var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema

var studySchema = new Schema({
  participantId: String,
  sessionId: String,
  condition: String,
  taskAlias: String,
  createdAt: Date,
  training: Boolean,
  current: Boolean
})

module.exports = mongoose.model('Study', studySchema)
