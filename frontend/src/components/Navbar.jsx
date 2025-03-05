import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="navbar-title">Guide For Life</div>
      <ul className="navbar-menu">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">
            <i className="fas fa-home"></i> Dashboard
          </Link>
        </li>
        <li className={location.pathname === '/habits' ? 'active' : ''}>
          <Link to="/habits">
            <i className="fas fa-tasks"></i> Habit Tracker
          </Link>
        </li>
        <li className={location.pathname === '/body-metrics' ? 'active' : ''}>
          <Link to="/body-metrics">
            <i className="fas fa-chart-line"></i> Body Metrics
          </Link>
        </li>
        <li className={location.pathname === '/journal' ? 'active' : ''}>
          <Link to="/journal">
            <i className="fas fa-book"></i> Journal
          </Link>
        </li>
        <li className={location.pathname === '/goals' ? 'active' : ''}>
          <Link to="/goals">
            <i className="fas fa-bullseye"></i> Goals
          </Link>
        </li>
      </ul>
      <div className="navbar-footer">
        <div className="daily-quote">
          "Small daily improvements add up to massive results over time."
        </div>
      </div>
    </nav>
  );
};

export default Navbar;