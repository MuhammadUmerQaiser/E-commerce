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

// GET CATEGORY BY ID AND SAVE IT IN REQ.CATEGORY
exports.findCategoryById = (req, res, next, id) => {
  categoryModel
    .findById(id)
    .exec()
    .then((category) => {
      if (!category) {
        return res.status(400).json({
          error: "Category not found",
        });
      }
      req.category = category;
      next();
    })
    .catch((error) => {
      return res.status(400).json({
        error: "Category not found",
      });
    });
};

//GET ONE CATEGORY BY ID
exports.getCategory = (req, res) => {
  return res.json(req.category);
};

//DELETE CATEGORY
exports.removeCategory = (req, res) => {
  let category = req.category;
  category
    .deleteOne()
    .then(() => {
      res.json({
        message: "Category Deleted Successfully",
      });
    })
    .catch((err) => {
      return res.status(400).json({
        error: errorHandler(err),
      });
    });
};

//UPDATE CATEGORY
exports.updateCategory = (req, res) => {
  let category = req.category;
  category.name = req.body.name;
  category
    .save(req.body)
    .then((data) => {
      res.json({
        data,
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error: errorHandler(error),
      });
    });
};

//GET ALL CATEGORIES
exports.getAllCategory = (req, res) => {
  categoryModel
    .find()
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      return res.status(400).json({
        error: errorHandler(error),
      });
    });
};
