import React, { useEffect } from "react";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Meters from "./components/meters";
import { useAuth } from "./components/utils/AuthContext";
import Navbar from "./components/Navbar";
import Discos from "./components/discos/Discos";
import Subdivision from "./components/subdivisions/Subdivision";
import Divisions from "./components/divisions/Divisions";
import Dashboard from "./components/dashboard/Dashboard";
import MeterDetails from "./components/dashboard/MeterDetails";
import { useNavigate } from "react-router-dom";
import UsersTable from "./components/users/User";
import EditUser from "./components/users/EditUser";
import Reports from "./reports/Reports";
import EditMeter from "./components/meters/EditMeter";
import SubMeterDetails from "./components/dashboard/SubMeterDetails";
const App = () => {
  const { token, logout } = useAuth();
  //  logout()  //
  useEffect(() => {
    const handleLogout = () => logout();

    // Listen to the unauthorized event
    window.addEventListener('unauthorized', handleLogout);

    // Cleanup the listener
    return () => {
      window.removeEventListener('unauthorized', handleLogout);
    };
  }, [logout]);
  console.log(token);



 
  return (
    <>
      <BrowserRouter>
      {token && <Navbar />}
       
        <Routes>
          {!token ? (
            <>
              <Route path="/" element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Dashboard />} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/meters" element={<Meters />} />
              <Route path="/meters/:divisionId" element={<MeterDetails />} />
              <Route path="/sub/meters/:subdivisionId" element={<SubMeterDetails />} />
              <Route path="/discos" element={<Discos />} />
              <Route path="/divisions" element={<Divisions />} />
              <Route path="/subdivisions" element={<Subdivision />} />
              <Route path="/role" element={<UsersTable />} />
              <Route path="/users/edit/:id" element={<EditUser />} />
              <Route path="/reporting" element={<Reports />} />
              <Route path="/meters/edit/:id" element={<EditMeter />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
