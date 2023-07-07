const { AppError } = require('../lib/index');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// Configuration 
cloudinary.config({
  cloud_name: 'drwdobame',
  api_key: '278229484654975',
  api_secret: 'bKBk-JI7wdh9rgewwq9IHPreavw'
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'employee-images'
    },
    public_id: async (req, file) => {
      const myFileName = `${Date.now()}-${file.originalname.split('.')[0]}`;
      return myFileName;
    },
    
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 0.5, // 500KB
  },
  fileFilter: function (req, file, cb) {   
      if (!['png', 'jpg', 'jpeg'].includes(file.mimetype.split('/')[1])) {
        return cb(new AppError('Only images are allowed', 400), null);
      }
      return cb(null, true);
    }
  });

  const deleteImageByUrl = async (imageUrl) => {
    const publicId = cloudinary.utils.extractPublicId(imageUrl);
    cloudinary.uploader.destroy(publicId, function(err, result) { console.log(result) });

    // try {
    //   const publicId = cloudinary.utils.extractPublicId(imageUrl);
    //   const result = await cloudinary.uploader.destroy(publicId);
    //   console.log('Image deleted from Cloudinary:', result);
    // } catch (error) {
    //   console.error('Error deleting image from Cloudinary:', error);
    // }
  }
const removeImage =  async(url) =>{
  if(url === 'https://res.cloudinary.com/dttgbrris/image/upload/v1681003634/3899618_mkmx9b.png') return;
  cloudinary.uploader.destroy(url,{ resource_type: 'image'})
}



module.exports = { upload , removeImage,deleteImageByUrl};
