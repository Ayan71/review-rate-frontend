import React from "react";

const RatingStars = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<span key={i} style={{ color: "#FFD700", fontSize: "18px" }}>★</span>);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<span key={i} style={{ color: "#FFD700", fontSize: "18px" }}>☆</span>);
    } else {
      stars.push(<span key={i} style={{ color: "#DDD", fontSize: "18px" }}>★</span>);
    }
  }

  return (
    <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
      {stars}
      <span style={{ marginLeft: "8px", fontWeight: "600", fontSize: "14px" }}>
        {rating}
      </span>
    </div>
  );
};

export default RatingStars;
