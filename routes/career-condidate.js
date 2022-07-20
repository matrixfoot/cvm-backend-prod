const express = require('express');
const router = express.Router();
const condidateController = require('../controllers/career-condidate');
const userController = require('../controllers/user');

router.post('/createcondidate', condidateController.createcondidate);

router.get('/:id', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'condidate'),condidateController.getCondidate);

router.get('/', userController.allowIfLoggedin, userController.grantAccess('readAny', 'condidate'), condidateController.getCondidates);

router.put('/:id', userController.allowIfLoggedin, userController.grantAccess('updateOwn', 'condidate'), condidateController.updateCondidate);

router.delete('/:id', userController.allowIfLoggedin, userController.grantAccess('updateOwn', 'condidate'), condidateController.deletecondidate);

module.exports = router;