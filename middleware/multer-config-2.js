const multer = require('multer');
cloudinary = require('cloudinary');
cloudinaryStorage = require('multer-storage-cloudinary');
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':'xlsx'  
};
cloudinary.config({  //Your Cloudinary API Data
  cloud_name: 'dfodbn7qv',
  api_key: '388111355517854',
  api_secret: 'xsnhok1yBMAlnET-HxwL4NlWSiM'
});
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'uploadedfiche',
  
 allowedFormats: ['application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation','pdf','PPTX'],
 destination: function (req, file, callback) { callback(null, 'images');},
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name );
  }
});

module.exports = multer({storage: storage}).array('image',9999);