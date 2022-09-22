const express = require('express');
const router = express.Router();
const decfiscmensController = require('../controllers/dec-fisc-mens');
const userController = require('../controllers/user');
const multer = require('../middleware/multer-config');
router.post('/createdecfiscmens', multer,decfiscmensController.createdecfiscmens);


router.get('/', userController.allowIfLoggedin, userController.grantAccess('readAny', 'contact'), decfiscmensController.getDecfiscmens);
router.get('/:id', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'contact'),decfiscmensController.getdecfiscmensbyid);
router.put('/:id', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'contact'),decfiscmensController.updatedecfiscmens);



module.exports = router;