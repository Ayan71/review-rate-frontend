import React from "react";

const RatingStars = ({ rating }) => {
  const numeric =
    typeof rating === "number" && Number.isFinite(rating)
      ? rating
      : Number(rating);
  const safeRating = Number.isFinite(numeric) ? Math.min(5, Math.max(0, numeric)) : 0;

  const stars = [];
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 !== 0;

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
      <span style={{ marginLeft: "8px", fontWeight: "600", fontSize: "14px", color: "#1a1a1a" }}>
        {safeRating.toFixed(1)}
      </span>
    </div>
  );
};

export default RatingStars;
