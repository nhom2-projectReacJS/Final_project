import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./style.css";

const Dashboard = () => {
  const handleLogout = () => {
    // Xóa email khỏi localStorage
    localStorage.removeItem("emailAdmin");

    // Hiển thị thông báo đăng xuất thành công
    alert("Đăng xuất thành công!");

    // Chuyển hướng về trang /admin và xóa trang hiện tại khỏi lịch sử
    window.location.replace("/admin");
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <Header onLogout={handleLogout} />
    </div>
  );
};

export default Dashboard;
