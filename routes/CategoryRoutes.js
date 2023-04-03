const express = require("express");
const router = express.Router();
const { createCategory } = require("../controllers/CategoryController");
const { categoryCreateValidator } = require("../validator/index");
const { findUserById } = require("../controllers/UserController");
const {
  requireSignin,
  isAuth,
  isAdmin,
} = require("../controllers/AuthController");

//ONLY ADMIN CAN CREATE THE CATEGORY AND FOR ADMIN, ADMIN MUST HAVE TO SIGNED IN FIRST
router.post(
  "/category/create/:userId",
  categoryCreateValidator, //VALIDATION THAT NAME IS REQ
  requireSignin, //SIGN IN REQUIRED
  isAuth, //SIGNED IN USER CAN ACCESS
  isAdmin, //AND THAT USER MUST HAVE TO BE ADMIN
  createCategory //CONTROLLER 
);

//param --> wheneever the url or route get the userId variable it goes to that method/controller and get the user by that id
router.param("userId", findUserById);

module.exports = router;
