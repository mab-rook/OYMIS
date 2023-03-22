const mongoose = require('mongoose')
const Driver = require('./models/driver')
mongoose.connect('mongodb://127.0.0.1:27017/mis')
  .then(() => {
    console.log('connection opened')
  })
  .catch(err => {
    console.log('connection closed')
    console.log(err)
  })

const d = new Driver({
  firstName: ayinde,
  lastName: sada
})
  
d.save()
  .then(d => {
    console.log(d)
  })
  .catch(e => {
    console.log(e)
  })

// const seedDriver = [
//   {
//     firstName: Ayinu,
//     lastName: musa,
//     age: 30,
//     hometown: ibadan,
//     phoneNumber: 8090238712,
//     address: losAngela,
//     category: bus,


//   },
//   {
//     firstName: Ayinde,
//     lastName: ayinla,
//     age: 25,
//     hometown: ibadan,
//     phoneNumber: 8090238712,
//     address: losAngela,
//     category: bus,
//   }
// ]
  
// Driver.insertMany(seedDriver)
//   .then(d => {
//     console.log(d)
//   })
//   .catch(e => {
//     console.log(e)
//   })