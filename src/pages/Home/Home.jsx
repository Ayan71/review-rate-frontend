import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import SearchBar from "../../components/SearchBar/SearchBar";
import CompanyCard from "../../components/CompanyCard/CompanyCard";
import AddCompanyForm from "../../components/AddCompanyForm/AddCompanyForm";
import {
  getAllCompanies,
  searchCompanies,
  createCompany,
} from "../../api/services/companyServiceAPI";
import { citiesData } from "../../dummy/companies";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(false);
  const [showAddCompanyForm, setShowAddCompanyForm] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async (city = "All Cities", sort = "name") => {
    setLoading(true);

    try {
      const cityFilter = city === "All Cities" ? null : city;

      const response = await getAllCompanies(cityFilter, sort);

      console.log("Companies loaded:", response);

      // ✅ SAFE DATA EXTRACTION
      const companiesData =
        response?.data?.companies ||
        response?.companies ||
        response?.data ||
        [];

      setCompanies(Array.isArray(companiesData) ? companiesData : []);
    } catch (error) {
      console.error("Error fetching companies:", error);
      alert("Unable to fetch companies. Please check backend.");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (city) => {
    setSelectedCity(city);
    await loadCompanies(city, sortBy);
  };

  const handleSortChange = async (newSort) => {
    setSortBy(newSort);
    await loadCompanies(selectedCity, newSort);
  };

  const handleNavbarSearch = async (query) => {
    setLoading(true);

    try {
      const cityFilter = selectedCity === "All Cities" ? null : selectedCity;

      const response = await searchCompanies(query, cityFilter);

      console.log("Search results:", response);

      const searchData =
        response?.data?.companies ||
        response?.companies ||
        response?.data ||
        [];

      setCompanies(Array.isArray(searchData) ? searchData : []);
    } catch (error) {
      console.error("Error searching companies:", error);
      alert("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = () => {
    setShowAddCompanyForm(true);
  };

  const handleAddCompanySubmit = async (newCompany) => {
    try {
      const result = await createCompany(newCompany);

      console.log("Company created:", result);

      await loadCompanies(selectedCity, sortBy);
    } catch (error) {
      console.error("Error adding company:", error);
      alert("Failed to add company.");
    }
  };

  const handleCloseAddCompanyForm = () => {
    setShowAddCompanyForm(false);
  };

  const handleDetailReview = (companyId) => {
    navigate(`/company/${companyId}`);
  };

  return (
    <div className="home">
      <Navbar onSearch={handleNavbarSearch} />

      <main className="home-container">
        <SearchBar
          cities={citiesData}
          onSearch={handleSearch}
          onAddCompany={handleAddCompany}
          onSortChange={handleSortChange}
          selectedSort={sortBy}
        />

        <div className="companies-section">
          <div className="result-info">
            Result Found: {companies.length}
          </div>

          {loading ? (
            <div className="loading">Loading companies...</div>
          ) : Array.isArray(companies) && companies.length > 0 ? (
            <div className="companies-list">
              {companies.map((company) => (
                <CompanyCard
                  key={company._id || company.id}
                  company={company}
                  onDetailReview={handleDetailReview}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              No companies found
              {selectedCity !== "All Cities" && ` in ${selectedCity}`}
            </div>
          )}
        </div>
      </main>

      {showAddCompanyForm && (
        <AddCompanyForm
          cities={citiesData}
          onSubmit={handleAddCompanySubmit}
          onClose={handleCloseAddCompanyForm}
        />
      )}
    </div>
  );
};

export default Home;