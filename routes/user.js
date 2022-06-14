const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/signup', userController.signup);

router.post('/login', userController.login);


router.get('/:id', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'profile'),userController.getUser);

router.get('/', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);

router.put('/:id', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);

router.delete('/:id', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);

module.exports = router;