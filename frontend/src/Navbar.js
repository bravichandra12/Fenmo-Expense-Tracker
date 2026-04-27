import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">💸</span>
        Fenmo
      </div>
      <div className="navbar-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => 'nav-link' + (isActive ? ' nav-link-active' : '')}
        >
          <span className="nav-icon">📋</span>
          List
        </NavLink>
        <NavLink
          to="/new"
          className={({ isActive }) => 'nav-link' + (isActive ? ' nav-link-active' : '')}
        >
          <span className="nav-icon">➕</span>
          Form
        </NavLink>
        <NavLink
          to="/summary"
          className={({ isActive }) => 'nav-link' + (isActive ? ' nav-link-active' : '')}
        >
          <span className="nav-icon">📊</span>
          Summary
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
