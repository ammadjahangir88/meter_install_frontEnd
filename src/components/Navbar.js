import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/IMS Logo.png';
import './navbar.css';
import { useAuth } from './utils/AuthContext';
import axiosInstance from './utils/Axios';

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true); // Track loading state

    useEffect(() => {
        axiosInstance.get('/v1/users/current')
          .then(response => {
              setCurrentUser(response.data);
              setLoadingUser(false); // Set loading to false once data is fetched
          })
          .catch(error => {
              console.error('Error fetching current user:', error);
              setLoadingUser(false); // Set loading to false on error
          });
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login'); // Navigate to login after logout
    };

    if (loadingUser) {
        return <p>Loading...</p>; // Display loading indicator while fetching user data
    }

    return (
        <nav>
            <div className="logo">
                <img src={logo} alt="Logo" className='logo-navbar' />
            </div>
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/reporting">Reporting</Link></li>
                <li><Link to="/meters">Meters</Link></li>
                {/* Only render this link if currentUser is not null and is an Admin */}
                {currentUser && currentUser.role === 'Admin' && (
                    <li><Link to="/role">Role</Link></li>
                )}
                <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
        </nav>
    );
}

export default Navbar;
