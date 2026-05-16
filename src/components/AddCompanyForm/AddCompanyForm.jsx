import React, { useState } from "react";
import "./AddCompanyForm.css";

const AddCompanyForm = ({ cities, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    city: cities[0] || "",
    address: "",
    foundedDate: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" || name === "reviews" ? parseFloat(value) : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.companyName.trim()) {
      setError("Company name is required");
      return;
    }

    if (!formData.address.trim()) {
      setError("Address is required");
      return;
    }

    if (!formData.foundedDate) {
      setError("Founded date is required");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    if (formData.companyName.length < 3) {
      setError("Company name must be at least 3 characters");
      return;
    }

    if (formData.description.length < 10) {
      setError("Description must be at least 10 characters");
      return;
    }

    if (formData.rating < 0 || formData.rating > 5) {
      setError("Rating must be between 0 and 5");
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("companyName", formData.companyName);
      submitData.append("city", formData.city);
      submitData.append("address", formData.address);
      submitData.append("foundedDate", formData.foundedDate);
      submitData.append("description", formData.description);
      submitData.append("rating", formData.rating);
      submitData.append("reviews", formData.reviews);
      
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      // For now, create local company object (will be replaced by API call)
      const newCompany = {
        id: Date.now(),
        companyName: formData.companyName,
        city: formData.city,
        address: formData.address,
        foundedDate: formData.foundedDate,
        description: formData.description,
        rating: formData.rating,
        reviews: formData.reviews,
        image: imagePreview,
        logo: formData.companyName.substring(0, 2).toUpperCase(),
        logoColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      };

      console.log("[v0] Company created with image:", newCompany);
      onSubmit(newCompany);
      setLoading(false);
      onClose();
    } catch (err) {
      console.error("[v0] Error creating company:", err);
      setError("Failed to create company. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Company</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="company-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="companyName">Company Name *</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City *</label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="form-select"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter company address"
              rows="3"
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="foundedDate">Founded Date *</label>
            <input
              type="date"
              id="foundedDate"
              name="foundedDate"
              value={formData.foundedDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter company description (min 10 characters)"
              rows="4"
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Company Image (Optional)</label>
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Company preview" />
              </div>
            )}
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="form-input"
            />
            <small className="form-hint">Accepted formats: JPG, PNG, GIF (Max 5MB)</small>
          </div>


          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Adding..." : "Add Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompanyForm;
