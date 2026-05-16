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
import { extractReviewsFromResponse, getAggregatesFromReviewList, parseReviewRating } from "../../utils/reviewList";
import { getCompanyReviewCount } from "../../utils/companyList";
import { DEMO_REVIEWS } from "../../dummy/demoReviews";
import "./CompanyDetails.css";

const reviewRating = (r) => parseReviewRating(r) ?? 0;
const reviewTitle = (r) => r?.title ?? r?.reviewTitle ?? "";
const reviewComment = (r) => r?.comment ?? r?.reviewComment ?? r?.text ?? "";
const reviewAuthor = (r) =>
  r?.reviewerName ??
  r?.userName ??
  r?.author ??
  r?.name ??
  "Anonymous";

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
            setReviews(extractReviewsFromResponse(reviewsData));
          } catch (err) {
            console.warn(" Could not fetch company reviews:", err);
            setReviews([]);
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

  const showingDemoReviews = Array.isArray(reviews) && reviews.length === 0;
  const liveReviewStats =
    !showingDemoReviews ? getAggregatesFromReviewList(reviews) : null;

  const summaryAvg =
    liveReviewStats?.averageRating ??
    reviewSummary?.averageRating ??
    reviewSummary?.avgRating ??
    company?.averageRating ??
    company?.rating ??
    0;

  const summaryTotalRaw =
    liveReviewStats?.totalReviews ??
    reviewSummary?.totalReviews ??
    reviewSummary?.reviewCount;

  const summaryTotal = Number.isFinite(Number(summaryTotalRaw))
    ? Math.max(0, Math.floor(Number(summaryTotalRaw)))
    : getCompanyReviewCount(company);

  const reviewsToDisplay = showingDemoReviews ? DEMO_REVIEWS : reviews;

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
                  <RatingStars rating={Number(summaryAvg) || 0} />
                </div>
              </div>

              <div className="detail-item">
                <label>Reviews</label>
                <div className="detail-value">
                  <span className="badge">{summaryTotal}</span>
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
           
              <ul className="reviews-list">
                {reviewsToDisplay.map((rev) => (
                  <li key={rev._id ?? rev.id} className="review-card">
                    <div className="review-card-head">
                      <RatingStars rating={reviewRating(rev)} />
                      <span className="review-card-author">
                        {reviewAuthor(rev)}
                      </span>
                    </div>
                    {reviewTitle(rev) && (
                      <h3 className="review-card-title">{reviewTitle(rev)}</h3>
                    )}
                    {reviewComment(rev) && (
                      <p className="review-card-comment">{reviewComment(rev)}</p>
                    )}
                  </li>
                ))}
              </ul>
              <Button variant="primary">Write a Review</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDetails;
