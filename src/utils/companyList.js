/**
 * Normalizes company list payloads from GET /company/all (and similar).
 */
export function extractCompaniesFromResponse(payload) {
  if (payload == null) return [];
  const nested =
    payload?.data?.companies ??
    payload?.companies ??
    (Array.isArray(payload?.data) ? payload.data : undefined);
  if (Array.isArray(nested)) return nested;
  if (Array.isArray(payload)) return payload;
  return [];
}

export function primaryCitySegment(cityLabel) {
  if (!cityLabel || cityLabel === "All Cities") return null;
  return cityLabel.split(",")[0].trim().toLowerCase();
}

export function companyMatchesSelectedCity(company, selectedCityLabel) {
  if (!selectedCityLabel || selectedCityLabel === "All Cities") return true;
  const target = primaryCitySegment(selectedCityLabel);
  if (!target) return true;
  const companyCity = String(company.city ?? "").toLowerCase().trim();
  if (!companyCity) return false;
  return (
    companyCity === target ||
    companyCity.includes(target) ||
    target.includes(companyCity)
  );
}

/** Numeric average rating for display/sort (API: averageRating). */
export function getCompanyAverageRating(company) {
  if (!company) return 0;
  const raw =
    company.averageRating ??
    company.avgRating ??
    company.average_rating ??
    company.rating;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Total review count (API: totalReviews). Never treats reviews[] as the numeric fallback.
 */
export function getCompanyReviewCount(company) {
  if (!company) return 0;
  if (company.totalReviews != null && company.totalReviews !== "") {
    const n = Number(company.totalReviews);
    if (Number.isFinite(n)) return Math.max(0, Math.floor(n));
  }
  if (company.reviewCount != null && company.reviewCount !== "") {
    const n = Number(company.reviewCount);
    if (Number.isFinite(n)) return Math.max(0, Math.floor(n));
  }
  if (Array.isArray(company.reviews)) return company.reviews.length;
  if (typeof company.reviews === "number") {
    const n = Number(company.reviews);
    return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
  }
  return 0;
}

export function sortCompanies(companies, sortBy) {
  const list = [...companies];
  const ratingOf = (c) => getCompanyAverageRating(c);
  const reviewsOf = (c) => getCompanyReviewCount(c);
  const nameOf = (c) => String(c.companyName ?? c.name ?? "").toLowerCase();

  if (sortBy === "rating") {
    list.sort((a, b) => ratingOf(b) - ratingOf(a));
  } else if (sortBy === "reviews") {
    list.sort((a, b) => reviewsOf(b) - reviewsOf(a));
  } else {
    list.sort((a, b) => nameOf(a).localeCompare(nameOf(b)));
  }
  return list;
}

export function getCompanyRecordId(company) {
  if (!company) return undefined;
  return company._id ?? company.id;
}

export function findCompanyById(companies, routeId) {
  const idStr = String(routeId ?? "");
  return companies.find((c) => String(getCompanyRecordId(c)) === idStr);
}
