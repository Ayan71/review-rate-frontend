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
