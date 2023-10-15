const express = require("express");
const router = express.Router();
const {
  findUserById,
  addOrderToUserHistory,
} = require("../controllers/UserController");
const {
  requireSignin,
  isAuth,
  isAdmin,
} = require("../controllers/AuthController");
const {
  decreaseQunatityOfProductAfterPurchase,
} = require("../controllers/ProductController");
const {
  createOrder,
  getAllOrdersForAdmin,
  getListOfStatusValuesOfOrders,
  findOrderById,
  updateStatusOfOrder,
  getOrder,
} = require("../controllers/OrderController");

router.post(
  "/order/create/:userId",
  requireSignin, //SIGN IN REQUIRED
  isAuth, //SIGNED IN USER CAN ACCESS
  addOrderToUserHistory,
  decreaseQunatityOfProductAfterPurchase,
  createOrder //CONTROLLER
);

router.get(
  "/orders/list/:userId",
  requireSignin, //SIGN IN REQUIRED
  isAuth, //SIGNED IN USER CAN ACCESS
  isAdmin,
  getAllOrdersForAdmin //CONTROLLER
);

router.get(
  "/order/status-values/:userId",
  requireSignin, //SIGN IN REQUIRED
  isAuth, //SIGNED IN USER CAN ACCESS
  isAdmin,
  getListOfStatusValuesOfOrders //CONTROLLER
);

router.get(
  "/order/:orderId/:userId",
  requireSignin, //SIGN IN REQUIRED
  isAuth, //SIGNED IN USER CAN ACCESS
  isAdmin,
  getOrder //CONTROLLER
);

router.put(
  "/order/:orderId/update-status/:userId",
  requireSignin, //SIGN IN REQUIRED
  isAuth, //SIGNED IN USER CAN ACCESS
  isAdmin,
  updateStatusOfOrder //CONTROLLER
);

//param --> wheneever the url or route get the userId variable it goes to that method/controller and get the user by that id
router.param("userId", findUserById);
router.param("orderId", findOrderById);

module.exports = router;
