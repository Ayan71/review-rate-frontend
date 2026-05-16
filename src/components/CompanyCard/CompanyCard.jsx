import React from "react";
import RatingStars from "../RatingStars/RatingStars";
import Button from "../Common/Button";
import "./CompanyCard.css";

const CompanyCard = ({ company, onDetailReview }) => {
  console.log("[CompanyCard] Rendering company:", company);
  return (
    <div className="company-card">
      <div className="card-content">
        <div className="company-logo" style={{ backgroundColor: company.logoColor }}>
          {company?.logo}
        </div>

        <div className="company-info">
          <h3 className="company-name">{company.companyName || company.name}</h3>
          <p className="company-address">📍 {company.address}</p>
          <p className="company-description">{company.description}</p>

          <div className="company-rating">
            <RatingStars rating={company.rating} />
            <span className="review-count">{company.reviews} Reviews</span>
          </div>
        </div>

        <div className="company-meta">
          <div className="founded-date">
            Founded on {company.foundedDate || company.founded}
          </div>
          <Button 
            variant="secondary"
            size="small"
            onClick={() => onDetailReview(company.id)}
            className="detail-btn"
          >
            Detail Review
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
