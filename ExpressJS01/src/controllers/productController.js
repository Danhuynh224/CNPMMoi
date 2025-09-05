const productService = require("../services/productService");

// GET /products?page=1&limit=10
async function getAllProducts(req, res) {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const products = await productService.getProducts(
      Number(page),
      Number(limit),
      category
    );
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /products/:id
async function getProduct(req, res) {
  try {
    const product = await productService.getProductById(req.params.id);
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

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
};
