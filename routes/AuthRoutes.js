const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  signout,
  requireSignin, //authentication middleware
} = require("../controllers/AuthController");
const {
  userSignUpValidator,
  userSignInValidator,
} = require("../validator/index");

router.post("/signup", userSignUpValidator, signup);
router.post("/signin", userSignInValidator, signin);
router.get("/signout", signout);

//check user authentication works or not
// router.get('/hello', requireSignin, (req, res) => {
//   res.send("HELLO THERE")
// })
module.exports = router;
