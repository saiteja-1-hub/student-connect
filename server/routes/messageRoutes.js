const express = require("express");

const {
  sendMessage,
  getConversation,
  getMyConversations,
  markMessageAsRead,
} = require("../controllers/messageController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// SEND MESSAGE
router.post(
  "/",
  authMiddleware,
  sendMessage
);


// GET MY CONVERSATIONS
router.get(
  "/",
  authMiddleware,
  getMyConversations
);


// GET CONVERSATION
router.get(
  "/:userId",
  authMiddleware,
  getConversation
);


// MARK MESSAGE AS READ
router.put(
  "/:id/read",
  authMiddleware,
  markMessageAsRead
);


module.exports = router;