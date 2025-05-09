var express = require("express");
var router = express.Router();
const messageController = require("../controllers/messagesController");

router.get("/all", messageController.getAllMessages);
router.get("/new", messageController.getNewMessagePage);
router.post("/new", messageController.postNewMessagePage);
router.post("/:messageId/delete", messageController.deleteMessage);
module.exports = router;
