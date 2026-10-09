const pool = require("../config/db");


// SEND CONNECTION REQUEST
const sendConnectionRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiver_id } = req.body;

    if (!receiver_id) {
      return res.status(400).json({
        message: "Receiver ID is required",
      });
    }

    if (Number(senderId) === Number(receiver_id)) {
      return res.status(400).json({
        message: "You cannot send a connection request to yourself",
      });
    }


    // Check if receiver exists
    const userResult = await pool.query(
      `SELECT id
       FROM users
       WHERE id = $1`,
      [receiver_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }


    // Check if connection already exists
// Check if connection already exists
const existingConnection = await pool.query(
  `SELECT *
   FROM connections
   WHERE
     (sender_id = $1 AND receiver_id = $2)
     OR
     (sender_id = $2 AND receiver_id = $1)`,
  [senderId, receiver_id]
);


if (existingConnection.rows.length > 0) {
  const connection =
    existingConnection.rows[0];


  // Already connected
  if (connection.status === "accepted") {
    return res.status(400).json({
      message: "You are already connected",
    });
  }


  // Pending request already exists
  if (connection.status === "pending") {
    return res.status(400).json({
      message: "Connection request already exists",
    });
  }


  // Previous request was rejected
  if (connection.status === "rejected") {
    const updatedResult = await pool.query(
      `UPDATE connections
       SET
         sender_id = $1,
         receiver_id = $2,
         status = 'pending',
         created_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [
        senderId,
        receiver_id,
        connection.id,
      ]
    );


    return res.status(201).json({
      message: "Connection request sent successfully",
      connection: updatedResult.rows[0],
    });
  }
}

    // Create connection request
    const result = await pool.query(
      `INSERT INTO connections
       (sender_id, receiver_id, status)
       VALUES ($1, $2, 'pending')
       RETURNING *`,
      [senderId, receiver_id]
    );


    res.status(201).json({
      message: "Connection request sent successfully",
      connection: result.rows[0],
    });

  } catch (error) {
    console.error(
      "Send connection request error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};



// GET INCOMING CONNECTION REQUESTS
const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT
        c.id,
        c.sender_id,
        c.receiver_id,
        c.status,
        c.created_at,

        u.full_name,
        u.email,
        u.college,
        u.course,
        u.year,
        u.bio,
        u.profile_image

       FROM connections c

       JOIN users u
         ON c.sender_id = u.id

       WHERE
         c.receiver_id = $1
         AND c.status = 'pending'

       ORDER BY c.created_at DESC`,
      [userId]
    );


    res.status(200).json({
      requests: result.rows,
    });

  } catch (error) {
    console.error(
      "Get connection requests error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};



// ACCEPT CONNECTION REQUEST
const acceptConnectionRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;


    const result = await pool.query(
      `UPDATE connections

       SET status = 'accepted'

       WHERE
         id = $1
         AND receiver_id = $2
         AND status = 'pending'

       RETURNING *`,
      [id, userId]
    );


    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }


    res.status(200).json({
      message: "Connection request accepted",
      connection: result.rows[0],
    });

  } catch (error) {
    console.error(
      "Accept connection request error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};



// REJECT CONNECTION REQUEST

const rejectConnectionRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;


    const result = await pool.query(
      `UPDATE connections

       SET status = 'rejected'

       WHERE
         id = $1
         AND receiver_id = $2
         AND status = 'pending'

       RETURNING *`,
      [id, userId]
    );


    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }


    res.status(200).json({
      message: "Connection request rejected",
      connection: result.rows[0],
    });

  } catch (error) {
    console.error(
      "Reject connection request error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};



// GET MY ACCEPTED CONNECTIONS
const getMyConnections = async (req, res) => {
  try {
    const userId = req.user.id;


    const result = await pool.query(
      `SELECT
        c.id AS connection_id,
        c.sender_id,
        c.receiver_id,
        c.status,
        c.created_at,

        u.id,
        u.full_name,
        u.email,
        u.college,
        u.course,
        u.year,
        u.bio,
        u.profile_image

       FROM connections c

       JOIN users u
         ON u.id =
            CASE
              WHEN c.sender_id = $1
              THEN c.receiver_id
              ELSE c.sender_id
            END

       WHERE
         (c.sender_id = $1 OR c.receiver_id = $1)
         AND c.status = 'accepted'

       ORDER BY c.created_at DESC`,
      [userId]
    );


    res.status(200).json({
      connections: result.rows,
    });

  } catch (error) {
    console.error(
      "Get my connections error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  sendConnectionRequest,
  getConnectionRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getMyConnections,
};