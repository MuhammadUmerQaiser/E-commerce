const express = require("express");
const router = express.Router();
const {
  createCategory,
  findCategoryById,
  getCategory,
  updateCategory,
  removeCategory,
  getAllCategory,
} = require("../controllers/CategoryController");
const { categoryCreateValidator } = require("../validator/index");
const { findUserById } = require("../controllers/UserController");
const {
  requireSignin,
  isAuth,
  isAdmin,
} = require("../controllers/AuthController");

router.get("/category/:categoryId", getCategory);
//ONLY ADMIN CAN CREATE THE CATEGORY AND FOR ADMIN, ADMIN MUST HAVE TO SIGNED IN FIRST
router.post(
  "/category/create/:userId",
  categoryCreateValidator, //VALIDATION THAT NAME IS REQ
  requireSignin, //SIGN IN REQUIRED
  isAuth, //SIGNED IN USER CAN ACCESS
  isAdmin, //AND THAT USER MUST HAVE TO BE ADMIN
  createCategory //CONTROLLER
);
router.delete(
  "/category/:categoryId/:userId",
  requireSignin, //SIGN IN REQUIRED
  isAuth, //SIGNED IN USER CAN ACCESS
  isAdmin, //AND THAT USER MUST HAVE TO BE ADMIN
  removeCategory //CONTROLLER
);
router.put(
  "/category/:categoryId/:userId",
  categoryCreateValidator, //VALIDATION THAT NAME IS REQ
  requireSignin, //SIGN IN REQUIRED
  isAuth, //SIGNED IN USER CAN ACCESS
  isAdmin, //AND THAT USER MUST HAVE TO BE ADMIN
  updateCategory //CONTROLLER
);

router.get("/categories", getAllCategory);

//param --> wheneever the url or route get the userId variable it goes to that method/controller and get the user by that id
router.param("userId", findUserById);
router.param("categoryId", findCategoryById);

module.exports = router;
