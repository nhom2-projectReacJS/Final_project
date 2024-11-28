import React from "react";
import { Link } from "react-router-dom"; // Sử dụng react-router-dom nếu bạn cần điều hướng
import "./style.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/admin/manage-users">Quản lý người dùng</Link>
        </li>
        <li>
          <Link to="/admin/manage-estates">Quản lý bất động sản</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
