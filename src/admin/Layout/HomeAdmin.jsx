import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom"; // Import useNavigate và Outlet
import Carasol from "../Pages/Carosol"; // Import form login

// Giả sử bạn lưu token trong localStorage khi người dùng đăng nhập
const isLoggedIn = () => {
  return localStorage.getItem("emailAdmin") !== null; // Kiểm tra xem người dùng đã đăng nhập chưa
};

const HomeAdmin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu đã đăng nhập và ở đường dẫn "/admin", điều hướng đến "/admin/dashboard"
    if (isLoggedIn() && window.location.pathname === "/admin") {
      navigate("/admin/dashboard");
    }
  }, [navigate]); // Chạy lại khi navigate thay đổi

  // Nếu người dùng chưa đăng nhập, hiển thị form login (Carasol)
  if (!isLoggedIn()) {
    return <Carasol />;
  }

  // Nếu đã đăng nhập, render các route con trong admin
  return (
    <div>
      {/* Các route con sẽ được render tại đây */}
      <Outlet />
    </div>
  );
};

export default HomeAdmin;
