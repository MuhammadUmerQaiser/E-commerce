const userModel = require("../models/UserModel");
const { errorHandler } = require("../helpers/dbErrorHandler");
const jwtToken = require("jsonwebtoken"); //to generate token when user signed in
const expressJwt = require("express-jwt"); //to authorixation check

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
