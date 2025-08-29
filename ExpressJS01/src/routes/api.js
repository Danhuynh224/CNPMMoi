const express = require("express");
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
} = require("../controllers/userController");
const auth = require("../middlewares/auth");
const { delay } = require("../middlewares/delay");

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

module.exports = routerAPI;
