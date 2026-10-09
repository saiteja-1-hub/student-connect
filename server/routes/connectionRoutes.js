const express = require("express");

const {
  sendConnectionRequest,
  getConnectionRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getMyConnections,
} = require("../controllers/connectionController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// SEND CONNECTION REQUEST
router.post(
  "/",
  authMiddleware,
  sendConnectionRequest
);


// GET INCOMING REQUESTS
router.get(
  "/requests",
  authMiddleware,
  getConnectionRequests
);


// ACCEPT REQUEST
router.put(
  "/:id/accept",
  authMiddleware,
  acceptConnectionRequest
);


// REJECT REQUEST
router.put(
  "/:id/reject",
  authMiddleware,
  rejectConnectionRequest
);


// GET MY CONNECTIONS
router.get(
  "/my",
  authMiddleware,
  getMyConnections
);


module.exports = router;