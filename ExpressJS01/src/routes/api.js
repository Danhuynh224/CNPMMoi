const express = require("express");
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
} = require("../controllers/userController");
const auth = require("../middlewares/auth");
const { delay } = require("../middlewares/delay");
const {
  getAllProducts,
  getProduct,
  searchProducts,
  getRelated,
  toggleFavorite,
  addView,
  getStats,
} = require("../controllers/productController");
const { createProduct } = require("../services/productService");
const authMiddleware = require("../middlewares/authMiddleware");

const routerAPI = express.Router();

// Test API (không cần auth)
routerAPI.get("/test", (req, res) => {
  res.status(200).json({ message: "Hello world API" });
});

// Auth routes
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

// Middleware auth cho các route user
routerAPI.use(auth);

// User routes
routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

// Product routes
routerAPI.get("/products", authMiddleware, getAllProducts);
routerAPI.get("/products/search", authMiddleware, searchProducts);
routerAPI.get("/products/:id", authMiddleware, getProduct);
routerAPI.post("/products", createProduct);
routerAPI.get("/products/:id/related", getRelated);
// API yêu cầu đăng nhập
routerAPI.post("/products/:id/view", authMiddleware, addView);
routerAPI.post("/products/:id/favorite", authMiddleware, toggleFavorite);
routerAPI.get("/products/:id/stats", getStats);

module.exports = routerAPI;
