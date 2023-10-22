const formidable = require("formidable"); //WHEN WE ARE SENDING FORM DATA THEN WE USE THIS PACKAGE
const _ = require("lodash"); //will use to update the form data
const fs = require("fs"); //IT IS USED TO READ FILES AND WHEN WE ARE WORKING WITH FILES
const productModel = require("../models/ProductModel");
const { errorHandler } = require("../helpers/dbErrorHandler"); //for error check
const ProductModel = require("../models/ProductModel");

//AS WE ARE UPLOADING IMAGE THATS WHY WE ARE USING FORM DATA NOT JSON FORMAT BECAUSE OF THIS WE ARE USING THAT FORMIDABLE PACKAGE

// GET PRODUCT BY ID AND SAVE IT IN REQ.PRODUCT
exports.findProductById = (req, res, next, id) => {
  productModel
    .findById(id)
    .populate("category")
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

/*
get products by sell/arrival
means the products which has been sold most get first or arrival means the product which is newly created gets first and this both things handled by according to query which is send by client side
if no query or params are given then return all products
by sell -----> /products?sortBy=sold&order=desc&limit=4
by arrival -----> /products?sortBy=createdAt&order=desc&limit=4
*/

exports.getAllProducts = (req, res) => {
  // if anything is coming in url then it can be get by .query
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  productModel
    .find()
    .select("-photo") //this means we do not want photo in that data
    .populate("category") //will tell the data there is relation with category table and get the data of that id
    .sort([[sortBy, order]])
    .limit(limit)
    .exec()
    .then((products) => {
      res.json(products);
      // res.send(products)
    })
    .catch((err) => {
      return res.status(400).json({
        error: "Product not found",
      });
    });
};

/* 
it will get the products with same category but will not list that product through which we are calling other products
*/

exports.getAllRelatedProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  productModel
    .find({ _id: { $ne: req.product }, category: req.product.category }) //$ne means does not show that product and category means show the same category
    .select("-photo")
    .limit(limit)
    .populate("category", "_id name") //now only show id and name
    .exec()
    .then((products) => {
      res.json(products);
      // res.send(products)
    })
    .catch((err) => {
      return res.status(400).json({
        error: "Product not found",
      });
    });
};

/**
 * get the categories of all products
 */

exports.getAllProductsCategories = (req, res) => {
  //distinct method get the all the distinct categories
  productModel
    .distinct("category", {})
    .then((categories) => {
      res.json(categories);
    })
    .catch((err) => {
      return res.status(400).json({
        error: "Categories not found",
      });
    });
};

/**
 * list products by search
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkboxes or radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.getProductsBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key == "price") {
        //gte ----- greater than price [0-10]
        //lte ---- less than 10
        findArgs[key] = {
          $gte: req.body.filters[key][0], //store greater than value in this
          $lte: req.body.filters[key][1], //store less than value in this
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  productModel
    .find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec()
    .then((products) => {
      res.json({
        size: products.length,
        products,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        error: "Products not found",
      });
    });
};

/**
 * as we know we are getting products details without photo
 * so we will create a method which will work as a middleware
 */
exports.getProductPhoto = (req, res, next) => {
  if (req.product.photo.data) {
    //it means we have image
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

/**
 * we will get the products by aplying seacrh product name and category
 */
exports.getProductsListSearch = (req, res) => {
  //create a query object to hold search value
  const query = {};
  //assign search value to query.name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" }; //this i will make the value to small letters
    //assign category value to query.category
    if (req.query.category && req.query.category != "All") {
      query.category = req.query.category;
    }

    //find the product based on the query
    ProductModel.find(query)
      .select("-photo")
      .then((products) => {
        res.json(products);
      })
      .catch((err) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
      });
  }
};

exports.decreaseQunatityOfProductAfterPurchase = (req, res, next) => {
  let bulkOps = req.body.order.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  productModel
    .bulkWrite(bulkOps, {})
    .then(() => {
      next();
    })
    .catch((err) => {
      return res.status(400).json({ error: "Could not update product" });
    });
};
