import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import logo from '../assets/IMS Logo.png';
import './navbar.css'; // Import CSS file for styling

const Navbar = () => {
    return (
        <nav>
            <div className="logo">
                <img src={logo} className='logo' alt="Logo" />
            </div>
            <ul>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/reporting">Reporting</Link></li>
                <li><Link to="/meters">Meters</Link></li>
                <li><Link to="/discos">Discos</Link></li>
                <li><Link to="/divisions">Division</Link></li>
                <li><Link to="/subdivisions">Sub Division</Link></li>
                <li><Link to="/role">Role</Link></li>
                <li><Link to="/logout">Logout</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
