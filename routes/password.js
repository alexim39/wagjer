const express = require('express');
const router = express.Router();
const Password = require('./../controllers/password');
const verifyToken = require('../controllers/verify-user');

// change password
router.put('/', verifyToken, Password.change);


module.exports = router;