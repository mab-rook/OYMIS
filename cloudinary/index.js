const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// cloudinary.config({
//   cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
//   api_key:process.env.CLOUDINARY_KEY,
//   api_secret:process.env.CLOUDINARY_SECRET
// })

// Configuration 
cloudinary.config({
  cloud_name: "dfwlxwfes",
  api_key: "142269236448137",
  api_secret: "xFc0oS8bAC21VlpZWa89mGAmU6A"
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'OYMIS',
    allowedFormats:['jpeg', 'png', 'jpg',]
  }
  
})

module.exports = {
  cloudinary,
  storage
}