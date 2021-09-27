const express = require('express');
const router = express.Router();
const BetCodes = require('../controllers/betcodes');
const verifyToken = require('../controllers/verify-user')

// Create
router.post('/', verifyToken, BetCodes.create)
// Get all item 
router.get('/', verifyToken, BetCodes.getBetcodes)
// Get all for a user 
router.get('/:userId', verifyToken, BetCodes.getUserBetcodes)
// Get all user code by username
router.get('/username/:username', verifyToken, BetCodes.getUserBetcodesByUsername)
// Update
router.put('/', verifyToken, BetCodes.updateBetcode)
// Delete
router.delete('/:codeId', verifyToken, BetCodes.removeBetcode)

module.exports = router;