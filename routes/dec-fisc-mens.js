const express = require('express');
const router = express.Router();
const decfiscmensController = require('../controllers/dec-fisc-mens');
const userController = require('../controllers/user');
const multer = require('../middleware/multer-config');
router.post('/createdecfiscmens', multer,decfiscmensController.createdecfiscmens);
router.post('/', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'decfiscmens'),decfiscmensController.getdecfiscmens);

router.get('/', userController.allowIfLoggedin, userController.grantAccess('readAny', 'decfiscmens'), decfiscmensController.getDecfiscmens);
router.get('/:id', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'decfiscmens'),decfiscmensController.getdecfiscmensbyid);
router.put('/:id', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'decfiscmens'),decfiscmensController.updatedecfiscmens);
router.put('modify/:id', userController.allowIfLoggedin, userController.grantAccess('updateOwn', 'decfiscmens'),decfiscmensController.completedecfiscmens);
router.delete('/:id', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'decfiscmens'),decfiscmensController.deletedecfiscmens);
router.delete('/', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'decfiscmens'),decfiscmensController.deletedecfiscmenss);

module.exports = router;