const formidable = require("formidable"); //WHEN WE ARE SENDING FORM DATA THEN WE USE THIS PACKAGE
const _ = require("lodash"); //will use to update the form data
const fs = require("fs"); //IT IS USED TO READ FILES AND WHEN WE ARE WORKING WITH FILES
const productModel = require("../models/ProductModel");
const { errorHandler } = require("../helpers/dbErrorHandler"); //for error check

//AS WE ARE UPLOADING IMAGE THATS WHY WE ARE USING FORM DATA NOT JSON FORMAT BECAUSE OF THIS WE ARE USING THAT FORMIDABLE PACKAGE

// GET PRODUCT BY ID AND SAVE IT IN REQ.PRODUCT
exports.findProductById = (req, res, next, id) => {
  productModel
    .findById(id)
    .exec()
    .then((product) => {
      if (!product) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      req.product = product;
      next();
    })
    .catch((error) => {
      return res.status(400).json({
        error: "Product not found",
      });
    });
};

//get the requested product
exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

//CREATE PRODUCT
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm(); //get everything in form
  form.keepExtensions = true;

  //now parse the fields and files (it contains images)
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    //get all the data from fields
    const { name, description, quantity, category, price, shipping } = fields;

    // check validation
    if (
      !name ||
      !description ||
      !quantity ||
      !category ||
      !price ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    let product = new productModel(fields); //it takes the fields data to model

    //photo---> is the name we are sending through client side that's why files.photo
    if (files.photo) {
      //1kb = 1000bytes
      //1mb = 1000000bytes
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      //we create the photo object in model that's why product.photo.data
      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.contentType = files.photo.mimetype;
    } else {
      return res.status(400).json({
        error: "Image is required",
      });
    }

    //now save the date or create the data
    product
      .save()
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        return res.status(400).json({
          error: errorHandler(error),
        });
      });
  });
};

//DELETE PRODUCT
exports.removeProduct = (req, res) => {
  let product = req.product;
  product
    .deleteOne()
    .then(() => {
      res.json({
        message: "Product Deleted Successfully",
      });
    })
    .catch((err) => {
      return res.status(400).json({
        error: errorHandler(err),
      });
    });
};

//UPDATE PRODUCT
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm(); //get everything in form
  form.keepExtensions = true;

  //now parse the fields and files (it contains images)
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    //get all the data from fields
    const { name, description, quantity, category, price, shipping } = fields;

    // check validation
    if (
      !name ||
      !description ||
      !quantity ||
      !category ||
      !price ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    let product = req.product; //it takes the fields data to model
    product = _.extend(product, fields);

    //photo---> is the name we are sending through client side that's why files.photo
    if (files.photo) {
      //1kb = 1000bytes
      //1mb = 1000000bytes
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      //we create the photo object in model that's why product.photo.data
      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.contentType = files.photo.mimetype;
    } else {
      return res.status(400).json({
        error: "Image is required",
      });
    }

    //now save the date or create the data
    product
      .save()
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        return res.status(400).json({
          error: errorHandler(error),
        });
      });
  });
};
