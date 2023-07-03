const express = require("express");

const { check, query } = require("express-validator");

const User = require("../models/users");
const router = express.Router();

const authController = require("../controllers/users");

// signup new account
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-mail exists already,please pick a defferent one"
            );
          }
        });
      })
      .normalizeEmail(),
    query("password", "Please enter a password at least 6 characters")
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postSignup
);

// login
router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    query("password", "Please enter a password at least 6 characters")
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

// get username to show in client
router.get("/:userId", authController.getUsername);

module.exports = router;
