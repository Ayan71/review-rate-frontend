export function extractReviewsFromResponse(payload) {
  if (payload == null) return [];
  const raw =
    payload.reviews ??
    payload.data?.reviews ??
    (Array.isArray(payload?.data) ? payload.data : undefined);
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(payload)) return payload;
  return [];
}

/** Average + count from an array of review documents (e.g. GET /review/reviews). */
export function getAggregatesFromReviewList(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) return null;
  const ratings = [];
  for (const r of reviews) {
    const val = Number(r?.rating ?? r?.stars ?? r?.score);
    if (Number.isFinite(val))
      ratings.push(Math.min(5, Math.max(0, val)));
  }
  if (!ratings.length) return null;
  const sum = ratings.reduce((a, b) => a + b, 0);
  return {
    averageRating: sum / ratings.length,
    totalReviews: ratings.length,
  };
}
