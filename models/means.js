const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MeanSchema = new Schema({
  name: {
    type:String
  },
  owner: {
    type: String
  },
  plateNumber:{
    type: String
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  category:{
    type: String,
    enum:['Bus', 'Tricycle', 'Bicycle']
  },
  garage:{
    type: String,
    enum: ['Mobolaje', 'Owode', 'Cele', 'Oke-Oba', 'Akimorin', 'Idi-Igba', 'Araromi']
  }
})

module.exports = mongoose.model('Mean', MeanSchema)