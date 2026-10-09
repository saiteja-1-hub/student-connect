const pool = require("../config/db");


// CHECK IF TWO USERS ARE CONNECTED
const checkConnection = async (
  user1,
  user2
) => {
 const result = await pool.query(
  `SELECT id
   FROM connections
   WHERE
     (
       (
         sender_id = $1
         AND receiver_id = $2
       )
       OR
       (
         sender_id = $2
         AND receiver_id = $1
       )
     )
     AND status = 'accepted'`,
  [user1, user2]
);

  return result.rows.length > 0;
};


// SEND MESSAGE
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiver_id, message } = req.body || {};


    // Validate receiver
    if (!receiver_id) {
      return res.status(400).json({
        message: "Receiver ID is required",
      });
    }


    // Validate message
    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }


    // Cannot message yourself
    if (
      Number(senderId) ===
      Number(receiver_id)
    ) {
      return res.status(400).json({
        message: "You cannot message yourself",
      });
    }


    // Check receiver exists
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


    // Check accepted connection
    const connected = await checkConnection(
      senderId,
      receiver_id
    );


    if (!connected) {
      return res.status(403).json({
        message:
          "You can only message your connections",
      });
    }


    // Save message
    const result = await pool.query(
      `INSERT INTO messages
       (
         sender_id,
         receiver_id,
         message
       )
       VALUES ($1, $2, $3)
       RETURNING
         id,
         sender_id,
         receiver_id,
         message,
         is_read,
         created_at`,
      [
        senderId,
        receiver_id,
        message.trim(),
      ]
    );


    
 

 
 
res.status(201).json({
  message: "Message sent successfully",
  data: result.rows[0],
});
  } catch (error) {
    console.error(
      "Send message error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};



// GET CONVERSATION WITH A USER
const getConversation = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;
    const { userId: otherUserId } =
      req.params;


    // Cannot open conversation with yourself
    if (
      Number(userId) ===
      Number(otherUserId)
    ) {
      return res.status(400).json({
        message:
          "You cannot open a conversation with yourself",
      });
    }


    // Check accepted connection
    const connected = await checkConnection(
      userId,
      otherUserId
    );


    if (!connected) {
      return res.status(403).json({
        message:
          "You can only view conversations with your connections",
      });
    }


    // Get messages in both directions
    const result = await pool.query(
      `SELECT
        m.id,
        m.sender_id,
        m.receiver_id,
        m.message,
        m.is_read,
        m.created_at,

        u.full_name AS sender_name,
        u.profile_image AS sender_profile_image

       FROM messages m

       JOIN users u
         ON m.sender_id = u.id

       WHERE
         (
           m.sender_id = $1
           AND m.receiver_id = $2
         )
         OR
         (
           m.sender_id = $2
           AND m.receiver_id = $1
         )

       ORDER BY m.created_at ASC`,
      [userId, otherUserId]
    );


    res.status(200).json({
      messages: result.rows,
    });

  } catch (error) {
    console.error(
      "Get conversation error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};



// GET MY CONVERSATIONS
const getMyConversations = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;


    const result = await pool.query(
      `SELECT
        c.id AS connection_id,

        u.id AS user_id,
        u.full_name,
        u.email,
        u.college,
        u.course,
        u.year,
        u.bio,
        u.profile_image,

        (
          SELECT m.message
          FROM messages m
          WHERE
            (
              m.sender_id = $1
              AND m.receiver_id = u.id
            )
            OR
            (
              m.sender_id = u.id
              AND m.receiver_id = $1
            )
          ORDER BY m.created_at DESC
          LIMIT 1
        ) AS last_message,

        (
          SELECT m.created_at
          FROM messages m
          WHERE
            (
              m.sender_id = $1
              AND m.receiver_id = u.id
            )
            OR
            (
              m.sender_id = u.id
              AND m.receiver_id = $1
            )
          ORDER BY m.created_at DESC
          LIMIT 1
        ) AS last_message_time

       FROM connections c

       JOIN users u
         ON u.id =
            CASE
              WHEN c.sender_id = $1
              THEN c.receiver_id
              ELSE c.sender_id
            END

       WHERE
         (
           c.sender_id = $1
           OR c.receiver_id = $1
         )
         AND c.status = 'accepted'

       ORDER BY last_message_time DESC NULLS LAST`,
      [userId]
    );


    res.status(200).json({
      conversations: result.rows,
    });

  } catch (error) {
    console.error(
      "Get my conversations error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};



// MARK MESSAGE AS READ
const markMessageAsRead = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;


    const result = await pool.query(
      `UPDATE messages

       SET is_read = TRUE

       WHERE
         id = $1
         AND receiver_id = $2

       RETURNING
         id,
         sender_id,
         receiver_id,
         message,
         is_read,
         created_at`,
      [id, userId]
    );


    if (result.rows.length === 0) {
      return res.status(404).json({
        message:
          "Message not found",
      });
    }


    res.status(200).json({
      message:
        "Message marked as read",
      data: result.rows[0],
    });

  } catch (error) {
    console.error(
      "Mark message as read error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  sendMessage,
  getConversation,
  getMyConversations,
  markMessageAsRead,
};