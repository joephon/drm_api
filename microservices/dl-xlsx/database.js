const mongoose = require('mongoose')
const { getEnv } = require('./utils/node_env')
const { Schema } = mongoose
const MONGODB_HOST = getEnv() === 'production' ? 'localhost' : 'drmtest.sparklog.com'
const {
  MONGODB_USERNAME,
  MONGODB_PASSWORD,
  MONGODB_DATABASE
} = process.env

mongoose.Promise = global.Promise
mongoose.connect(`mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DATABASE}`, {
  useMongoClient: true
})

mongoose.model('DevMoniter', new Schema({
  number: String,
  data: [],
  ts: { type: String }
}, {
  timestamps: true
}))

module.exports = {}
