
import mongoose from 'mongoose'
const Schema = mongoose.Schema
 
const bugSchema = new Schema({
  title: { 
    type: String,
    required: true
  },
  category: { 
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  content: {
    type: String,
    required: true
  }, 
  isSolved: { type: Boolean, default: true }
}, { timestamps: true })

bugSchema.statics.searchByContent = function(search) {
  return new Promise((resolve, reject) => {
      this.find({ 'content': new RegExp(search, 'i') })
        .exec((err, docs) => {
          if(err) reject(err)
          else resolve(docs)
        })
  })
}

export default mongoose.model('Bug', bugSchema)

