const userModel = require("../models/UserModel");

//FIND THE USER BY ID 
exports.findUserById = (req, res, next, id) => {
  userModel
    .findById(id)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      req.profile = user; //APPEND THE USER IN PROFILE
      next();
    })
    .catch((error) => {
      return res.status(400).json({
        error: "User not found",
      });
    });
};
