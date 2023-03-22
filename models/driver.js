const mongoose = require('mongoose');
const { uuid } = require('uuid');
const Schema = mongoose.Schema;

const DriverSchema = new Schema({
  firstName: {
    type: String,
  } ,
  lastName: {
    type: String,
  },
  email: {
    type:String
  },
  age: {
    type: Number,
  },
  hometown: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  status: {
    type:String,
  },
  address: {
    type: String,
  },
  license: {
    type:String,
  },
  images: [
    {
      url: String,
      filename: String
    }
  ] ,
  nextOfKin:{
    type: String,
  },
  phone_next: {
    type: Number,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  garage:{
    type: String,
    enum:['Mobolaje', 'Owode', 'Cele', 'Oke-Oba', 'Akimorin', 'Idi-Igba', 'Araromi']
  },
  category:{
    type: String,
    enum:['Bus', 'Tricycle', 'Bicycle']
  },
  deleteImages: Array
  
})

module.exports = mongoose.model('Driver', DriverSchema)