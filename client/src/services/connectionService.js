const API_URL = "http://localhost:5000/api";


// SEND CONNECTION REQUEST
export const sendConnectionRequest = async (
  receiverId
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/connections`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        receiver_id: receiverId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to send connection request"
    );
  }

  return data;
};


// GET INCOMING CONNECTION REQUESTS
export const getConnectionRequests = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/connections/requests`,
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
        "Failed to get connection requests"
    );
  }

  return data;
};


// ACCEPT CONNECTION REQUEST
export const acceptConnectionRequest = async (
  connectionId
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/connections/${connectionId}/accept`,
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
        "Failed to accept connection request"
    );
  }

  return data;
};


// REJECT CONNECTION REQUEST
export const rejectConnectionRequest = async (
  connectionId
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/connections/${connectionId}/reject`,
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
        "Failed to reject connection request"
    );
  }

  return data;
};


// GET MY ACCEPTED CONNECTIONS
export const getMyConnections = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/connections/my`,
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
        "Failed to get connections"
    );
  }

  return data;
};