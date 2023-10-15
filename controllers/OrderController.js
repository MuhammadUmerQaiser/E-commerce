const { Order, CartItem } = require("../models/OrderModel");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.findOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .populate("user", "_id name")
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(400).json({
          error: "Order not found",
        });
      }
      req.order = order; //APPEND THE USER IN PROFILE
      next();
    })
    .catch((error) => {
      return res.status(400).json({
        error: "Order not found",
      });
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(400).json({
        error: errorHandler(error),
      });
    });
};

exports.getAllOrdersForAdmin = (req, res) => {
  Order.find()
    .populate("user", "_id name address")
    .sort("-createdAt")
    .exec()
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      return res.status(400).json({ error: errorHandler(err) });
    });
};

exports.getListOfStatusValuesOfOrders = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateStatusOfOrder = (req, res) => {
  Order.updateOne({ _id: req.body.orderId }, { $set: { status: req.body.status } })
    .then((order) => {
      res.json(order);
    })
    .catch((err) => {
      return res.status(400).json({
        error: errorHandler(err),
      });
    });
};

exports.getOrder = (req, res) => {
  return res.json(req.order);
};
