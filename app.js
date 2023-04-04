const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
require("dotenv").config();
const app = express();
//IMPORT ROUTES
const authRouter = require("./routes/AuthRoutes"); //Auth ROUTES
const userRouter = require("./routes/UserRoutes"); //USER ROUTES
const categoryRouter = require("./routes/CategoryRoutes"); //CATEGORY ROUTES
const productRouter = require("./routes/ProductRoutes"); //PRODUCT ROUTES

const port = process.env.PORT || 8000; //PORT

//connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    // createIndexes: true,
  })
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch((error) => {
    console.log(error);
  });
//MIDDLEWARES
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

//ROUTES
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use("/api", productRouter);

app.listen(port, () => {
  console.log(`NODE IS RUNNING ON PORT ${port}`);
});
