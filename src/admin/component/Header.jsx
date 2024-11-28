import React from "react";
import "./style.css";

const Header = ({ onLogout }) => {
  return (
    <div className="header">
      <h1>Dashboard</h1>
      <button onClick={onLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Header;
