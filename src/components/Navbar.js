import React from 'react';
import logo from '../assets/IMS Logo.png';
import './navbar.css'; // Import CSS file for styling

const Navbar = () => {
    return (
        <nav>
            <div className="logo">
                <img src={logo} className='logo' />
            
            </div>
            <ul>
                <li><a href="#">Dashboard</a></li>
                <li><a href="#">Reporting</a></li>
                <li><a href="#">Meters</a></li>
                <li><a href="#">Discos</a></li>
                <li><a href="#">Division</a></li>
                <li><a href="#">Sub Division</a></li>
                <li><a href="#">Role</a></li>
                <li><a href="#">Logout</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;
