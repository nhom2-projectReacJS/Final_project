import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../../../config/firebase.jsx";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./createEstate.css";

const CreateEstate = () => {
  const [estateName, setEstateName] = useState("");
  const [estateLocation, setEstateLocation] = useState("");
  const [estatePrice, setEstatePrice] = useState("");
  const [estateDescription, setEstateDescription] = useState("");
  const [coverImages, setCoverImages] = useState([]); // Array of URLs
  const [category, setCategory] = useState("For Rent");
  const [type, setType] = useState("Apartment");
  const [uploading, setUploading] = useState(false); // To track upload status
  const [previewImages, setPreviewImages] = useState([]); // Array for image previews

  const navigate = useNavigate();

  const handleFileUpload = async (files) => {
    setUploading(true); // Start uploading
    const uploadedImages = [];
    const previews = [];

    for (const file of files) {
      // Create a local URL for the image to display preview
      previews.push(URL.createObjectURL(file));

      const imageRef = ref(storage, `estates/${file.name}`); // Create Firebase storage reference
      await uploadBytes(imageRef, file); // Upload file
      const downloadURL = await getDownloadURL(imageRef); // Get URL of uploaded file
      uploadedImages.push(downloadURL); // Add URL to the array
    }

    setCoverImages(uploadedImages); // Update state with URLs
    setPreviewImages(previews); // Update preview state
    setUploading(false); // Stop uploading
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploading) {
      alert("Please wait until all files are uploaded.");
      return;
    }

    const newEstate = {
      name: estateName,
      location: estateLocation,
      price: estatePrice,
      description: estateDescription,
      category: category,
      type: type,
      cover: coverImages, // Save array of image URLs
      createdAt: Date.now(),
    };

    try {
      const response = await fetch("http://localhost:5000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEstate),
      });

      if (response.ok) {
        alert("Estate created successfully!");
        navigate("/");
      } else {
        alert("Failed to create estate");
      }
    } catch (error) {
      console.error("Error creating estate:", error);
      alert("An error occurred while creating estate");
    }
  };

  return (
    <div className="create-estate-form">
      <h1>Create New Estate</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Estate Name:</label>
          <input
            type="text"
            value={estateName}
            onChange={(e) => setEstateName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            value={estateLocation}
            onChange={(e) => setEstateLocation(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="text"
            value={estatePrice}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/[^0-9]/g, ""); // Chỉ lấy số
              const formattedValue = rawValue
                ? `$${new Intl.NumberFormat("en-US").format(rawValue)}` // Format số với dấu phẩy
                : ""; // Nếu không có giá trị, trả về chuỗi rỗng
              setEstatePrice(formattedValue); // Cập nhật giá trị estatePrice
            }}
            required
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="For Rent">For Rent</option>
            <option value="For Sale">For Sale</option>
          </select>
        </div>
        <div className="form-group">
          <label>Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="Apartment">Apartment</option>
            <option value="Commercial">Commercial</option>
            <option value="Homes & Villas">Homes & Villas</option>
            <option value="Offices">Offices</option>
            <option value="Condos">Condos</option>
          </select>
        </div>
        <div className="form-group">
          <label>Cover Images:</label>
          <input
            type="file"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            required
          />
        </div>

        {/* Preview Uploaded Images */}
        <div className="image-previews">
          {previewImages.length > 0 && (
            <div className="preview-container">
              {previewImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`preview-${index}`}
                  className="preview-image"
                />
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            value={estateDescription}
            onChange={(e) => setEstateDescription(e.target.value)}
          />
        </div>
        {uploading && <p>Uploading images...</p>}
        <button type="submit" className="submit-btn" disabled={uploading}>
          {uploading ? "Uploading..." : "Create Estate"}
        </button>
      </form>
    </div>
  );
};

export default CreateEstate;
