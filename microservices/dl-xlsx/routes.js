const fs = require('fs-extra')
const send = require('koa-send')
const types = require('mime-types')
const mongoose = require('mongoose')
const Router = require('koa-joi-router')
const isEmpty = require('lodash/isEmpty')
const { prebuild } = require('./utils/xlsx')
const DevMoniter = mongoose.model('DevMoniter')
const router = Router()
const { Joi } = Router

router.get('/', async (ctx, next) => {
  const { number, startTime, endTime } = ctx.query

  if (isEmpty(number) || isEmpty(startTime) || isEmpty(endTime)) {
    ctx.status = 400
    return ctx.body = {
      message: 'Requires parameters: [ number | startTime | endTime ]'
    }
  }

  const data = await DevMoniter.find({
    ts: { $gte: startTime, $lte: endTime },
    number
  }, null, {
    limit: 5000,
    sort: { _id: -1 }
  })

  ctx.attachment(`${number}-${startTime}-${endTime}-${Date.now()}.xlsx`)
  ctx.type = types.lookup('xlsx')
  ctx.body = prebuild(data)
})

module.exports = () => router.middleware()
