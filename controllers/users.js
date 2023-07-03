const User = require("../models/users");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// sign up
exports.postSignup = (req, res, next) => {
  const fullname = req.query.fullname;
  const email = req.query.email;
  const password = req.query.password;
  const phone = req.query.phone;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.json({
      message: error.array()[0].msg,
      statusCode: 422,
    });
  }

  // Encrypt password and save to database
  bcrypt
    .hash(password, 12)
    .then((pass) => {
      const user = new User({
        fullname: fullname,
        email: email,
        password: pass,
        phone: phone,
        cart: {
          items: [],
        },
      });
      return user.save();
    })
    .then(() => {
      res.json({ message: "Success", statusCode: 200 });
    })
    .catch((err) => {
      console.log(err);
    });
};

// login
exports.postLogin = (req, res, next) => {
  const email = req.query.email;
  const password = req.query.password;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.json({ message: error.array()[0].msg, statusCode: 422 });
  }
  // find user with email
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.json({
          message: "Invalid email or password",
          statusCode: 422,
        });
      }
      // compare two passwords
      bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id.toString(),
            },
            "secretKey",
            { expiresIn: "3h" }
          );
          return res.json({
            token: token,
            userId: user._id.toString(),
            statusCode: 200,
          });
        }
        return res.json({
          message: "Invalid email or password",
          statusCode: 422,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// get username to show in frontend
exports.getUsername = async (req, res) => {
  const userId = req.query.userId;
  try {
    const user = await User.findById(userId);
    return res.json(user.fullname);
  } catch {
    (err) => {
      console.log(err);
    };
  }
};
