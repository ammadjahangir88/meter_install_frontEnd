import React from "react";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Meters from "./meters";
import { useAuth } from "./components/utils/AuthContext";
import Navbar from "./components/Navbar";

const App = () => {
  const { token, logout } = useAuth();
  
  console.log(token);
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {!token ? (
            <>
              <Route path="/" element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/meters" element={<Meters />} />
              <Route path="*" element={<Navigate to="/meters" />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
