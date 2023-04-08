const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema; //PRODUCT IS BASED ON CATEGORY SO WE USE OBJECTID TO GET CATEGORY ID TO MAKE RELATIONS

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 32,
      required: true,
    },
    description: {
      type: String,
      maxLength: 2000,
      required: true,
    },
    price: {
      type: Number,
      trim: true,
      maxLength: 32,
      required: true,
    },
    category: {
      type: ObjectId, //take the object id which is defined above
      ref: "Category", //define the relation or table name
      required: true,
    },
    quantity: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0
    },
    photo: {
      //thats how we are saving image
      data: Buffer,
      contentType: String,
    },
    shipping: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
