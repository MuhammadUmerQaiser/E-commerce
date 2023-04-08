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

// get the user details
exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.hashed_password = undefined;
  return res.json(req.profile);
};

//updaet the user
exports.updateUser = (req, res) => {
  userModel
    .findOneAndUpdate(
      { _id: req.profile.id },
      { $set: req.body },
      { new: true }
    )
    .then((user) => {
      user.salt = undefined;
      user.hashed_password = undefined;
      res.json(user);
    })
    .catch((err) => {
      return res.status(400).json({
        error: "You are not authorized to perform this action",
      });
    });
};
