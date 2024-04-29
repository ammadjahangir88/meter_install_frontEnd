import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 
import logo from '../assets/IMS Logo.png';
import './navbar.css';
import { useAuth } from './utils/AuthContext';

const Navbar = () => {
    const { logout } = useAuth() 
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); 
       
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
                <li><Link to="/role">Role</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
        </nav>
    );
}

export default Navbar;
