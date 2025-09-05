const mongoose = require("mongoose");
const Product = require("../src/models/product");
require("dotenv").config();

async function seed() {
  await mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("✅ MongoDB connected...");

  // Xóa dữ liệu cũ
  await Product.deleteMany({});

  // Giả sử ta có sẵn 5 ảnh trong uploads/products
  const images = ["sp1.jpg", "sp2.jpg", "sp3.jpg", "sp4.jpg", "sp5.jpg"];
  const categories = ["Cầu lông", "Bóng đá", "Bóng bàn", "Bóng rổ"];

  const products = [];
  for (let i = 1; i <= 20; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const image = images[Math.floor(Math.random() * images.length)];

    products.push({
      name: `Sản phẩm ${i}`,
      price: (Math.random() * 100 + 10).toFixed(2),
      category,
      image: `/uploads/products/${image}`, // đường dẫn tương đối
    });
  }

  await Product.insertMany(products);
  console.log("🎉 Fake data inserted successfully!");
  mongoose.disconnect();
}

seed().catch((err) => console.error(err));
