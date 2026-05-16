import React, { useState, useRef, useEffect } from "react";
import Button from "../Common/Button";
import "./SearchBar.css";

const SearchBar = ({ 
  cities, 
  selectedCity: selectedCityProp,
  onSearch, 
  onAddCompany,
  onSortChange,
  selectedSort 
}) => {
  const [selectedCity, setSelectedCity] = useState(
    selectedCityProp ?? cities[0] ?? ""
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (selectedCityProp != null) {
      setSelectedCity(selectedCityProp);
    }
  }, [selectedCityProp]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setIsDropdownOpen(false);
    setSearchQuery("");
    onSearch(city);
  };

  const handleFindCompany = () => {
    onSearch(selectedCity);
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar-content">
        <div className="search-group" ref={dropdownRef}>
          <label className="label">Select City</label>
          <div className="city-selector-wrapper">
            <div
              className={`city-selector ${isDropdownOpen ? "active" : ""}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <input
                type="text"
                value={isDropdownOpen ? searchQuery : selectedCity}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                className="city-input"
                placeholder="Search city..."
                onFocus={() => setIsDropdownOpen(true)}
              />
              <span className="location-icon">📍</span>
            </div>

            {isDropdownOpen && (
              <div className="city-dropdown">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <div
                      key={city}
                      className={`city-option ${
                        city === selectedCity ? "selected" : ""
                      }`}
                      onClick={() => handleCitySelect(city)}
                    >
                      {city}
                    </div>
                  ))
                ) : (
                  <div className="city-option disabled">
                    No cities found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Button 
          variant="primary"
          size="small"
          onClick={handleFindCompany}
          className="find-btn"
        >
          Find Company
        </Button>

        <Button 
          variant="primary"
          size="small"
          onClick={onAddCompany}
          className="add-btn"
        >
          + Add Company
        </Button>

        <div className="search-group sort-group">
          <label className="label">Sort:</label>
          <select 
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select"
          >
            <option value="name">Name</option>
            <option value="rating">Rating</option>
            <option value="reviews">Reviews</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
