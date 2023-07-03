const express = require("express");
const isAuth = require("../middlerware/auth");

const { check, query, body } = require("express-validator");

const User = require("../models/users");
const router = express.Router();

const authAdminController = require("../controllers/admin");

// get all user
router.get("/", authAdminController.getUsers);

// get all history
router.get("/all/:userId", authAdminController.getAllHistory);

// admin login
router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    query("password", "Please enter a password at least 6 characters")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authAdminController.postLogin
);

// get username
router.get("/:userId", authAdminController.getUsername);

// add a new product
router.post(
  "/addproduct",
  isAuth,
  [
    body("name").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("category").isString().isLength({ min: 3 }).trim(),
    body("quantity").isNumeric().trim(),
    body("shortDesc").isString().trim(),
    body("longDesc").isString().trim(),
  ],

  authAdminController.postAddProduct
);

// update a product
router.post(
  "/updateproduct",
  isAuth,
  [
    body("productId").isString().trim(),
    body("name").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("category").isString().isLength({ min: 3 }).trim(),
    body("quantity").isNumeric().trim(),
    body("shortDesc").isString().trim(),
    body("longDesc").isString().trim(),
  ],

  authAdminController.postUpdateProduct
);

// delete a product
router.delete(
  "/deleteproduct/:productId:userId",
  isAuth,
  authAdminController.deleteProduct
);
module.exports = router;
