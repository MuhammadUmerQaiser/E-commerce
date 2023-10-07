const express = require("express");
const router = express.Router();
const {
  createProduct,
  findProductById,
  getProduct,
  removeProduct,
  updateProduct,
  getAllProducts,
  getAllRelatedProducts,
  getAllProductsCategories,
  getProductsBySearch,
  getProductPhoto,
  getProductsListSearch,
} = require("../controllers/ProductController");
const { findUserById } = require("../controllers/UserController");
const {
  requireSignin,
  isAuth,
  isAdmin,
} = require("../controllers/AuthController");

router.get("/product/:productId", getProduct);
//ONLY ADMIN CAN CREATE THE PRODUCT AND FOR ADMIN, ADMIN MUST HAVE TO SIGNED IN FIRST
router.post(
  "/product/create/:userId",
  requireSignin, //SIGN IN REQUIRED
  isAuth, //SIGNED IN USER CAN ACCESS
  isAdmin, //AND THAT USER MUST HAVE TO BE ADMIN
  createProduct //CONTROLLER
);
router.delete(
  "/product/:productId/:userId",
  requireSignin, //SIGN IN REQUIRED
  isAuth, //SIGNED IN USER CAN ACCESS
  isAdmin, //AND THAT USER MUST HAVE TO BE ADMIN
  removeProduct //CONTROLLER
);
router.put(
  "/product/:productId/:userId",
  requireSignin, //SIGN IN REQUIRED
  isAuth, //SIGNED IN USER CAN ACCESS
  isAdmin, //AND THAT USER MUST HAVE TO BE ADMIN
  updateProduct //CONTROLLER
);
// get all products or get products according to query
router.get("/products", getAllProducts);
//get produts with search filter
router.get("/products/search", getProductsListSearch);
// get all products related to that category
router.get("/products/related/:productId", getAllRelatedProducts);
// get all products category
router.get("/products/categories", getAllProductsCategories);
// get all products by search
router.post("/products/by/search", getProductsBySearch);
// get all products image
router.get("/product/photo/:productId", getProductPhoto);

//param --> wheneever the url or route get the userId variable it goes to that method/controller and get the user by that id
router.param("userId", findUserById);
router.param("productId", findProductById);

module.exports = router;
