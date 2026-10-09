import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllStudents } from "../services/studentService";

import {
  sendConnectionRequest,
} from "../services/connectionService";


const Students = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [connectingId, setConnectingId] =
    useState(null);


  // FETCH STUDENTS
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllStudents();

      setStudents(data.students || []);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchStudents();
  }, []);


  // GET UNIQUE COLLEGES
  const colleges = [
    ...new Set(
      students.map(
        (student) => student.college
      )
    ),
  ];


  // GET UNIQUE COURSES
  const courses = [
    ...new Set(
      students.map(
        (student) => student.course
      )
    ),
  ];


  // FILTER STUDENTS
  const filteredStudents = students.filter(
    (student) => {

      const matchesSearch =
        student.full_name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );


      const matchesCollege =
        collegeFilter === "" ||
        student.college === collegeFilter;


      const matchesCourse =
        courseFilter === "" ||
        student.course === courseFilter;


      return (
        matchesSearch &&
        matchesCollege &&
        matchesCourse
      );
    }
  );


  // SEND CONNECTION REQUEST
  const handleConnect = async (
    studentId
  ) => {
    try {
      setConnectingId(studentId);
      setError("");

      await sendConnectionRequest(
        studentId
      );

      // Refresh students so
      // button changes to Request Sent
      await fetchStudents();

    } catch (error) {
      setError(error.message);
    } finally {
      setConnectingId(null);
    }
  };


  // CONNECTION BUTTON
  const renderConnectionButton = (
    student
  ) => {

    const status =
      student.connection_status;


    if (status === "accepted") {
      return (
        <button
          className="connection-status-button connected"
          disabled
        >
          Connected
        </button>
      );
    }


    if (status === "pending_sent") {
      return (
        <button
          className="connection-status-button request-sent"
          disabled
        >
          Request Sent
        </button>
      );
    }


    if (status === "pending_received") {
      return (
        <button
          className="connection-status-button request-received"
          disabled
        >
          Request Received
        </button>
      );
    }


    return (
      <button
        className="connect-button"
        disabled={
          connectingId === student.id
        }
        onClick={() =>
          handleConnect(student.id)
        }
      >
        {connectingId === student.id
          ? "Sending..."
          : "Connect"}
      </button>
    );
  };


  return (
    <div className="students-container">

      {/* NAVBAR */}

      <nav className="navbar">

        <h2
          onClick={() =>
            navigate("/home")
          }
          className="navbar-logo"
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
              navigate("/connections")
            }
          >
            Connections
          </button>

        </div>

      </nav>


      {/* MAIN */}

      <main className="students-content">

        <h1>
          Find Students
        </h1>


        <p className="students-subtitle">
          Discover students and connect with
          people from different colleges and
          courses.
        </p>


        {/* ERROR */}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}


        {/* FILTERS */}

        <div className="student-filters">

          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


          <select
            value={collegeFilter}
            onChange={(e) =>
              setCollegeFilter(
                e.target.value
              )
            }
          >

            <option value="">
              All Colleges
            </option>


            {colleges.map(
              (college) => (
                <option
                  key={college}
                  value={college}
                >
                  {college}
                </option>
              )
            )}

          </select>


          <select
            value={courseFilter}
            onChange={(e) =>
              setCourseFilter(
                e.target.value
              )
            }
          >

            <option value="">
              All Courses
            </option>


            {courses.map(
              (course) => (
                <option
                  key={course}
                  value={course}
                >
                  {course}
                </option>
              )
            )}

          </select>

        </div>


        {/* LOADING */}

        {loading && (
          <p className="page-message">
            Loading students...
          </p>
        )}


        {/* NO STUDENTS */}

        {!loading &&
          !error &&
          filteredStudents.length === 0 && (
            <p className="page-message">
              No students found.
            </p>
          )}


        {/* STUDENTS */}

        {!loading &&
          !error &&
          filteredStudents.length > 0 && (

            <div className="students-grid">

              {filteredStudents.map(
                (student) => (

                  <div
                    className="student-card"
                    key={student.id}
                  >

                    {/* AVATAR */}

                    <div className="student-avatar">

                      {student.profile_image ? (

                        <img
                          src={
                            student.profile_image
                          }
                          alt={
                            student.full_name
                          }
                        />

                      ) : (

                        <span>
                          {student.full_name
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                      )}

                    </div>


                    {/* NAME */}

                    <h3>
                      {student.full_name}
                    </h3>


                    {/* COLLEGE */}

                    <p>
                      {student.college}
                    </p>


                    {/* COURSE */}

                    <p>
                      {student.course}
                    </p>


                    {/* YEAR */}

                    <p>
                      Year {student.year}
                    </p>


                    {/* BIO */}

                    {student.bio && (
                      <p className="student-bio">
                        {student.bio}
                      </p>
                    )}


                    {/* CONNECTION */}

                    {renderConnectionButton(
                      student
                    )}

                  </div>

                )
              )}

            </div>

          )}

      </main>

    </div>
  );
};


export default Students;