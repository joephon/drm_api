const User = require('../model/User')
const Device = require('../model/Device')
const Auth = require('../model/Auth')
const Cache = require('../model/Cache')
const { quotaDic } = require('../utils/dic')
const SMS = require('../utils/SMS')
const superagent = require('superagent')

module.exports = async obj => {
  obj.data.map(async item => {

    const key = Object.keys(item)[0]
    const newObj = quotaDic(key)

    if (newObj.quotaClass != 3) return

    if (Number(item[key]) != 1) return

    const popu = await Auth.find({canMonitor: true})
                  .populate('user', 'phone')
                  .populate('device', 'name')
                  .select('user device')

    popu.map(async item2 => {
      const insert = {
        phone: item2.user.phone,
        name: item2.device.name,
        msg: newObj.quotaName,
        number: obj.number,
      }

      const cache = await Cache.find(insert).sort({_id: -1})

      // TODO: Add New SMS API
      const { settings } = item2.device
      let offset = 60 * 60 * 1000
      let enable = true
      for (let setting of settings) {
        if (setting.key === key) {
          offset = (~~setting.interval) * 1000
          enable = (setting.status === 0 ? true : false)
        }
      }

      if (cache && Date.now() - Number(cache[0].ts) < offset ) return
      if (! enable) return null

      insert.ts = obj.ts
      const cacheStore = await Cache.create(insert)
      await superagent.post(`http://127.0.0.1:4000/api/devices/${item2.device._id}/warning`).send({
        phone: insert.phone,
        name: insert.name,
        msg: insert.msg
      }).then(_ => {
        return null
      })
      // SMS(insert.phone, insert.name, insert.msg)
    })
  })
}
