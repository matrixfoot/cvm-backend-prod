const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event');
const userController = require('../controllers/user');
const multer = require('../middleware/multer-config');
router.get('/', eventController.getEvents);
router.get('/coming_events', eventController.getcomingEvents);
router.get('/:id', eventController.geteventbyid);
router.post('/add_events', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'event'),eventController.createEvent);
router.delete('/:id', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'event'),eventController.deleteEvent);
router.put('/:id', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'event'),eventController.updateEvent);

module.exports = router;