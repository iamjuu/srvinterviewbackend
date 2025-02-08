const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  imglink: String,
});

const product = mongoose.model("product", productSchema);

module.exports = product;
