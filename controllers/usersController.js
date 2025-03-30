const User = require("../models/user");
const { body, validationResult } = require("express-validator");
require("dotenv").config();
//VALIDATION LOGIC----------------------------------------------------
const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const emailErr = "not a valid email format.";

const validateUser = [
  body("firstName").trim().isAlpha().withMessage(`First Name ${alphaErr}`),
  body("lastName").trim().isAlpha().withMessage(`Last name ${alphaErr}`),
  body("username")
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage(`Username ${lengthErr}`),
  body("email").trim().isEmail().withMessage(`Email is ${emailErr}`),

  body("password").isLength({ min: 5 }),
  body("confirm-password")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Password mismatch"),
];

//-------------------------------------------------------------------------------------
exports.getLoginPage = (req, res) => {
  res.render("login");
};

exports.postLoginPage = (req, res) => {};

exports.getSignupPage = (req, res) => {
  res.render("signup");
};

exports.postSignupPage = [
  validateUser,
  async (req, res) => {
    try {
      //errors check
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("signup", {
          errors: errors.array(),
        });
      }
      //----------
      const { firstName, lastName, username, email, password, adminCode } =
        req.body;
      let isAdmin = false;
      if (adminCode) {
        if (adminCode === process.env.ADMIN_KEY) {
          isAdmin = true;
        } else {
          return res.status(400).json({ message: "Wrong admin code" });
        }
      }
      const newUser = await User.create({
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password,
        isAdmin: isAdmin,
      });
      res
        .status(201)
        .json({ message: `New user created succesfully`, user: newUser });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Internal Server Error", err: err.message });
    }
  },
];

exports.getLogoutPage = (req, res, next) => {};

exports.getJoinPage = (req, res, next) => {};

exports.postJoinPage = (req, res, next) => {};

exports.updateUser = (req, res, next) => {};
