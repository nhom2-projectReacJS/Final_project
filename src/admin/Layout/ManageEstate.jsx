import React, { useState, useEffect } from "react";
import { storage } from "../../config/firebase.jsx"; // Giả sử bạn đã cấu hình Firebase
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";
import "./style.css";

const ManageEstate = () => {
  const [estates, setEstates] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "",
    price: "",
    type: "",
    cover: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/posts")
      .then((response) => response.json())
      .then((data) => setEstates(data || []))
      .catch(() => setEstates([]));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const newSelectedImages = Array.from(files);
    setSelectedImages(newSelectedImages);

    const storageRef = ref(storage, "images/");
    const promises = newSelectedImages.map((file) => {
      const fileRef = ref(storageRef, file.name);
      const uploadTask = uploadBytesResumable(fileRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on("state_changed", null, reject, async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        });
      });
    });

    Promise.all(promises)
      .then((urls) => {
        setFormData((prev) => ({
          ...prev,
          cover: urls,
        }));
      })
      .catch((error) => console.error("Upload failed:", error));
  };

  const handleCreate = () => {
    setIsEditing(false);
    setFormData({
      name: "",
      location: "",
      category: "",
      price: "",
      type: "",
      cover: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setShowForm(true);
  };

  const handleEdit = (estate) => {
    setIsEditing(true);
    setFormData({
      id: estate.id,
      ...estate,
      updatedAt: Date.now(),
    });
    setShowForm(true);
  };

  const handleSave = () => {
    const url = isEditing
      ? `http://localhost:5000/posts/${formData.id}`
      : "http://localhost:5000/posts";
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (isEditing) {
          setEstates((prev) =>
            prev.map((estate) =>
              estate.id === formData.id ? { ...estate, ...formData } : estate
            )
          );
        } else {
          setEstates((prev) => [...prev, data]);
        }
        setShowForm(false);
      })
      .catch((error) => console.error("Save failed:", error));
  };

  const handleDelete = (estateId) => {
    if (window.confirm("Bạn có chắc muốn xóa bất động sản này?")) {
      fetch(`http://localhost:5000/posts/${estateId}`, { method: "DELETE" })
        .then(() => {
          setEstates((prev) => prev.filter((estate) => estate.id !== estateId));
        })
        .catch(() => alert("Xóa bất động sản không thành công!"));
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <Header onLogout={() => window.location.replace("/admin")} />
      <div className="table-container">
        <h2>Quản lý bất động sản</h2>
        <div className="create-button-container">
          <button onClick={handleCreate} className="create-button">
            Tạo bất động sản
          </button>
        </div>

        {showForm && (
          <>
            <div
              className={`overlay ${showForm ? "show" : ""}`}
              onClick={() => setShowForm(false)}
            ></div>
            <div className="form-container">
              <h3>{isEditing ? "Chỉnh sửa" : "Tạo mới"}</h3>
              <form onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn mục đích</option>
                    <option value="For Rent">For Rent</option>
                    <option value="For Sale">For Sale</option>
                  </select>
                </div>
                <div>
                  <label>Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn loại</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Homes & Villas">Homes & Villas</option>
                    <option value="Offices">Offices</option>
                    <option value="Condos">Condos</option>
                  </select>
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/[^0-9]/g, ""); // Lấy chỉ số
                      const formattedValue = rawValue
                        ? "$" + new Intl.NumberFormat("en-US").format(rawValue) // Format số với dấu phẩy
                        : ""; // Nếu không có giá trị, trả về chuỗi rỗng
                      setFormData((prevData) => ({
                        ...prevData,
                        price: formattedValue, // Lưu giá trị đã format
                      }));
                    }}
                    required
                  />
                </div>
                <div>
                  <label>Upload Images</label>
                  <input type="file" multiple onChange={handleImageUpload} />
                  <div className="uploaded-images">
                    {formData.cover.map((url, idx) => (
                      <div key={idx} className="image-preview">
                        <img src={url} alt={`Uploaded ${idx}`} />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedCover = formData.cover.filter(
                              (_, i) => i !== idx
                            );
                            setFormData((prev) => ({
                              ...prev,
                              cover: updatedCover,
                            }));
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-buttons">
                  <button onClick={handleSave} className="save-button">
                    {isEditing ? "Lưu thay đổi" : "Tạo mới"}
                  </button>
                  <button
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
              <th>Tên</th>
              <th>Vị trí</th>
              <th>Mục đích</th>
              <th>Thể loại</th>
              <th>Giá tiền</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {estates.length > 0 ? (
              estates.map((estate, index) => (
                <tr key={estate.id}>
                  <td>{index + 1}</td>
                  <td>{estate.name}</td>
                  <td>{estate.location}</td>
                  <td>{estate.category}</td>
                  <td>{estate.type}</td>
                  <td>{estate.price}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(estate)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(estate.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Không có bất động sản nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageEstate;
