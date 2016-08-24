var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema

var taskSchema = new Schema({
  text: String,
  stems: [],
  alias: String
})

module.exports = mongoose.model('Task', taskSchema)
