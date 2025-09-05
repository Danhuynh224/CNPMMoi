const Product = require("../models/product");

// Lấy tất cả sản phẩm có phân trang
async function getProducts(page, limit, category) {
  const skip = (page - 1) * limit;

  const filter = {};
  if (category) {
    filter.category = category; // lọc theo category
  }

  const products = await Product.find(filter).skip(skip).limit(limit);

  const total = await Product.countDocuments(filter);

  return {
    data: products,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
  };
}

// Tìm theo id
async function getProductById(id) {
  return Product.findById(id);
}

// Thêm sản phẩm
async function createProduct(productData) {
  const product = new Product(productData);
  return product.save();
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
};
