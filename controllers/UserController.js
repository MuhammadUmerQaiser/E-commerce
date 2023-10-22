const { errorHandler } = require("../helpers/dbErrorHandler");
const { Order } = require("../models/OrderModel");
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

exports.addOrderToUserHistory = (req, res, next) => {
  let history = [];

  req.body.order.products.forEach((item) => {
    history.push({
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.count,
      transaction_id: req.body.order.transaction_id,
      // amount: req.body.order.amount,
      amount: item.price,
    });
  });

  userModel
    .findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { history: history } },
      { new: true }
    )
    .then((data) => {
      next();
    })
    .catch((error) => {
      return res.status(400).json({
        error: "Could not update user purchase history",
      });
    });
};

exports.userPurchaseHistory = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .sort("-created")
    .exec()
    .then((orders) => {
      return res.json(orders);
    })
    .catch((err) => {
      return res.status(400).json({
        error: errorHandler(err),
      });
    });
};
