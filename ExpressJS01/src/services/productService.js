const { default: mongoose } = require("mongoose");
const client = require("../elastic/elasticClient");
const Product = require("../models/product");
const User = require("../models/user");

// Lấy tất cả sản phẩm có phân trang
async function getProducts(page, limit, category, userId) {
  const skip = (page - 1) * limit;

  const filter = {};
  if (category) filter.category = category;

  const products = await Product.find(filter).skip(skip).limit(limit);
  const total = await Product.countDocuments(filter);

  // Lấy danh sách favorites và recentlyViewed của user
  let user = null;
  if (userId) {
    user = await User.findById(userId).select("favorites recentlyViewed");
  }

  const data = products.map((p) => {
    const productObj = p.toObject();
    productObj.isLike = user ? user.favorites.includes(p._id) : false;
    productObj.isViewed = user ? user.recentlyViewed.includes(p._id) : false;
    return productObj;
  });

  return {
    data,
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
  userId,
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
  let user = null;
  if (userId) {
    user = await User.findById(userId).select("favorites recentlyViewed");
  }

  const data = products.map((p) => {
    const productObj = p.toObject();
    productObj.isLike = user ? user.favorites.includes(p._id) : false;
    productObj.isViewed = user ? user.recentlyViewed.includes(p._id) : false;
    return productObj;
  });
  return {
    data: data,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
  };
}

// Tìm theo id
async function getProductById(id, userId) {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new Error("Invalid product id");

  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  // Đếm số lượt thích và lượt xem
  const likesCount = await User.countDocuments({ favorites: id });
  const viewsCount = await User.countDocuments({ recentlyViewed: id });

  // Kiểm tra user đã like/viewed hay chưa
  let isLike = false;
  let isViewed = false;
  if (userId) {
    const user = await User.findById(userId).select("favorites recentlyViewed");
    if (user) {
      isLike = user.favorites.includes(product._id);
      isViewed = user.recentlyViewed.includes(product._id);
    }
  }

  return {
    ...product.toObject(),
    likesCount,
    viewsCount,
    isLike,
    isViewed,
  };
}

// Thêm sản phẩm
async function createProduct(productData) {
  const product = new Product(productData);
  return product.save();
}
// Lấy sản phẩm tương tự theo category
async function getRelatedProducts(productId) {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  return await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(5);
}

// Thêm sản phẩm vào favorites
async function toggleFavorite(userId, productId) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const index = user.favorites.indexOf(productId);
  if (index === -1) {
    user.favorites.push(productId);
  } else {
    user.favorites.splice(index, 1);
  }
  await user.save();
  return user.favorites;
}

async function addRecentlyViewed(userId, productId) {
  const productObjectId = new mongoose.Types.ObjectId(productId);

  // 1. Loại bỏ productId nếu đã tồn tại
  await User.updateOne(
    { _id: userId },
    { $pull: { recentlyViewed: productObjectId } }
  );

  // 2. Thêm productId vào đầu mảng
  await User.updateOne(
    { _id: userId },
    { $push: { recentlyViewed: { $each: [productObjectId], $position: 0 } } }
  );

  // 3. Giới hạn số lượng tối đa 10 sản phẩm
  await User.updateOne({ _id: userId }, [
    {
      $set: {
        recentlyViewed: { $slice: ["$recentlyViewed", 0, 10] },
      },
    },
  ]);

  // 4. Trả về mảng mới
  const user = await User.findById(userId).select("recentlyViewed");
  return user.recentlyViewed;
}

// Đếm số khách mua + số comment
async function getStats(productId) {
  const product = await Product.findById(productId)
    .populate("buyers", "name email")
    .populate("comments.user", "name email");

  if (!product) throw new Error("Product not found");

  return {
    buyersCount: product.buyers.length,
    commentsCount: product.comments.length,
  };
}
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  searchProducts,
  getRelatedProducts,
  toggleFavorite,
  addRecentlyViewed,
  getStats,
};
