import React from "react";
import "./RatingStars.css";

const RatingStars = ({ rating }) => {
  const numeric =
    typeof rating === "number" && Number.isFinite(rating)
      ? rating
      : Number(rating);
  const safeRating = Number.isFinite(numeric)
    ? Math.min(5, Math.max(0, numeric))
    : 0;

  const stars = [];
  for (let i = 0; i < 5; i++) {
    const fullAt = i + 1;
    const halfAt = i + 0.5;
    const eps = 1e-4;

    if (safeRating + eps >= fullAt) {
      stars.push(
        <span key={i} className="rating-stars__star rating-stars__full" aria-hidden>
          ★
        </span>
      );
    } else if (safeRating + eps >= halfAt) {
      stars.push(
        <span key={i} className="rating-stars__star rating-stars__half" aria-hidden>
          <span className="rating-stars__half-bg">★</span>
          <span className="rating-stars__half-fg-wrap">
            <span className="rating-stars__half-fg">★</span>
          </span>
        </span>
      );
    } else {
      stars.push(
        <span key={i} className="rating-stars__star rating-stars__empty" aria-hidden>
          ★
        </span>
      );
    }
  }

  return (
    <div className="rating-stars">
      {stars}
      <span className="rating-stars__score">{safeRating.toFixed(1)}</span>
    </div>
  );
};

export default RatingStars;
