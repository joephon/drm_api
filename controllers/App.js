
// var mongoose = require('mongoose')

import User from '../model/User'
import News from '../model/News'
import Bug from '../model/Bug'
import Order from '../model/Order'
import Hot from '../model/Hot'
import Device from '../model/Device'
import Auth from '../model/Auth'
import jwt from 'jsonwebtoken'
import { cert } from '../config'
import { busboys } from '../utils/upload'
import { hash } from '../utils/util'
import bcrypt from 'bcrypt'



class App {

  static async Index (ctx) {
    // const fileName = new Date().toLocaleString()


    // ctx.set('Content-Type', 'application/vnd.openxmlformats');
    // ctx.attachment("Report2.xlsx")
    // const result = new Buffer(nodeExcel,'binary');  
    // ctx.body = result
    // const devices = await Device.aggregate([{
    //   { $unwind: '$images'},
    //   { $group: { _id: ""}}
    // }])
    const devices = await Device.aggregate([
      { $unwind: "$timelines"},
      { $group : { _id : "$timelines.type" , numbers : { $push : { cc: '$cc', pressure: '$pressure'} } } },
      { $sort: { number: 1 } }
    ])
    ctx.body = { data: devices }
  }

  //登录
  static async session (ctx) {
    const { email, password } = ctx.request.body
    if(!email || !password)
      return ctx.body = { code: 400, message: '缺少必要的参数 email, password', data: '' }

    const result = await User.findOne({ email })
    if(!result)
      return ctx.body = { code: 401, message: '用户名或密码错误', data: '' }

    const isvalid = await bcrypt.compare(password, result.password)
    if(!isvalid)
      return ctx.body = { code: 401, message: '用户名或密码错误', data: '' }

    const token = jwt.sign({ id: result._id }, cert)
    ctx.body = { code: 201, message: 'ok', data: token }

  }

  //获取用户信息
  static async getUserInfo(ctx) {
    const { id } = ctx.request.decoded 
    const result = await User.findById(id, '-password')
    if(!result)
      return ctx.body = { code: 404, message: '未找到该用户', data: result }
    ctx.body = { code: 200, message: 'ok', data: result }
  }

  //修改用户信息
  static async UpdateUser(ctx) {

    const { id } = ctx.request.decoded
    const bodyData = ctx.request.body

    if(ctx.request.body.password) {
      return ctx.body = { code: 404, message: '不允许通过此API修改密码', data: ''}
    }

    try {
      const result = await User.findOneAndUpdate({ _id: id }, bodyData, { new: true })
      ctx.body = { code: 201, message: 'ok', data: result }
    }
    catch(e) {
      ctx.body = { code: 500, message: '操作数据时出错', data: e }
    }
  }

  //更改用户密码
  static async UpdateUserPassword(ctx) {
    const { password, newPass, confirmPass } = ctx.query

    if(newPass !== confirmPass)
      return ctx.body = { code: 403, message: '两次新密码不相同,不允许修改', data: '' }

    const { id } = ctx.request.decoded
    const userinfo = User.findById({ _id: id })
    const isValid = await bcrypt.compare(password, userinfo.password)
    if(!isValid)
      return ctx.body = { code: 410, message: '密码不正确，不允许修改', data: '' }

    const encryptPass = await hash(newPass)
    const result = User.findOneAndUpdate({ _id: id }, { password: encryptPass}, { new: true }) 
    if(!result)
      return ctx.body = { code: 500, message: '操作数据时出错', data: e }
    ctx.body = { code: 201, message: '修改成功', data: '' }
  }

  //获取所有信息
  static async getNews(ctx) {
    try {
      const result = await News.find({ published: true })
      ctx.body = { code: 200, message: 'ok', data: result }
    }
    catch(e) {
      ctx.body = { code: 500, message: '操作数据时出错', data: e }
    }
  }

  //获取单个信息
  static async getNewsById(ctx) {
    let { id } = ctx.query
    try {
      const result = await News.findById({ _id: id })
      ctx.body = { code: 201, message: '获取成功', data: result }
    }
    catch(e) {
      ctx.body = { code: 500, message: '操作数据时出错', data: e }
    }
  }


  //获取所有 故障+搜索
  static async getBugs(ctx) {
    const { type, search } = ctx.query

    if(type === 'submit') {
      // hots
      // 有这个词就权重加1,没有这个词就创建。
      const hot = await Hot.findOneAndUpdate({ text: search }, { $inc: { weights: 1 }}, { new: true, upsert: true })
      ctx.body = { code: 200, message: 'ok', data: hot }
    }

    else if(type === 'onchange') {
      const titleArr = await Bug.find({title: new RegExp(search, 'i')}).limit(5).exec()
      const contentArr = await Bug.find({content: new RegExp(search, 'i')}).limit(5).exec()
      ctx.body = { code: 200, message: 'ok', data: titleArr.concat(contentArr) }
    }

    else {
      let result = await Bug.find({}).populate('category', 'text sortIndex')
      ctx.body = { code: 200, message: 'ok', data: result }      
    }
  }

  //获取单个故障
  static async getBug(ctx) {

    let { id } = ctx.query

    try {
      const result = await Bug.findById({ _id: id }).populate('category', 'text sortIndex')
      ctx.body = { code: 200, message: 'ok', data: result }
    }
    catch(e) {
      ctx.body = { code: 500, message: '操作数据时出错', data: e }
    }
  }

  static async getHots(ctx) {
    const hots = await Hot.find({}).sort('-weights').limit(10)
    ctx.body = { code: 200, message: 'ok', data: hots }
  }


  //创建工单
  static async createOrder(ctx) {
    let { category, title, content } = ctx.request.body
    if(!category || !title || !content ) {
      return ctx.body = { code: 401, message: '缺少必要的参数params: title, category, content', data: '' }
    }
    let { id } = ctx.request.decoded
    let order = await Order.create({ title, content, category, user: id })
    ctx.body = { code: 201, message: 'ok', data: order }
  }

  //获取工单
  static async getOrders(ctx) {
    let result = await Order.find()
    // .populate('user', 'name email')
    // .populate({ path: 'bug', select: 'category ', })

    ctx.body = { code: 200, message: 'ok', data: result }
  }

  static async getLastLocation(ctx) {
    //how to do it ? hello ?
    const locations = await Device.find({}).select('loctime address').sort('-loctime').limit(5)
    ctx.body = { code: 200, message: 'ok', data: locations }
  }

  static async getDevices(ctx) {
    const { createTime, type, value, filter, cc, pressure, combustible } = ctx.request.query
    if(createTime === 'asc' || createTime === 'desc') {
      const devices = await Device.find().sort({ createTime: createTime })
      return ctx.body = { code: 200, message: 'ok', data: devices }
    }
    else if(type && value) {
      const find = {}
      find[type] = value
      // console.log(find)
      const devices = await Device.find( find )
      return ctx.body = { code: 200, message: 'ok', data: devices }
    }
    else if(cc || pressure || combustible) {
      const devices = await Device.find({$and: [
                          {'cc': cc },
                          {'pressure': pressure},
                          {'combustible': combustible}
                         ]
                  })
      return ctx.body = { code: 200, message: 'ok', data: devices }
    }
    else {
      const devices = await Device.find({})
      ctx.body = { code: 200, message: 'ok', data: devices }
    }
  }

  static async getDevice(ctx) {
    const { userId } = ctx.request.decoded
    const { deviceId, start, end } = ctx.query

    const mathArr = await Auth.find( { $and: [
                            { user: userId },
                            { device: deviceId }
                          ] })
    const canView = matchArr.some((item, index) => {
      return item.canView === true
    })

    const canMonitor = matchArr.some((item, index) => {
      return item.canMonitor === true
    })

    if(!canView)
      return ctx.body = { code: 503, message: 'you has no authority to watch this device', data: ''}

    const doc = await Device.find({_id: deviceId }).where('timelines.time').gte(start).lte(end)
    ctx.body = { code: 200, message: 'ok', data: doc }
  }

  static async updateDeviceRemark(ctx) {
    const { deviceId, remark } = ctx.request.body
    const result = await Device.findByIdAndUpdate({ _id: deviceId }, { remark }, { new: true })
    ctx.body = { code: 201, message: 'ok', data: result }
  }

  static async addDeviceTimeline(ctx) {
    const { deviceId, type, time, description } = ctx.request.body
    const result = await Device.findByIdAndUpdate({ _id : deviceId },
                                  { $push : { timelines: { type, time, description }}},
                                  { new: true }
                                )
    ctx.body = { code: 201, message: 'ok', data: result }
  }

  static async addDeviceImages(ctx) {
    const { deviceId } = ctx.query
    const upload = await busboys (ctx)
    if(upload.fieldname !== 'devices') {
      return ctx.body = { code: 400, message: '参数值错误, key: devices', data: '' }
    }
    const result = await Device.findByIdAndUpdate({ _id: deviceId },
                                 { $push: { images: { url: upload.file }}},
                                 { new: true }
                                )
    ctx.body = { code: 201, message: 'ok', data: result }
  }

}

export default App