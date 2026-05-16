import React from "react";
import RatingStars from "../RatingStars/RatingStars";
import Button from "../Common/Button";
import { getCompanyRecordId } from "../../utils/companyList";
import "./CompanyCard.css";

const CompanyCard = ({ company, onDetailReview }) => {
  const recordId = getCompanyRecordId(company);
  const rating = company.averageRating ?? company.rating ?? 0;
  const reviewCount = company.totalReviews ?? company.reviews ?? 0;

  return (
    <div className="company-card">
      <div className="card-content">
        <div
          className="company-logo"
          style={{
            backgroundColor: company.logoColor || "#2a2a2a",
          }}
        >
          {company?.logo ||
            (company.companyName || company.name || "?").charAt(0).toUpperCase()}
        </div>

        <div className="company-info">
          <h3 className="company-name">{company.companyName || company.name}</h3>
          <p className="company-address">📍 {company.address}</p>
          <p className="company-description">{company.description}</p>

          <div className="company-rating">
            <RatingStars rating={rating} />
            <span className="review-count">{reviewCount} Reviews</span>
          </div>
        </div>

        <div className="company-meta">
          <div className="founded-date">
            Founded on {company.foundedDate || company.founded}
          </div>
          <Button 
            variant="secondary"
            size="small"
            onClick={() => recordId != null && onDetailReview(recordId)}
            className="detail-btn"
          >
            Details / Review
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
