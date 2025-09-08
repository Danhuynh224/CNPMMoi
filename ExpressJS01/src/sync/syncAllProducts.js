const mongoose = require("mongoose");
const Product = require("../models/product");
const client = require("../elastic/elasticClient");
require("dotenv").config();
async function syncAllProducts() {
  const products = await Product.find(); // lấy tất cả sản phẩm

  for (const prod of products) {
    const doc = prod.toObject();
    delete doc._id; // ❌ xóa _id khỏi document
    delete doc.__v; // optional: xóa __v của Mongoose

    await client.index({
      index: "products",
      id: prod._id.toString(), // ✅ dùng _id của MongoDB làm id ES
      document: doc,
    });

    console.log(`✅ Indexed: ${prod.name}`);
  }

  console.log("🎉 Sync tất cả sản phẩm xong!");
}

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => syncAllProducts())
  .then(() => mongoose.disconnect())
  .catch((err) => console.error(err));
