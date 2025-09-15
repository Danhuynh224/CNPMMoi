const productService = require("../services/productService");

// GET /products?page=1&limit=10
async function getAllProducts(req, res) {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const products = await productService.getProducts(
      Number(page),
      Number(limit),
      category,
      req.user.id
    );
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /products/search?query=apple&page=1&limit=10
async function searchProducts(req, res) {
  try {
    const {
      name,
      category,
      priceMin,
      priceMax,
      page = 1,
      limit = 10,
    } = req.query;

    const result = await productService.searchProducts({
      name: name?.trim(),
      category,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      page: Number(page),
      limit: Number(limit),
      userId: req.user.id,
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /products/:id
async function getProduct(req, res) {
  try {
    const product = await productService.getProductById(
      req.params.id,
      req.user.id
    );
    if (!product) return res.status(404).json({ message: "Not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /products
async function createProduct(req, res) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
// GET /products/:id/related
async function getRelated(req, res) {
  try {
    const products = await productService.getRelatedProducts(req.params.id);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /products/:id/favorite
async function toggleFavorite(req, res) {
  try {
    const favorites = await productService.toggleFavorite(
      req.user.id,
      req.params.id
    );
    res.status(200).json({ favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /products/:id/view
async function addView(req, res) {
  try {
    const views = await productService.addRecentlyViewed(
      req.user.id,
      req.params.id
    );
    res.status(200).json({ recentlyViewed: views });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /products/:id/stats
async function getStats(req, res) {
  try {
    const stats = await productService.getStats(req.params.id);
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  searchProducts,
  getRelated,
  toggleFavorite,
  addView,
  getStats,
};
