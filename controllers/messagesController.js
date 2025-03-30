exports.getAllMessages = (req, res) => {
  res.render("messages");
};

exports.getNewMessagePage = (req, res) => {
  res.render("new");
};

exports.postNewMessagePage = (req, res) => {};
