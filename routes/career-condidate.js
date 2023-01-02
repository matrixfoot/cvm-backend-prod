const express = require('express');
const router = express.Router();
const condidateController = require('../controllers/career-condidate');
const userController = require('../controllers/user');
const multer = require('../middleware/milter-config3');
router.post('/createcondidate', multer,condidateController.createcondidate);
router.post('/filtercondidatechoice', userController.allowIfLoggedin, userController.grantAccess('readAny', 'condidate'),condidateController.filtercondidatechoice);
router.post('/condidate', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'condidate'),condidateController.getCondidate);
router.get('/:id', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'condidate'),condidateController.getcondidatebyid);
router.get('/', userController.allowIfLoggedin, userController.grantAccess('readAny', 'condidate'), condidateController.getCondidates);

router.put('/:id', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'condidate'),condidateController.updateCondidate);

router.delete('/:id', userController.allowIfLoggedin, userController.grantAccess('updateOwn', 'condidate'), condidateController.deletecondidate);
router.delete('/', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'condidate'), condidateController.deletecondidates);

module.exports = router;