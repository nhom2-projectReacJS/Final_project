import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import bcrypt from "bcryptjs"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../config/firebase.jsx";
import "./profileForm.css"; 

const EditProfileForm = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(""); // Để lưu avatar URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null); // Để lưu tệp avatar mới
  const [error, setError] = useState("");
  const [dob, setDob] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
    const storedUserName = localStorage.getItem("userName");
    setUsername(storedUserName || "");

    const avatarStored = localStorage.getItem("avatar");
    setAvatar(avatarStored || ""); // Nếu có avatar thì set avatar từ localStorage

    const storedDob = localStorage.getItem("dob");
    setDob(storedDob || "");
  }, []);

  const uploadAvatar = async (file) => {
    if (!file) return null;

    const storageRef = ref(storage, `avatars/${file.name}`);
    await uploadBytes(storageRef, file); 
    return await getDownloadURL(storageRef); // Lấy URL tải xuống
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);

    // Upload avatar và cập nhật avatar URL trong state
    if (file) {
      try {
        const newAvatarUrl = await uploadAvatar(file);
        setAvatar(newAvatarUrl); // Cập nhật ảnh avatar mới ngay lập tức
      } catch (uploadError) {
        setError("Failed to upload avatar");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Password and confirm password do not match");
      return;
    }

    let avatarUrl = avatar;
    if (avatarFile) {
      try {
        avatarUrl = await uploadAvatar(avatarFile);
      } catch (uploadError) {
        setError("Failed to upload avatar");
        return;
      }
    }

    const updatedUser = {
      id: localStorage.getItem("id"),
      username,
      email,
      dob,
      avatar: avatarUrl, 
    };

    if (password) {
      updatedUser.password = bcrypt.hashSync(password, 10); 
    }

    const userId = localStorage.getItem("id");
    if (!userId) {
      setError("User ID not found.");
      return;
    }

    localStorage.setItem("userName", username);
    localStorage.setItem("avatar", avatarUrl);
    localStorage.setItem("dob", dob);

    try {
      await fetch(`http://localhost:5000/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      alert("Profile updated successfully!");
      navigate("/"); 
      onClose();
    } catch (error) {
      setError("Failed to update profile");
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <button className="btn-close" onClick={onClose}>
          &times;
        </button>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="avatar">Avatar:</label>
            <input
              type="file"
              id="avatar"
              onChange={handleAvatarChange}
              accept="image/*"
            />
            {/* Hiển thị ảnh hiện tại nếu có */}
            {avatar && <img src={avatar} alt="Current Avatar" className="current-avatar" />}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn-submit">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;
