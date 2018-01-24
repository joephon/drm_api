const xlsx = require('node-xlsx')
const dateFormat = require('dateformat')
const data = require('../../static/cache.json')
const { _captions, _data } = data

xlsx.build([
  {
    data: [_captions].concat(_data),
    name: dateFormat(new Date(), 'isoDate')
  }
], {
  compression: true
})

// node scripts/samples/node.js  37.90s user 6.43s system 97% cpu 45.526 total
