
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
 

import {
  getMyConversations,
  getConversation,
  sendMessage,
  markMessageAsRead,
} from "../services/messageService";

const Messages = () => {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // GET CURRENT USER ID FROM JWT
  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return null;
      }

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      return Number(payload.id);
    } catch (error) {
      console.error("Unable to decode user token:", error);
      return null;
    }
  };

  // GET MY CONVERSATIONS
  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyConversations();

      setConversations(data.conversations || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // GET CONVERSATION WITH A USER
  const fetchConversation = async (userId) => {
    try {
      setMessagesLoading(true);
      setError("");

      const data = await getConversation(userId);
      const conversation = data.messages || [];

      setMessages(conversation);

      // Mark unread messages received by the logged-in user as read
      const currentUserId = getCurrentUserId();

      for (const message of conversation) {
        if (
          !message.is_read &&
          Number(message.receiver_id) === currentUserId
        ) {
          try {
            await markMessageAsRead(message.id);

            // Update local state so the message is marked read
            setMessages((previousMessages) =>
              previousMessages.map((item) =>
                Number(item.id) === Number(message.id)
                  ? { ...item, is_read: true }
                  : item
              )
            );
          } catch (error) {
            console.error(
              "Failed to mark message as read:",
              error
            );
          }
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setMessagesLoading(false);
    }
  };

  // SELECT CONVERSATION
  const handleSelectConversation = async (conversation) => {
    setSelectedUser(conversation);
    await fetchConversation(conversation.user_id);
  };

  
  // SEND MESSAGE
  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (!messageText.trim() || !selectedUser) {
      return;
    }

    try {
      setSending(true);
      setError("");

      await sendMessage(
        selectedUser.user_id,
        messageText.trim()
      );

      setMessageText("");

      // Refresh conversation previews in the sidebar.
      // The open chat is updated through Socket.IO.
      await fetchConversations();
    } catch (error) {
      setError(error.message);
    } finally {
      setSending(false);
    }
  };

  // LOAD CONVERSATIONS
  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="messages-page">
      {/* NAVBAR */}
      <nav className="messages-navbar">
        <div
          className="messages-logo"
          onClick={() => navigate("/home")}
        >
          StudentConnect
        </div>

        <div className="messages-nav-links">
          <button onClick={() => navigate("/home")}>
            Home
          </button>

          <button onClick={() => navigate("/students")}>
            Find Students
          </button>

          <button onClick={() => navigate("/connections")}>
            Connections
          </button>
        </div>
      </nav>

      {/* ERROR */}
      {error && (
        <div className="messages-error">
          {error}
        </div>
      )}

      {/* MAIN CHAT AREA */}
      <div className="messages-container">
        {/* CONVERSATIONS SIDEBAR */}
        <div className="conversation-sidebar">
          <div className="conversation-header">
            <h2>Messages</h2>
          </div>

          {loading ? (
            <p className="messages-empty">
              Loading conversations...
            </p>
          ) : conversations.length === 0 ? (
            <div className="messages-empty">
              <p>No conversations yet.</p>

              <button
                onClick={() => navigate("/students")}
              >
                Find Students
              </button>
            </div>
          ) : (
            <div className="conversation-list">
              {conversations.map((conversation) => (
                <div
                  key={conversation.user_id}
                  className={`conversation-item ${
                    Number(selectedUser?.user_id) ===
                    Number(conversation.user_id)
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleSelectConversation(conversation)
                  }
                >
                  <div className="conversation-avatar">
                    {conversation.full_name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="conversation-info">
                    <h3>{conversation.full_name}</h3>

                    <p>
                      {conversation.last_message ||
                        "Start a conversation"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CHAT WINDOW */}
        <div className="chat-window">
          {!selectedUser ? (
            <div className="chat-placeholder">
              <div className="chat-placeholder-icon">
                💬
              </div>

              <h2>Select a conversation</h2>

              <p>
                Choose a connection from the left to
                start messaging.
              </p>
            </div>
          ) : (
            <>
              {/* CHAT HEADER */}
              <div className="chat-header">
                <div className="chat-user-avatar">
                  {selectedUser.full_name
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h2>{selectedUser.full_name}</h2>
                  <p>{selectedUser.college}</p>
                </div>
              </div>

              {/* MESSAGES */}
              <div className="chat-messages">
                {messagesLoading ? (
                  <p className="chat-loading">
                    Loading messages...
                  </p>
                ) : messages.length === 0 ? (
                  <div className="no-messages">
                    <p>No messages yet.</p>

                    <span>
                      Send a message to start the
                      conversation.
                    </span>
                  </div>
                ) : (
                  messages.map((message) => {
                    const currentUserId =
                      getCurrentUserId();

                    const isMine =
                      Number(message.sender_id) ===
                      currentUserId;

                    return (
                      <div
                        key={message.id}
                        className={`message-row ${
                          isMine
                            ? "my-message-row"
                            : "their-message-row"
                        }`}
                      >
                        <div
                          className={`message-bubble ${
                            isMine
                              ? "my-message"
                              : "their-message"
                          }`}
                        >
                          <p>{message.message}</p>

                          <span>
                            {new Date(
                              message.created_at
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* SEND MESSAGE FORM */}
              <form
                className="message-input-area"
                onSubmit={handleSendMessage}
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(event) =>
                    setMessageText(event.target.value)
                  }
                  disabled={sending}
                />

                <button
                  type="submit"
                  disabled={
                    sending || !messageText.trim()
                  }
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;