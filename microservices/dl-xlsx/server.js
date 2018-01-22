const Koa = require('koa')
const cors = require('@koa/cors')
const mount = require('koa-mount')
const dotenv = require('dotenv')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const compress = require('koa-compress')
const minimist = require('minimist')
const jwt = require('jsonwebtoken')

dotenv.config()
require('./database')

const server = new Koa()
const routes = require('./routes')
const options = minimist(process.argv, { alias: { p: 'port' } })
const port = options.port || 4123

server.keys = [
  process.env.SECRET_KEY_BASE
]

server.use(cors())
server.use(logger())
server.use(bodyParser())

server.use(async (ctx, next) => {
  const { token } = ctx.query
  const secret = server.keys[0]

  try {
    ctx.state.user = jwt.verify(token, secret)
    await next()
  } catch (error) {
    ctx.status = 401
    ctx.body = {
      message: 'Requires authentication'
    }
  } finally {
  }
})

server.use(routes())

server.listen(port, () => {
  console.log(`* Listening on http://localhost:${port}`)
  console.log('* Use Ctrl-C to stop')
})
