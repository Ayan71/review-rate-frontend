import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import RatingStars from "../../components/RatingStars/RatingStars";
import Button from "../../components/Common/Button";
import { getAllCompanies } from "../../api/services/companyServiceAPI";
import { getCompanyReviews, getReviewSummary } from "../../api/services/reviewService";
import {
  extractCompaniesFromResponse,
  findCompanyById,
} from "../../utils/companyList";
import "./CompanyDetails.css";

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleNavbarSearch = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        // Fetch company details from API
        const response = await getAllCompanies();
        const companies = extractCompaniesFromResponse(response);
        const companyData = findCompanyById(companies, id);
        
        if (companyData) {
          console.log(" Company loaded:", companyData);
          setCompany(companyData);

          // Fetch review summary
          try {
            const summary = await getReviewSummary(id);
            console.log(" Review summary loaded:", summary);
            setReviewSummary(summary);
          } catch (err) {
            console.warn(" Could not fetch review summary:", err);
          }

          // Fetch company reviews
          try {
            const reviewsData = await getCompanyReviews(id);
            console.log(" Company reviews loaded:", reviewsData);
            setReviews(reviewsData);
          } catch (err) {
            console.warn(" Could not fetch company reviews:", err);
          }
        }
      } catch (error) {
        console.error(" Error fetching company details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [id]);

  if (loading) {
    return (
      <div className="company-details">
        <Navbar onSearch={handleNavbarSearch} />
        <main className="details-container">
          <div className="loading">Loading company details...</div>
        </main>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="company-details">
        <Navbar onSearch={handleNavbarSearch} />
        <main className="details-container">
          <div className="no-results">Company not found</div>
          <Button 
            variant="primary" 
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="company-details">
      <Navbar onSearch={handleNavbarSearch} />

      <main className="details-container">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="back-btn"
        >
          ← Back
        </Button>

        <div className="details-card">
          <div className="details-header">
            <div
              className="details-logo"
              style={{
                backgroundColor: company.logoColor || "#2a2a2a",
              }}
            >
              {company.logo ||
                (company.companyName || company.name || "?")
                  .charAt(0)
                  .toUpperCase()}
            </div>

            <div className="details-title">
              <h1>{company.companyName || company.name}</h1>
              <p className="details-address">📍 {company.address}</p>
              {company.description && (
                <p className="details-description">{company.description}</p>
              )}
            </div>
          </div>

          <div className="details-body">
            <div className="details-grid">
              <div className="detail-item">
                <label>Rating</label>
                <div className="detail-value">
                  <RatingStars
                    rating={company.averageRating ?? company.rating ?? 0}
                  />
                </div>
              </div>

              <div className="detail-item">
                <label>Total Reviews</label>
                <div className="detail-value">
                  <span className="badge">
                    {company.totalReviews ?? company.reviews ?? 0}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <label>Founded</label>
                <div className="detail-value">
                  {company.foundedDate || company.founded}
                </div>
              </div>

              <div className="detail-item">
                <label>Location</label>
                <div className="detail-value">
                  {company.city}
                </div>
              </div>
            </div>

            <div className="reviews-section">
              <h2>Recent Reviews</h2>
              <div className="review-placeholder">
                No reviews to display yet. Add a review to be the first!
              </div>
              <Button variant="primary">
                Write a Review
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDetails;
