const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,

  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // sản phẩm yêu thích
  recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // sản phẩm đã xem
});

const User = mongoose.model("User", userSchema);
module.exports = User;
