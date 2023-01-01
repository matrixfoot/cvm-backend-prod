/*const multer = require('multer');
const ftpStorage = require("multer-ftp");
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
const storage = new ftpStorage({
    ftp: {
      host: 'www.macompta.com.tn',
      secure: false, // enables FTPS/FTP with TLS
      user: 'macompta',
      password: '2?1VgMx?02jOqW',
    },
    destination: function (req, file, options, callback) {
        callback(
          null,
          '/uploads/'  +
            file.originalname +
            "-" +
            Date.now() +
            "." +
            file.mimetype.split("/").pop()
        ); // custom file destination, file extension is added to the end of the path
      },
    
  });





module.exports = multer({storage: storage}).single('image');*/