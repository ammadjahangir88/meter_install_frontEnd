import React from "react";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Meters from "./components/meters";
import { useAuth } from "./components/utils/AuthContext";
import Navbar from "./components/Navbar";
import Discos from './components/discos/Discos'
import Subdivision from "./components/subdivisions/Subdivision";
import Divisions from "./components/divisions/Divisions";

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
              <Route path="/discos" element={<Discos />} />
              <Route path="/divisions" element={<Divisions />} />
              <Route path="/subdivisions" element={<Subdivision />} />
              <Route path="*" element={<Navigate to="/meters" />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
