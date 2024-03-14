const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/SubSystem/paymentController');
const middlewareController = require('../../controllers/middlewareController');

// Create Payment Account
router.post('/create-account', paymentController.createPaymentAccount);

// Get Transaction
router.post('/get-transaction', paymentController.getTransactionByUserId);

// Execute Payment
router.post('/execute-payment', paymentController.executePayment);

// Verify Email
router.post('/verify-email', paymentController.sendVerifyEmail);

// Verify Code
router.post('/verify-code', paymentController.verifyCodeEmail);

//Deposit 
router.post('/deposit',  paymentController.deposit);

// Get Amount
router.post('/getAmount',  paymentController.getAmount);

// Get All Transaction
router.post('/getAllTransaction',  paymentController.getAllTransaction);
module.exports = router;