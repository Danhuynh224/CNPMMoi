const client = require("../elastic/elasticClient");
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

async function searchProducts({
  name,
  category,
  priceMin,
  priceMax,
  page = 1,
  limit = 10,
}) {
  const from = (page - 1) * limit;

  let esIds = null;

  // Nếu có tìm theo tên thì query ES
  if (name) {
    const esResult = await client.search({
      index: "products",
      from,
      size: limit,
      query: {
        match: {
          name: {
            query: name,
            fuzziness: "AUTO",
          },
        },
      },
    });

    esIds = esResult.hits.hits.map((hit) => hit._id); // lấy danh sách _id từ ES
  }

  // Xây filter cho Mongo
  const filter = {};
  if (category) filter.category = category;
  if (priceMin !== undefined || priceMax !== undefined) {
    filter.price = {};
    if (priceMin !== undefined) filter.price.$gte = priceMin;
    if (priceMax !== undefined) filter.price.$lte = priceMax;
  }
  if (esIds) {
    filter._id = { $in: esIds }; // lọc chỉ các sản phẩm tìm thấy trong ES
  }

  const products = await Product.find(filter).skip(from).limit(limit);
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
  searchProducts,
};
