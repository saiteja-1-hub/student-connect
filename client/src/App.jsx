import { Navigate, Route, Routes } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Students from "./pages/Students";
import Connections from "./pages/Connections";
import Messages from "./pages/Messages";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/home"
        element={
          token ? (
            <Home />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/profile/:id"
        element={
          token ? (
            <Profile />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
       path="/students"
       element={
       token ? (
         <Students />
          ) : (
         <Navigate to="/login" replace />
        )
      }
      />

      <Route
     path="/connections"
     element={
      token ? (
        <Connections />
       ) : (
          <Navigate to="/login" replace />
       )
     }
    />

    <Route
     path="/messages"
    element={
       token ? (
         <Messages />
        ) : (
         <Navigate to="/login" />
        )
       }
     />


    </Routes>
  );
};

export default App;