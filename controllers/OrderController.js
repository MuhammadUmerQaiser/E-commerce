const { Order, CartItem } = require("../models/OrderModel");
const { errorHandler } = require("../helpers/dbErrorHandler");

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
