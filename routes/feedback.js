const express = require('express');
const router = express.Router();
const Feedback = require('./../controllers/feedback');
const verifyToken = require('../controllers/verify-user')

// Create task
//router.post('/', verifyToken, Feedback.create);
router.post('/', Feedback.create);

module.exports = router;