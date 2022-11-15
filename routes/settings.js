const express = require('express');
const router = express.Router();
const carouselController = require('../controllers/settings');
const userController = require('../controllers/user');
const multer = require('../middleware/multer-config');
router.post('/createcarouseldata', multer,carouselController.createcarouseldata);
router.get('/', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'carousel'), carouselController.createcarouseldata);
router.get('/:id', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'contact'),carouselController.getcarouseldatabyid);
router.put('/:id', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'contact'),carouselController.updateCarouseldata);
router.delete('/:id', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'contact'),carouselController.deleteCarouseldata);



module.exports = router;