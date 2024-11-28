import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate để chuyển hướng
import bcrypt from "bcryptjs"; // Import bcryptjs
import "./style.css";

const Carasol = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // Xử lý đăng nhập
      const saltRounds = 10; // Độ phức tạp của mã hóa
      const hashedPassword = bcrypt.hashSync(formData.password, saltRounds); // Mã hóa mật khẩu

      const payload = { email: formData.email, password: hashedPassword };

      try {
        const response = await fetch("http://localhost:5000/users", {
          method: "GET", // Đổi thành GET để tìm người dùng
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        const user = data.find((user) => user.email === formData.email);

        if (user && bcrypt.compareSync(formData.password, user.password)) {
          if (user.role === "ADMIN") {
            alert("Đăng nhập thành công!");

            // Lưu email vào localStorage
            localStorage.setItem("emailAdmin", formData.email);

            // Chuyển hướng đến Dashboard
            navigate("/admin/dashboard"); // Chuyển hướng tới Dashboard
          } else {
            alert("Bạn không có quyền truy cập.");
          }
        } else {
          alert("Thông tin đăng nhập không hợp lệ.");
        }
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        alert("Đăng nhập thất bại.");
      }
    } else {
      // Xử lý đăng ký
      if (formData.password !== formData.confirmPassword) {
        alert("Mật khẩu không khớp!");
        return;
      }

      const saltRounds = 10; // Độ phức tạp của mã hóa
      const hashedPassword = bcrypt.hashSync(formData.password, saltRounds); // Mã hóa mật khẩu

      const payload = {
        email: formData.email,
        password: hashedPassword,
        role: "ADMIN", // Gán vai trò mặc định
      };

      try {
        const response = await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Đăng ký thành công:", data);
          alert("Đăng ký thành công!");

          // Chuyển lại màn hình đăng nhập sau khi đăng ký thành công
          setIsLogin(true);
        } else {
          alert("Đăng ký thất bại. Vui lòng thử lại.");
        }
      } catch (error) {
        console.error("Lỗi đăng ký:", error);
        alert("Đăng ký thất bại.");
      }
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>{isLogin ? "Đăng Nhập" : "Đăng Ký"}</h2>
        </div>
        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          <button type="submit" className="form-button">
            {isLogin ? "Đăng Nhập" : "Đăng Ký"}
          </button>
        </form>
        <div className="form-footer">
          <button
            className="toggle-button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Chưa có tài khoản? Đăng ký ngay"
              : "Đã có tài khoản? Đăng nhập"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carasol;
