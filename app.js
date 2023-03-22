if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
var cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const Driver = require('./models/driver')
const Mean = require('./models/means');
const { transcode } = require('buffer');
const multer = require('multer');
const { storage, cloudinary } = require('./cloudinary/index');
const upload = multer({ storage });



mongoose.connect('mongodb://127.0.0.1:27017/mis')
  .then(() => {
    console.log('connection opened')
  })
  .catch(err => {
    console.log('connection closed')
    console.log(err)
  })

const app = express()
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
// app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// app.use(cookieParser());
// app.use(session());
// app.configure(function() {
//   app.use(express.cookieParser('keyboard cat'));
//   app.use(express.session({ cookie: { maxAge: 60000 }}));
//   app.use(flash());
// });
app.use(session({
    secret:'Amubpem',
    saveUninitialized: true,
    resave: true
}));
// app.use(session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next();
})



// var noMatch = null
const garages = ['Mobolaje', 'Owode', 'cele', 'Oke Oba', 'Akimorin', 'Idi Igba', 'Araromi']
const categories = ['Bus', 'Tricycle', 'Bicycle']
app.get('/', (req, res) => {
  res.render('home')
})

app.get('/drivers', async (req, res) => {
  const {garage} = req.query
  let noMatch = null;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi')
    // const category = req.query
    const drivers = await Driver.find({ "$or":[
                {firstName: regex},
                {lastName: regex},
                {garage: regex}       
            ]});
    console.log(req.query.search)
    if (drivers.length < 1) {
      noMatch = "No drivers match that query, please try again."
      res.render('drivers/index', { drivers, noMatch, garage });
    } else {
      res.render('drivers/index', { drivers, noMatch, garage });
    }    
  } else if (garage) {
    const drivers = await Driver.find({ garage });
    res.render('drivers/index', { drivers, noMatch, garage });
  } else{
    const drivers = await Driver.find({});
    res.render('drivers/index', { drivers, noMatch, garage: 'All' });
  }
})

app.get('/drivers/new',  (req, res) => {
  res.render('drivers/new', { categories, garages });
})

app.post('/drivers', upload.array("image"), async (req, res) => {
  const driver = new Driver(req.body.driver)
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'roycheek478@gmail.com',
      pass: 'ovlgwtfgkjbbkjzk',
        },
      tls: {
        rejectUnauthorized: false
      }
  });
  var mailOptions = {
    from: 'mubarakmahmunalaka@gmail.com',
    to: `${req.body.driver.email}`,
    subject: 'Confirmation Message',
    text: `Dear Mr ${req.body.driver.lastName} ${req.body.driver.firstName}, You recently provided us with your information at the Oyo State Park Management System office in the Oyo Town branch at ${req.body.driver.created}.
    for any update, visit our office at any time.
    Thanks.
    from us at Oyo PMS`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  driver.images = req.files.map(f => ({url:f.path, filename: f.filename}))
  await driver.save();
  req.flash('success', 'Successfully Added')
  res.redirect('/drivers');
  // res.redirect(`/drivers/${driver._id}`)
})

app.get('/drivers/:id', async(req, res) => {
  const driver = await Driver.findById(req.params.id);
  res.render('drivers/show', { driver })
})

app.get('/drivers/:id/edit', async (req, res) => {
  const { id } = req.params
  const driver = await Driver.findById(id);
  res.render('drivers/edit', { driver, categories ,garages } )
})

app.put('/drivers/:id', upload.array("image"), async (req, res) => {
  const { id } = req.params
  const driver = await Driver.findByIdAndUpdate(id, { ...req.body.driver })
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
  driver.images.push(...imgs)
  driver.save()
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename)
    }
    await driver.updateOne({$pull: {images: { filename:{$in: req.body.deleteImages}}}})
  }
  req.flash('success', 'Successfully Modified')
  res.redirect(`/drivers/${driver._id}`)
})

app.delete('/drivers/:id', async (req, res) => {
  const { id } = req.params;
  const driver = await Driver.findByIdAndDelete(id);
  req.flash('success', 'Successfully Deleted')
  res.redirect('/drivers');
})

app.get('/means', async (req, res) => {
  const { category } = req.query
  if (category) {
    const means = await Mean.find({category})
    res.render('means/index', { means, garages, category })
  } else {
    const means = await Mean.find({})
    res.render('means/index', { means, garages, category: 'All' })
  }
  
});

app.get('/means/new', async (reg, res) => {
  res.render('means/new', {categories, garages})
});

app.post('/means', async (req, res) => {
  const mean = new Mean(req.body)
  await mean.save();
  req.flash('success', 'Successfully Added')
  res.redirect('/means')
})


app.get('/means/:id', async (req, res) => {
  const mean = await Mean.findById(req.params.id)
  res.render('means/show', { mean });
})

app.get('/means/:id/edit', async (req, res) => {
  const mean = await Mean.findById(req.params.id);
  res.render('means/edit', { mean, categories, garages});
})

app.put('/means/:id', async (req, res) => {
  const {id} = req.params
  const mean = await Mean.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
  mean.save();
  req.flash('success', 'Successfully Updated')
  res.redirect(`/means/${mean._id}`)
})

app.delete('/means/:id', async (req, res) => {
  const { id } = req.params
  const mean = await Mean.findByIdAndDelete(id)
  req.flash('success', 'Successfully Deleted')
  res.redirect('/means')
})




function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


app.listen(1000, (req, res) => {
  console.log('keep off')
})