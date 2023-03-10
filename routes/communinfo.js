const express = require('express');
const communController = require('../controllers/communinfo');
const router = express.Router();
router.get('/currenttime', communController.getcurrenttime);
module.exports = router;