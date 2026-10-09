const API_URL = "http://localhost:5000/api";


// SEND MESSAGE
export const sendMessage = async (
  receiverId,
  message
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/messages`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        receiver_id: receiverId,
        message: message,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to send message"
    );
  }

  return data;
};


// GET MY CONVERSATIONS
export const getMyConversations = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/messages`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to get conversations"
    );
  }

  return data;
};


// GET CONVERSATION WITH A USER
export const getConversation = async (
  userId
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/messages/${userId}`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to get conversation"
    );
  }

  return data;
};


// MARK MESSAGE AS READ
export const markMessageAsRead = async (
  messageId
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/messages/${messageId}/read`,
    {
      method: "PUT",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to mark message as read"
    );
  }

  return data;
};