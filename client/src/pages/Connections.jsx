import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyConnections,
  getConnectionRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
} from "../services/connectionService";


const Connections = () => {
  const navigate = useNavigate();

  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] = useState(null);


  // FETCH CONNECTIONS AND REQUESTS
  const fetchConnectionData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        connectionsData,
        requestsData,
      ] = await Promise.all([
        getMyConnections(),
        getConnectionRequests(),
      ]);

      setConnections(
        connectionsData.connections || []
      );

      setRequests(
        requestsData.requests || []
      );

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchConnectionData();
  }, []);


  // ACCEPT REQUEST
  const handleAccept = async (connectionId) => {
    try {
      setActionLoading(connectionId);

      await acceptConnectionRequest(
        connectionId
      );

      await fetchConnectionData();

    } catch (error) {
      setError(error.message);
    } finally {
      setActionLoading(null);
    }
  };


  // REJECT REQUEST
  const handleReject = async (connectionId) => {
    try {
      setActionLoading(connectionId);

      await rejectConnectionRequest(
        connectionId
      );

      await fetchConnectionData();

    } catch (error) {
      setError(error.message);
    } finally {
      setActionLoading(null);
    }
  };


  return (
    <div className="connections-container">

      {/* NAVBAR */}

      <nav className="navbar">

        <h2
          className="navbar-logo"
          onClick={() => navigate("/home")}
        >
          StudentConnect
        </h2>

        <div className="nav-actions">

          <button
            onClick={() =>
              navigate("/home")
            }
          >
            Home
          </button>

          <button
            onClick={() =>
              navigate("/students")
            }
          >
            Find Students
          </button>

        </div>

      </nav>


      {/* MAIN CONTENT */}

      <main className="connections-content">

        <h1>My Connections</h1>

        <p className="connections-subtitle">
          Manage your student connections and
          connection requests.
        </p>


        {error && (
          <p className="error-message">
            {error}
          </p>
        )}


        {loading ? (
          <p className="page-message">
            Loading connections...
          </p>
        ) : (
          <>

            {/* =========================
                CONNECTION REQUESTS
            ========================= */}

            <section className="connections-section">

              <div className="section-heading">

                <h2>
                  Connection Requests
                </h2>

                <span className="request-count">
                  {requests.length}
                </span>

              </div>


              {requests.length === 0 ? (

                <div className="empty-state">

                  <p>
                    You don't have any pending
                    connection requests.
                  </p>

                </div>

              ) : (

                <div className="connections-grid">

                  {requests.map(
                    (request) => (

                      <div
                        className="connection-card"
                        key={request.id}
                      >

                        <div className="connection-avatar">

                          {request.profile_image ? (

                            <img
                              src={
                                request.profile_image
                              }
                              alt={
                                request.full_name
                              }
                            />

                          ) : (

                            <span>
                              {request.full_name
                                .charAt(0)
                                .toUpperCase()}
                            </span>

                          )}

                        </div>


                        <div className="connection-info">

                          <h3>
                            {request.full_name}
                          </h3>

                          <p>
                            {request.college}
                          </p>

                          <p>
                            {request.course}
                          </p>

                          <p>
                            Year {request.year}
                          </p>

                        </div>


                        <div className="connection-actions">

                          <button
                            className="accept-button"
                            disabled={
                              actionLoading ===
                              request.id
                            }
                            onClick={() =>
                              handleAccept(
                                request.id
                              )
                            }
                          >
                            {actionLoading ===
                            request.id
                              ? "Processing..."
                              : "Accept"}
                          </button>


                          <button
                            className="reject-button"
                            disabled={
                              actionLoading ===
                              request.id
                            }
                            onClick={() =>
                              handleReject(
                                request.id
                              )
                            }
                          >
                            Reject
                          </button>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </section>


            {/* =========================
                MY CONNECTIONS
            ========================= */}

            <section className="connections-section">

              <div className="section-heading">

                <h2>
                  Connected Students
                </h2>

                <span className="connection-count">
                  {connections.length}
                </span>

              </div>


              {connections.length === 0 ? (

                <div className="empty-state">

                  <p>
                    You don't have any connections
                    yet.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/students")
                    }
                  >
                    Find Students
                  </button>

                </div>

              ) : (

                <div className="connections-grid">

                  {connections.map(
                    (connection) => (

                      <div
                        className="connection-card"
                        key={
                          connection.connection_id
                        }
                      >

                        <div className="connection-avatar">

                          {connection.profile_image ? (

                            <img
                              src={
                                connection.profile_image
                              }
                              alt={
                                connection.full_name
                              }
                            />

                          ) : (

                            <span>
                              {connection.full_name
                                .charAt(0)
                                .toUpperCase()}
                            </span>

                          )}

                        </div>


                        <div className="connection-info">

                          <h3>
                            {connection.full_name}
                          </h3>

                          <p>
                            {connection.college}
                          </p>

                          <p>
                            {connection.course}
                          </p>

                          <p>
                            Year {connection.year}
                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </section>

          </>
        )}

      </main>

    </div>
  );
};


export default Connections;