const express = require("express");
const router = express.Router();
const { findUserById, addOrderToUserHistory } = require("../controllers/UserController");
const { requireSignin, isAuth } = require("../controllers/AuthController");
const { decreaseQunatityOfProductAfterPurchase } = require("../controllers/ProductController");
const { createOrder } = require("../controllers/OrderController");

router.post(
  "/order/create/:userId",
  requireSignin, //SIGN IN REQUIRED
  isAuth, //SIGNED IN USER CAN ACCESS
  addOrderToUserHistory,
  decreaseQunatityOfProductAfterPurchase,
  createOrder //CONTROLLER
);

//param --> wheneever the url or route get the userId variable it goes to that method/controller and get the user by that id
router.param("userId", findUserById);

module.exports = router;
