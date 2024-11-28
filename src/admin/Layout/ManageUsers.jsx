import React, { useState, useEffect } from "react";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";
import "./style.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    dob: "",
    createdAt: Date.now(),
  });

  const [isEditing, setIsEditing] = useState(false); // Kiểm tra xem có đang chỉnh sửa hay không
  const [showForm, setShowForm] = useState(false); // Điều khiển việc hiển thị form

  // Gọi API để lấy dữ liệu người dùng
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]); // Trả về mảng trống nếu không có dữ liệu hợp lệ
        }
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
        setUsers([]); // Nếu có lỗi, cũng trả về mảng trống
      });
  }, []);

  // Hàm xử lý khi thay đổi dữ liệu trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm xử lý khi nhấn "Tạo người dùng mới"
  const handleCreate = () => {
    setIsEditing(false); // Đặt lại trạng thái chỉnh sửa
    setFormData({
      username: "",
      email: "",
      dob: "",
      createdAt: Date.now(),
    });
    setShowForm(true); // Hiển thị form khi nhấn tạo mới
  };

  // Hàm xử lý khi nhấn "Chỉnh sửa"
  const handleEdit = (user) => {
    setIsEditing(true); // Chuyển sang chế độ chỉnh sửa
    setFormData({
      id: user.id,
      username: user.username || "",
      email: user.email || "",
      dob: user.dob || "",
      createdAt: user.createdAt || Date.now(),
    });
    setShowForm(true); // Hiển thị form khi nhấn chỉnh sửa
  };

  // Hàm xử lý khi nhấn "Lưu"
  const handleSave = () => {
    if (isEditing) {
      fetch(`http://localhost:5000/users/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === formData.id ? { ...user, ...formData } : user
            )
          ); // Thay thế người dùng đã chỉnh sửa với dữ liệu mới

          // Đóng form sau khi lưu
          setShowForm(false);

          // Reset formData về giá trị mặc định
          setFormData({
            id: null,
            username: "",
            email: "",
            dob: "",
            createdAt: Date.now(),
          });
        })
        .catch((error) => {
          console.error("Có lỗi xảy ra khi cập nhật người dùng:", error);
        });
    } else {
      // Logic tạo người dùng mới
      fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          // Thêm người dùng mới vào danh sách mà không cần tải lại trang
          setUsers((prevUsers) => [...prevUsers, data]);

          // Đóng form sau khi lưu
          setShowForm(false);

          // Reset formData về giá trị mặc định
          setFormData({
            id: null,
            username: "",
            email: "",
            dob: "",
            createdAt: Date.now(),
          });
        })
        .catch((error) => {
          console.error("Có lỗi xảy ra khi tạo người dùng mới:", error);
        });
    }
  };

  const handleDelete = (userId) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      fetch(`http://localhost:5000/users/${userId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Cập nhật lại danh sách người dùng sau khi xóa
            setUsers((prevUsers) =>
              prevUsers.filter((user) => user.id !== userId)
            );

            alert("Xóa người dùng thành công!");
          } else {
            throw new Error("Xóa người dùng không thành công");
          }
        })
        .catch((error) => {
          console.error("Có lỗi xảy ra khi xóa người dùng:", error);
          alert("Có lỗi xảy ra khi xóa người dùng!");
        });
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <Header onLogout={() => window.location.replace("/admin")} />
      <div className="table-container">
        <h2>Quản lý người dùng</h2>
        <div className="create-button-container">
          <button onClick={handleCreate} className="create-button">
            Tạo người dùng mới
          </button>
        </div>

        {/* Hiển thị overlay và form popup khi showForm là true */}
        {showForm && (
          <>
            <div
              className={`overlay ${showForm ? "show" : ""}`}
              onClick={() => setShowForm(false)} // Đóng form khi nhấn vào overlay
            ></div>
            <div className="form-container">
              <h3>
                {isEditing ? "Chỉnh sửa người dùng" : "Tạo người dùng mới"}
              </h3>
              <form onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Ngày sinh</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-buttons">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="save-button"
                  >
                    {isEditing ? "Lưu thay đổi" : "Tạo mới"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="cancel-button"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Email</th>
              <th>Username</th>
              <th>Ngày sinh</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.dob}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleEdit(user)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Không có người dùng nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
