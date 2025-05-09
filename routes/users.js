var express = require("express");
var router = express.Router();
const userController = require("../controllers/usersController");
const passport = require("passport");

router.get("/login", userController.getLoginPage);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/users/signup",
    successRedirect: "/",
  })
);
router.get("/signup", userController.getSignupPage);
router.post("/signup", userController.postSignupPage);
router.get("/join", userController.Auther, userController.getJoinPage);
router.post("/join", userController.postJoinPage);
router.patch("/:userId", userController.updateUser);

router.get("/logout", userController.Logout);
module.exports = router;
