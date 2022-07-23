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
  cloud_name: 'dukprdbod',
  api_key: '262164836529172',
  api_secret: '3Cqr73sOemYtlKN6-7IJEvEgN5E'
});
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'cvcandidats',
  
 allowedFormats: ['application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation','pdf','PPTX'],
 destination: function (req, file, callback) { callback(null, 'images');},
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name );
  }
});

module.exports = multer({storage: storage}).single('file');