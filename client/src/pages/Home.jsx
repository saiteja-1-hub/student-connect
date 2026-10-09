import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="home-container">
      <nav className="navbar">
  <h2>StudentConnect</h2>

  <div className="nav-actions">
    <button
      onClick={() =>
        navigate(`/profile/${user.id}`)
      }
    >
      My Profile
    </button>

    <button onClick={handleLogout}>
      Logout
    </button>
  </div>
      </nav>

      <main className="home-content">
        <h1>
          Welcome, {user?.full_name} 👋
        </h1>

        <p>
          Connect with students, build your network,
          and chat with your connections.
        </p>

        <div className="home-cards">
          <div
            className="home-card"
            onClick={() => navigate("/students")}
          >
            <h3>Find Students</h3>
            <p>Discover and connect with other students.</p>
          </div>

          <div
            className="home-card"
            onClick={() => navigate("/connections")}
          >
            <h3>My Connections</h3>
            <p>View your student connections.</p>
          </div>

          <div
            className="home-card"
            onClick={() => navigate("/messages")}
          >
            <h3>Messages</h3>
            <p>Chat with your connections.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;