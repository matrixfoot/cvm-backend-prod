const express = require('express');
const router = express.Router();
const carouselController = require('../controllers/settings');
const userController = require('../controllers/user');
const multer = require('../middleware/multer-config');
router.post('/createcarouseldata', multer,carouselController.createcarouseldata);
router.get('/', userController.allowIfLoggedin, userController.grantAccess('readAny', 'carousel'), carouselController.getCarouselalldata);
router.get('/:id', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'carousel'),carouselController.getcarouseldatabyid);
router.put('/:id', userController.allowIfLoggedin, multer ,userController.grantAccess('updateAny', 'carousel'),carouselController.updateCarouseldata);
router.delete('/:id', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'carousel'),carouselController.deleteCarouseldata);



module.exports = router;