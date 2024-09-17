const express = require("express");
const router = express.Router();
const middlewareController = require("../controllers/middlewareController");
const paymentController = require("../controllers/PaymentController");

// Get Transactions by User ID
router.get(
  "/transactions",
  middlewareController.verifyToken,
  paymentController.sendTransactionByUserId
);

router.post(
  "/send",
  middlewareController.verifyToken,
  paymentController.sendRequestEmail
);

router.post(
  "/send-code",
  middlewareController.verifyToken,
  paymentController.receiveCodeEmail
);

router.post(
  "/create_account",
  middlewareController.verifyToken,
  paymentController.sendDataToRequestCreateAccount
);

router.post(
  "/send-datapayment",
  middlewareController.verifyToken,
  paymentController.sendDataToPaymentSystem
);

router.post(
  "/deposit",
  middlewareController.verifyToken,
  paymentController.deposit
);

router.get(
  "/get-amount",
  middlewareController.verifyToken,
  paymentController.getAmount
);

router.get(
  "/getAllTransaction",
  middlewareController.verifyTokenAndAdminAuth,
  paymentController.getAllTransaction
);
module.exports = router;
