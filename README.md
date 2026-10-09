# StudentConnect — Student Networking Platform

StudentConnect is a full-stack web application that helps students discover other students, build connections, manage their profiles, and communicate with their accepted connections through a messaging system.

The application provides secure authentication, student discovery, connection requests, profile management, and private messaging using a React frontend, Node.js and Express backend, and PostgreSQL database.

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Technology Stack](#technology-stack)
* [Application Architecture](#application-architecture)
* [Project Structure](#project-structure)
* [Prerequisites](#prerequisites)
* [Installation and Setup](#installation-and-setup)
* [Environment Variables](#environment-variables)
* [Database Setup](#database-setup)
* [API Documentation](#api-documentation)
* [Authentication and Security](#authentication-and-security)
* [Application Workflow](#application-workflow)
* [Testing](#testing)
* [Future Improvements](#future-improvements)
* [Troubleshooting](#troubleshooting)
* [Author](#author)

## Overview

StudentConnect provides a centralized platform for students to create profiles, discover other students, send and manage connection requests, and exchange messages after their connection is accepted.

The project demonstrates full-stack web development concepts, including REST API design, authentication and authorization, relational database management, asynchronous JavaScript, frontend state management, and client-server integration.

## Features

### 1. User Authentication

* Student registration with personal and academic information.
* Login using email and password.
* Password hashing using bcrypt.
* JSON Web Token (JWT) authentication.
* Protected API routes for authenticated users.
* Token-based identification of the currently logged-in user.

### 2. Student Profiles

* View your own profile.
* View other students' profiles.
* Display academic information, including college, course, and year of study.
* Store a profile biography and profile image URL.
* Update profile information.

### 3. Student Discovery

* View a list of registered students.
* Exclude the currently logged-in student from the discovery list.
* Display student details and connection status.
* Identify pending, accepted, and rejected connection states.

### 4. Connection Management

* Send connection requests to other students.
* View incoming connection requests.
* Accept connection requests.
* Reject connection requests.
* View accepted connections.
* Resend a connection request when a previous request was rejected, where supported by the backend logic.

### 5. Private Messaging

* View conversations with accepted connections.
* Open a conversation with a selected student.
* Send and retrieve messages through REST APIs.
* Store messages persistently in PostgreSQL.
* Display message timestamps.
* Mark received messages as read.
* View the most recent message in the conversation list.

**Messaging limitation:** Messages are currently handled through REST APIs. Real-time delivery through WebSockets or Socket.IO is not included in the current version.

## Technology Stack

| Layer              | Technologies                       |
| ------------------ | ---------------------------------- |
| Frontend           | React, Vite, JavaScript, HTML, CSS |
| Routing            | React Router                       |
| HTTP communication | Fetch API                          |
| Backend            | Node.js, Express.js                |
| Database           | PostgreSQL                         |
| Authentication     | JSON Web Tokens (JWT)              |
| Password security  | bcrypt                             |
| API architecture   | REST                               |
| Development tools  | npm, Git, GitHub, VS Code          |

## Application Architecture

The application follows a client-server architecture.

```text
                 StudentConnect
                       |
          +------------+------------+
          |                         |
     React Frontend            Express Backend
     (Vite Development)        (Node.js)
          |                         |
          |       REST APIs         |
          +------------------------>|
                                    |
                         Authentication Middleware
                                    |
                           Controllers and Routes
                                    |
                              PostgreSQL
                                    |
                         Users, Connections,
                              and Messages
```

### Request Flow

1. The student interacts with the React frontend.
2. The frontend sends HTTP requests to the Express backend.
3. The backend validates the request and checks authentication when required.
4. Controllers execute business logic and database queries.
5. PostgreSQL stores or retrieves the requested data.
6. The backend returns a JSON response to the frontend.
7. React updates the user interface based on the response.

## Project Structure

```text
student-connect/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Students.jsx
│   │   │   ├── Connections.jsx
│   │   │   └── Messages.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── userService.js
│   │   │   ├── studentService.js
│   │   │   ├── connectionService.js
│   │   │   └── messageService.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── connectionController.js
│   │   └── messageController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── connectionRoutes.js
│   │   └── messageRoutes.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── config/
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

*Note: The structure above documents the main files. Adjust it if your local repository contains additional or differently named files.*

## Prerequisites

Install the following before running the application:

* **Node.js:** A current supported LTS release.
* **npm:** Installed with Node.js.
* **PostgreSQL:** A running database server.
* **Git:** For version control.
* **Visual Studio Code:** Recommended for development.

Verify the installations:

```bash
node --version
npm --version
git --version
```

## Installation and Setup

### Step 1: Clone the repository

Replace the placeholder with your actual GitHub repository URL.

```bash
git clone https://github.com/YOUR_USERNAME/student-connect.git
cd student-connect
```

### Step 2: Install backend dependencies

```bash
cd server
npm install
```

### Step 3: Configure environment variables

Create a `.env` file inside the `server/` directory.

```env
PORT=5000

DB_USER=postgres
DB_HOST=localhost
DB_NAME=student_connect
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_PORT=5432

JWT_SECRET=REPLACE_WITH_A_LONG_RANDOM_SECRET
```

Replace the database credentials and JWT secret with your own values. Never commit the real `.env` file to GitHub.

### Step 4: Create the PostgreSQL database

Open the PostgreSQL query tool or `psql` and execute:

```sql
CREATE DATABASE student_connect;
```

Connect to the `student_connect` database before creating the application tables.

### Step 5: Create the database tables

Create the users table:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    college VARCHAR(150) NOT NULL,
    course VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    bio TEXT DEFAULT '',
    profile_image TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Create the connections table:

```sql
CREATE TABLE connections (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (sender_id <> receiver_id),
    UNIQUE (sender_id, receiver_id)
);
```

**Important:** The connections table definition above is a reference example. Use the exact schema already used by your project. If your existing database has different constraints or permits retrying rejected requests by updating an existing row, preserve that schema rather than recreating the table.

Create the messages table:

```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (sender_id <> receiver_id)
);
```

If these tables already exist, do not execute the `CREATE TABLE` statements again. Use your existing database.

### Step 6: Start the backend

From the `server/` directory:

```bash
npm run dev
```

The terminal should display:

```text
Server running on port 5000
```

Test the API by opening:

http://localhost:5000/

Expected response:

```json
{
  "message": "StudentConnect API is running"
}
```

You can also test database connectivity at:

http://localhost:5000/api/db-test

### Step 7: Install frontend dependencies

Open a second terminal at the project root:

```bash
cd client
npm install
```

### Step 8: Start the frontend

```bash
npm run dev
```

Open the local URL printed by Vite, typically:

http://localhost:5173/

Register two student accounts to test connections and messaging between different users.

## Environment Variables

| Variable      | Purpose                             | Example              |
| ------------- | ----------------------------------- | -------------------- |
| `PORT`        | Backend port                        | `5000`               |
| `DB_USER`     | PostgreSQL username                 | `postgres`           |
| `DB_HOST`     | Database host                       | `localhost`          |
| `DB_NAME`     | Database name                       | `student_connect`    |
| `DB_PASSWORD` | PostgreSQL password                 | Your local password  |
| `DB_PORT`     | PostgreSQL port                     | `5432`               |
| `JWT_SECRET`  | Secret used to sign and verify JWTs | A long random secret |

Do not put database credentials or JWT secrets in frontend environment variables. Frontend variables may be exposed to users in the built application.

## API Documentation

The backend exposes REST endpoints under `/api`.

### Authentication APIs

Base path: `/api/auth`

| Method | Endpoint             | Purpose                |
| ------ | -------------------- | ---------------------- |
| POST   | `/api/auth/register` | Register a new student |
| POST   | `/api/auth/login`    | Authenticate a student |

Example registration request:

```json
{
  "full_name": "Sample Student",
  "email": "student@example.com",
  "password": "ExamplePassword123!",
  "college": "Example College",
  "course": "Computer Science",
  "year": 3
}
```

Use the exact field names expected by your registration controller.

### User APIs

Base path: `/api/users`

| Method | Endpoint              | Purpose                                 |
| ------ | --------------------- | --------------------------------------- |
| GET    | `/api/users/profile`  | Get the authenticated user's profile    |
| PUT    | `/api/users/profile`  | Update the authenticated user's profile |
| GET    | `/api/users/students` | Get the student discovery list          |
| GET    | `/api/users/:id`      | Get a student's profile by ID           |

These endpoints require authentication where configured in the route definitions.

### Connection APIs

Base path: `/api/connections`

| Method | Endpoint                      | Purpose                          |
| ------ | ----------------------------- | -------------------------------- |
| POST   | `/api/connections`            | Send a connection request        |
| GET    | `/api/connections/requests`   | Get incoming connection requests |
| PUT    | `/api/connections/:id/accept` | Accept a connection request      |
| PUT    | `/api/connections/:id/reject` | Reject a connection request      |
| GET    | `/api/connections/my`         | Get accepted connections         |

Connection endpoints require a valid JWT according to the route configuration.

### Messaging APIs

Base path: `/api/messages`

| Method | Endpoint                 | Purpose                               |
| ------ | ------------------------ | ------------------------------------- |
| POST   | `/api/messages`          | Send a message                        |
| GET    | `/api/messages`          | Get conversation summaries            |
| GET    | `/api/messages/:userId`  | Get messages exchanged with a student |
| PUT    | `/api/messages/:id/read` | Mark a received message as read       |

Example send-message request:

```json
{
  "receiver_id": 2,
  "message": "Hello! Nice to connect with you."
}
```

The sender is identified using the authenticated JWT rather than accepting the sender's ID from the request body.

Messages can only be sent between users whose connection has been accepted.

### Authentication Header

For protected endpoints, include:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

For JSON requests, also include:

```http
Content-Type: application/json
```

*Note: The endpoint list reflects the intended project routes. Verify it against the current route files before treating this section as a formal API contract.*

## Authentication and Security

The application uses several security mechanisms:

* **Password hashing:** bcrypt is used to hash passwords before storing them.
* **JWT authentication:** Tokens identify authenticated users.
* **Protected routes:** Middleware validates tokens before allowing access to protected resources.
* **Authorization checks:** Messaging requires an accepted connection.
* **Input validation:** Required fields are checked before database operations.
* **SQL parameterization:** PostgreSQL queries use parameters to help prevent SQL injection.
* **CORS:** The backend configures cross-origin requests for the frontend.

For production deployment, configure HTTPS, use a strong secret stored in environment variables, validate inputs consistently, and consider secure token storage and rate limiting.

## Application Workflow

### Registration and Login

1. A student submits registration details.
2. The backend validates the fields and checks for an existing email.
3. The password is hashed and stored in PostgreSQL.
4. The student logs in with their credentials.
5. The backend verifies the password and issues a JWT.
6. The frontend uses the token for protected API requests.

### Connecting with Other Students

1. The student opens the Students page.
2. The application loads other registered students.
3. The student sends a connection request.
4. The recipient reviews incoming requests.
5. The recipient accepts or rejects the request.
6. Accepted connections become eligible for private messaging.

### Messaging

1. The student opens Messages.
2. The frontend loads accepted connections and conversation summaries.
3. The student selects a conversation.
4. The application fetches the conversation history.
5. The sender submits a message through the REST API.
6. The backend validates the connection and stores the message.
7. The recipient can retrieve the new message by loading or refreshing the conversation.
8. Received messages can be marked as read.

## Testing

Recommended manual test cases:

| Test                                        | Expected result                      |
| ------------------------------------------- | ------------------------------------ |
| Register with valid details                 | Account created                      |
| Register with an existing email             | Registration rejected                |
| Log in with valid credentials               | Login succeeds and token is returned |
| Log in with an incorrect password           | Authentication rejected              |
| Access a protected endpoint without a token | Request rejected                     |
| View the Students page                      | Other students are listed            |
| Send a connection request                   | Request is created                   |
| Accept a request                            | Connection becomes accepted          |
| Send a message to an accepted connection    | Message is saved                     |
| Send a message to a non-connection          | Request is rejected                  |
| Retrieve a conversation                     | Conversation history is returned     |
| Mark a received message as read             | Read status is updated               |

You can use the browser, Postman, or another API client to test these endpoints.

## Future Improvements

Potential enhancements include:

* Real-time messaging with Socket.IO or WebSockets.
* Online/offline presence and typing indicators.
* Message delivery and read receipts.
* Unread message counts and notifications.
* Student search by name, college, or course.
* Profile image uploads.
* Pagination for students and message history.
* Automated backend and frontend tests.
* Production deployment with managed PostgreSQL.
* Improved responsive design and accessibility.

These are potential future enhancements, not claims that they are already implemented.

## Troubleshooting

### Backend does not start

* Confirm Node.js and npm are installed.
* Run `npm install` inside `server/`.
* Check that port `5000` is available.
* Review the terminal for the exact error.

### Database connection fails

* Confirm PostgreSQL is running.
* Verify `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `DB_PORT`.
* Ensure the `student_connect` database exists.
* Test the database using `/api/db-test`.

### Login fails

* Confirm that the registered email exists.
* Ensure registration stores a bcrypt password hash.
* Verify the JWT secret is configured.
* Check the response in the browser's Network tab.

### Messages are not displayed

* Confirm the two users have an accepted connection.
* Verify the token is sent with the request.
* Check the `/api/messages` response.
* Inspect the backend terminal for PostgreSQL errors.
* Refresh the conversation to retrieve messages saved through the REST API.

### Frontend cannot reach the backend

* Ensure the backend is running on port `5000`.
* Check the API base URLs in `client/src/services/`.
* Verify the browser's Network tab for CORS, connection, or HTTP errors.

## Author

**Saiteja Elukapally**

Computer Science Engineering student interested in full-stack web development, backend APIs, databases, and building practical software applications.

### Project

**StudentConnect — Student Networking Platform**

Built with React, Node.js, Express.js, PostgreSQL, JWT, and bcrypt.

---

If you find this project useful, feel free to explore the code, test the features, and suggest improvements.
