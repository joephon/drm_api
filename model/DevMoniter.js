
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const devMoniterSchema = new Schema({
  // number: String,
  // data: [],
  // ts: String,
  number: {
    type: String,
    index: true
  },
  data: [],
  ts: {
    type: String,
    index: true
  }
}, { timestamps: true })

module.exports = mongoose.model('DevMoniter', devMoniterSchema)
