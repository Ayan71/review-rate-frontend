export function extractReviewsFromResponse(payload) {
  if (payload == null) return [];

  let raw =
    payload.reviews ??
    payload.data?.reviews ??
    payload.result?.reviews;

  if (
    raw &&
    typeof raw === "object" &&
    !Array.isArray(raw) &&
    Array.isArray(raw.docs)
  ) {
    raw = raw.docs;
  }

  if (Array.isArray(raw)) return raw;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
}

/** Single review doc → 0–5 or null if unknown. */
export function parseReviewRating(r) {
  if (r == null) return null;
  const candidates = [
    r.rating,
    r.Rating,
    r.stars,
    r.score,
    r.starRating,
    r.reviewRating,
    r?.review?.rating,
    r?.meta?.rating,
  ];
  for (const v of candidates) {
    const n = Number(v);
    if (Number.isFinite(n)) return Math.min(5, Math.max(0, n));
  }
  return null;
}

/**
 * Average + count from review documents (GET /review/reviews).
 * If docs exist but ratings are missing, still returns count with avg 0.
 */
export function getAggregatesFromReviewList(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) return null;
  const ratings = [];
  for (const r of reviews) {
    const val = parseReviewRating(r);
    if (val != null) ratings.push(val);
  }
  const totalReviews = reviews.length;
  if (!ratings.length) {
    return { averageRating: 0, totalReviews };
  }
  const sum = ratings.reduce((a, b) => a + b, 0);
  return {
    averageRating: sum / ratings.length,
    totalReviews,
  };
}
