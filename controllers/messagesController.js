const Message = require("../models/message");
const User = require("../models/user");
exports.getAllMessages = async (req, res) => {
  const messages = await Message.findAll({
    include: [
      {
        model: User, // Join with the User model
        attributes: ["username"], // Fetch only the username field
      },
    ],
  });
  res.render("messages", { messages: messages, user: req.user });
};

exports.getNewMessagePage = (req, res) => {
  res.render("new");
};

exports.postNewMessagePage = async (req, res) => {
  try {
    const { title, message } = req.body;
    console.log(req.user.id);
    const newMessage = await Message.create({
      title: title,
      text: message,
      userId: req.user.id,
    });
    res.status(201).json({ message: `New message: ${newMessage.title}` });
  } catch (err) {
    res.status(400).json({ message: "Bad request", error: err.message });
  }
};

exports.Auther = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res
      .status(401)
      .json({ message: "You are not authorized to view this page" });
  }
};

exports.Adminer = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res
      .status(401)
      .json({ message: "You are not authorized to view this page" });
  }
};
