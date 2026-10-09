const pool = require("../config/db");


// GET MY PROFILE
const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT
        id,
        full_name,
        email,
        college,
        course,
        year,
        bio,
        profile_image,
        created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Get my profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// GET ANY STUDENT PROFILE
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
        id,
        full_name,
        email,
        college,
        course,
        year,
        bio,
        profile_image,
        created_at
       FROM users
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Get user error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// UPDATE MY PROFILE
const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      full_name,
      college,
      course,
      year,
      bio,
      profile_image,
    } = req.body;

    if (!full_name || !college || !course || !year) {
      return res.status(400).json({
        message: "Name, college, course and year are required",
      });
    }

    const result = await pool.query(
      `UPDATE users
       SET
         full_name = $1,
         college = $2,
         course = $3,
         year = $4,
         bio = $5,
         profile_image = $6
       WHERE id = $7
       RETURNING
         id,
         full_name,
         email,
         college,
         course,
         year,
         bio,
         profile_image`,
      [
        full_name,
        college,
        course,
        year,
        bio || "",
        profile_image || "",
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// GET ALL STUDENTS EXCEPT LOGGED-IN USER
// GET ALL STUDENTS EXCEPT LOGGED-IN USER
const getAllStudents = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT
        u.id,
        u.full_name,
        u.email,
        u.college,
        u.course,
        u.year,
        u.bio,
        u.profile_image,

        CASE
          WHEN c.status = 'accepted'
            THEN 'accepted'

          WHEN c.status = 'pending'
            AND c.sender_id = $1
            THEN 'pending_sent'

          WHEN c.status = 'pending'
            AND c.receiver_id = $1
            THEN 'pending_received'

          WHEN c.status = 'rejected'
            THEN 'rejected'

          ELSE 'none'
        END AS connection_status

       FROM users u

       LEFT JOIN connections c
         ON (
           (c.sender_id = $1 AND c.receiver_id = u.id)
           OR
           (c.receiver_id = $1 AND c.sender_id = u.id)
         )

       WHERE u.id != $1

       ORDER BY u.full_name ASC`,
      [userId]
    );

    res.status(200).json({
      students: result.rows,
    });

  } catch (error) {
    console.error(
      "Get all students error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getMyProfile,
  getUserById,
  updateMyProfile,
  getAllStudents
};