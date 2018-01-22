const xlsx = require('node-xlsx')
const dateFormat = require('dateformat')
const fromPairs = require('lodash/fromPairs')
const { arr } = require('../../../../drm_api/utils/dic')
const captions = arr.map(_ => _.quotaName)
const dataKeys = arr.map(_ => Object.keys(_)[0])

module.exports = {
  prebuild: (data = []) => {
    const _captions = ['设备编号', '时间戳'].concat(captions)
    const _data = data.map(item => {
      return [
        item.number,
        item.ts ? dateFormat(parseInt(item.ts), 'yyyy-mm-dd HH:MM:ss [l]') : ' --- '
      ].concat(dataKeys.map(key => fromPairs(item.data.map(_ => [Object.keys(_)[0], Object.values(_)[0]]))[key] || ' --- '))
    })

    return xlsx.build([
      {
        data: [_captions].concat(_data),
        name: dateFormat(new Date(), 'isoDate')
      }
    ])
  }
}
