import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [user] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo-link">
          <div className="navbar-logo">
            <span className="logo-icon">★</span>
            <span>Review&<strong>RATE</strong></span>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="navbar-search">
          <input
            type="text"
            placeholder="Search companies..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>

        <div className="navbar-actions">
          {user ? (
            <>
              <span className="user-greeting">Welcome, {user.name}!</span>
              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="nav-link">SignUp</Link>
              <Link to="/login" className="nav-link">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
