import React, { useState } from "react";
import logo from "../assets/IMS Logo.png";
import "./Login.css";
import { useAuth } from "./utils/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./utils/Axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");  // State to hold the error message
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");  // Clear error message when user modifies input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    axiosInstance.post('/v1/users/sign_in', {user: formData})
      .then((response) => {
        if (response.data.success) {
          const token = response.data.token;
          login(token);
          navigate('/meters');
        } else {
          setErrorMessage(response.data.message || "Login failed.");
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
        setErrorMessage("Invalid email or password.");  // Handle login failure
      });
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="form-container">
        <h2 className="form-title">Login</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
