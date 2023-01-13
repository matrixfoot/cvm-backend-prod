/*const multer = require('multer');
const ftpStorage = require("multer-ftp");
require ('dotenv').config();
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
try{

 
const storage = new ftpStorage({
    ftp: {
      host: process.env.host,
      secure: false, // enables FTPS/FTP with TLS
      user: process.env.ftpuser,
      password: process.env.ftppassword,
      connTimeout: 60000,
    pasvTimeout: 60000,
    aliveTimeout: 60000
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
  module.exports = multer({storage: storage}).single('image');
}
catch (error) {
  res.status(404).json({ error });
}*/




