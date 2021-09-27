const express = require('express');
const router = express.Router();
const Deposit = require('./../controllers/deposit');
const verifyToken = require('../controllers/verify-user')


// verify subscription deposit
router.get('/subscription/:reference/:userId', Deposit.verifyPaystack);

// get user subscriptions
router.get('/subscription-status/:userId', verifyToken, Deposit.subscriptionStatus);

// get deposit balance
//router.get('/balance/:userId', verifyToken, Deposit.getBalance);

// get deposits
//router.get('/:userId', verifyToken, Deposit.getDeposits);

module.exports = router;