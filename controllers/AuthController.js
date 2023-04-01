const userModel = require("../models/UserModel");
const { errorHandler } = require("../helpers/dbErrorHandler"); //for email uniquness
const jwtToken = require("jsonwebtoken"); //to generate token when user signed in
var { expressjwt: jwt } = require("express-jwt"); //to authorisation check

//SIGNUP
exports.signup = (req, res) => {
  const user = new userModel(req.body);

  user
    .save(req.body)
    .then((data) => {
      data.salt = undefined;
      data.hashed_password = undefined;
      res.json({
        data,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: errorHandler(error),
      });
    });
};

//SIGNIN
exports.signin = (req, res) => {
  ////find the user based on the email
  const { email, password } = req.body; //destructre the email & pass
  userModel
    .findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          error: "User with that email does not exist. Please Signup.",
        });
      }
      //if user is found make sure that email and password match
      // create authentcaite method in user mdoel to check password
      if (!user.authenticate(password)) {
        return res.status(401).json({
          error: "Password does not match",
        });
      }
      //generate a token with a combination of user _id and secret JWT in .env
      const token = jwtToken.sign({ _id: user._id }, process.env.JWT_SECRET);
      //save the token in cookie with expiry time of 9999 sec
      res.cookie("token", token, { expiry: new Date() + 9999 });
      // resturn response with user and token to frontend
      const { _id, name, email, role } = user; //destructre the user
      return res.json({
        token,
        user: { _id, name, email, role },
      });
    })
    .catch((error) => {
      if (error) {
        return res.status(400).json({
          error: "User with that email does not exist. Please Signup.",
        });
      }
    });
};

//SIGN OUT
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Sign Out successfully.",
  });
};

//AUTHENTICATION WHERE SIGN IN REQUIRED
// JWT provides me that the user must have to be logged and when it does it set the user in auth
exports.requireSignin = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

//this method checks that the logged in user does not access another person details
exports.isAuth = (req, res, next) => {
  //when i hit the params userId it sets the profile
  // and when user logged in jwt sets the auth property
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if(!user){
    return res.status(403).json({
      error: "Access Denied!"
    })
  }
  next();
}

//this method checks that the role must not be 0 for admin
exports.isAdmin = (req, res, next) => {
  if(req.profile.role === 0){
    return res.status(403).json({
      error: "Admin Resource. Access Denied!"
    })
  }
  next();
}
