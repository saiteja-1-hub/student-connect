const express = require("express");

const {
  getMyProfile,
  getUserById,
  updateMyProfile,
  getAllStudents
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Get all students

router.get(
  "/",
  authMiddleware,
  getAllStudents
);



// Get logged-in user's profile
router.get(
  "/profile",
  authMiddleware,
  getMyProfile
);


// Update logged-in user's profile
router.put(
  "/profile",
  authMiddleware,
  updateMyProfile
);


// Get any student's profile
router.get(
  "/:id",
  authMiddleware,
  getUserById
);


module.exports = router;