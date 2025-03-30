exports.getLoginPage = (req, res) => {
  res.render("login");
};

exports.postLoginPage = (req, res) => {};

exports.getSignupPage = (req, res) => {
  res.render("signup");
};

exports.postSignupPage = (req, res) => {};

exports.getLogoutPage = (req, res, next) => {};

exports.getJoinPage = (req, res, next) => {};

exports.postJoinPage = (req, res, next) => {};

exports.updateUser = (req, res, next) => {};
