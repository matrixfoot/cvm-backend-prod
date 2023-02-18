const express = require('express');
const router = express.Router();
const deccomptabiliteController = require('../controllers/deccomptabilite');
const userController = require('../controllers/user');
const multer = require('../middleware/multer-config-2');
router.post('/createdeccomptabilite', multer,deccomptabiliteController.createdeccomptabilite);
router.post('/', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'deccomptabilite'),deccomptabiliteController.getdeccomptabilite);
router.post('/anneemois', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'deccomptabilite'),deccomptabiliteController.getdeccomptabilitemoisannee);

router.get('/', userController.allowIfLoggedin, userController.grantAccess('readAny', 'deccomptabilite'), deccomptabiliteController.getDeccomptabilite);
router.get('/:id', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'deccomptabilite'),deccomptabiliteController.getdeccomptabilitebyid);
router.put('/:id', userController.allowIfLoggedin, userController.grantAccess('updateOwn', 'deccomptabilite'),deccomptabiliteController.updatedeccomptabilite);
router.put('/modify/:id', userController.allowIfLoggedin, userController.grantAccess('updateOwn', 'deccomptabilite'),deccomptabiliteController.completedeccomptabilite);
router.delete('/:id', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'deccomptabilite'),deccomptabiliteController.deletedeccomptabilite);
router.delete('/', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'deccomptabilite'),deccomptabiliteController.deletedeccomptabilites);

module.exports = router;