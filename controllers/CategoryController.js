const categoryModel = require("../models/CategoryModel");
const { errorHandler } = require("../helpers/dbErrorHandler"); //for error check
//CREATE CATEGORY
exports.createCategory = (req, res) => {
  const category = new categoryModel(req.body);

  category
    .save(req.body)
    .then((data) => {
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
