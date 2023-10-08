const express = require("express");
const router = express.Router();
const { findUserById } = require("../controllers/UserController");
const { generateToken, processPayment } = require("../controllers/BraintreeController");
const { requireSignin, isAuth } = require("../controllers/AuthController");

router.get("/braintree/token/:userId", requireSignin, isAuth, generateToken);
router.post(
  "/braintree/payment/:userId",
  requireSignin,
  isAuth,
  processPayment
);

router.param("userId", findUserById);

module.exports = router;
