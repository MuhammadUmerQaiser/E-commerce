const userModel = require("../models/UserModel");

exports.signup = (req, res) => {
  console.log("req.body", req.body);
  const user = new userModel(req.body);

  user
    .save(req.body)
    .then((data) => {
      res.json({
        data,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error,
      });
    });
};
