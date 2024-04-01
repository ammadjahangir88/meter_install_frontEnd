import React, { useState } from "react";
import logo from "../assets/IMS Logo.png";
import axios from "axios"; // Import Axios library
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
  const { login } = useAuth();
  // Update form data when input fields change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    axiosInstance.post('/v1/users/sign_in', {user:formData})
    .then((response) => {
      console.log(response.status, response.data.token);
      console.log(response.data);
      if (response.data.success) {
        const token = response.data.token;
        // Save the token to the context
        login(token);
        navigate('/meters');
      }
      // setErrorMessage(response.data.message)
      // setError(true)
    })
    .catch((error) => {
      console.error("Login failed:", error);
      // Handle login failure, e.g., display error message to the user
    });
   
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="form-container">
        <h2 className="form-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
