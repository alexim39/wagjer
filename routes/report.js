const express = require('express');
const router = express.Router();
const verifyToken = require('./../controllers/verify-user')
const UserReport = require('./../controllers/user/report')

// get user report
router.get('/:userId', verifyToken, UserReport.getReports);
// report a user
router.post('/', verifyToken, UserReport.create);
module.exports = router;