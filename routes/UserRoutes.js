const express = require("express");
const router = express.Router();
const {
  findUserById,
  getUser,
  updateUser,
  userPurchaseHistory,
} = require("../controllers/UserController");
const {
  requireSignin,
  isAuth,
  isAdmin,
} = require("../controllers/AuthController");

//it has userId and requireSignin middleware
router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile,
  });
});

router.get(
  "/user/:userId",
  requireSignin, //SIGN IN REQUIRED
  isAuth, //SIGNED IN USER CAN ACCESS
  getUser //CONTROLLER
);
router.put(
  "/user/:userId",
  requireSignin, //SIGN IN REQUIRED
  isAuth, //SIGNED IN USER CAN ACCESS
  updateUser //CONTROLLER
);

router.get(
  "/orders/by/user/:userId",
  requireSignin, //SIGN IN REQUIRED
  isAuth, //SIGNED IN USER CAN ACCESS
  userPurchaseHistory //CONTROLLER
);

//param --> wheneever the url or route get the userId variable it goes to that method/controller and get the user by that id
router.param("userId", findUserById);

module.exports = router;
