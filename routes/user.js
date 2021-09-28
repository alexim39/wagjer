const express = require('express');
const router = express.Router();
const User = require('./../controllers/user');
const verifyToken = require('../controllers/verify-user')

// get user
router.get('/', verifyToken, User.getUser);
// get users
router.get('/all', verifyToken, User.getUsers);
// update user
router.put('/', verifyToken, User.updateUser);
// delete user
router.delete('/:userId', verifyToken, User.deleteUser);

// fellow user
router.post('/fellow', verifyToken, User.fellowUser);
// unfellow user
router.post('/unfellow', verifyToken, User.unFellowUser);
// add rate up user
router.post('/addrateup', verifyToken, User.addRateUpUser);
// rate up user
router.post('/removerateup', verifyToken, User.removeRateUpUser);
// rate down user
router.post('/addratedown', verifyToken, User.addRateDownUser);
// rate down user
router.post('/removeratedown', verifyToken, User.removeRateDownUser);
// get user referers
router.get('/referers/:userId', verifyToken, User.getUserReferers);

module.exports = router;