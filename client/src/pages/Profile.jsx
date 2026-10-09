import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getUserById,
  updateMyProfile,
} from "../services/userService";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(
    localStorage.getItem("user")
  );

  const isMyProfile =
    loggedInUser && String(loggedInUser.id) === String(id);

  const [user, setUser] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    college: "",
    course: "",
    year: "",
    bio: "",
    profile_image: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const data = await getUserById(id);

        setUser(data.user);

        setFormData({
          full_name: data.user.full_name || "",
          college: data.user.college || "",
          course: data.user.course || "",
          year: data.user.year || "",
          bio: data.user.bio || "",
          profile_image: data.user.profile_image || "",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setMessage("");

      const data = await updateMyProfile({
        ...formData,
        year: Number(formData.year),
      });

      setUser(data.user);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setIsEditing(false);
      setMessage("Profile updated successfully");
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <p className="page-message">Loading profile...</p>;
  }

  if (error && !user) {
    return <p className="page-message error-message">{error}</p>;
  }

  return (
    <div className="profile-page">
      <nav className="navbar">
        <h2
          onClick={() => navigate("/home")}
          className="logo"
        >
          StudentConnect
        </h2>

        <button onClick={() => navigate("/home")}>
          Home
        </button>
      </nav>

      <main className="profile-container">
        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {!isEditing ? (
          <div className="profile-card">

            <div className="profile-image-container">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={user.full_name}
                  className="profile-image"
                />
              ) : (
                <div className="profile-placeholder">
                  {user.full_name
                    ?.charAt(0)
                    .toUpperCase()}
                </div>
              )}
            </div>

            <h1>{user.full_name}</h1>

            <p className="profile-email">
              {user.email}
            </p>

            <div className="profile-info">
              <p>
                <strong>College:</strong>{" "}
                {user.college}
              </p>

              <p>
                <strong>Course:</strong>{" "}
                {user.course}
              </p>

              <p>
                <strong>Year:</strong>{" "}
                {user.year}
              </p>

              <p>
                <strong>Bio:</strong>{" "}
                {user.bio || "No bio added yet."}
              </p>
            </div>

            {isMyProfile && (
              <button
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        ) : (
          <div className="profile-card">
            <h1>Edit Profile</h1>

            <form
              className="profile-form"
              onSubmit={handleUpdate}
            >
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="college"
                placeholder="College"
                value={formData.college}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="course"
                placeholder="Course / Branch"
                value={formData.course}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="year"
                placeholder="Year"
                min="1"
                max="6"
                value={formData.year}
                onChange={handleChange}
                required
              />

              <textarea
                name="bio"
                placeholder="Tell something about yourself"
                value={formData.bio}
                onChange={handleChange}
                rows="5"
              />

              <input
                type="text"
                name="profile_image"
                placeholder="Profile image URL"
                value={formData.profile_image}
                onChange={handleChange}
              />

              <div className="profile-actions">
                <button type="submit">
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;