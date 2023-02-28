const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact-req');
const userController = require('../controllers/user');
const multer = require('../middleware/multer-config3');
router.post('/createcontactreq', multer,contactController.createcontactreq);
router.post('/createcontactreqwithoutimage',contactController.createcontactreqwithoutimage);
router.post('/filtercontactreqsup', userController.allowIfLoggedin, userController.grantAccess('readAny', 'contact'),contactController.getContactreqsup);
router.post('/filtercontactreqinf', userController.allowIfLoggedin, userController.grantAccess('readAny', 'contact'),contactController.getContactreqinf);
router.post('/contact', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'condidate'),contactController.getContact);
router.get('/', userController.allowIfLoggedin, userController.grantAccess('readAny', 'contact'), contactController.getContactreqs);
router.get('/:id', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'contact'),contactController.getcontactbyid);
router.put('/:id', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'contact'),contactController.updateContact);



module.exports = router;