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

export function sortCompanies(companies, sortBy) {
  const list = [...companies];
  const ratingOf = (c) => Number(c.averageRating ?? c.rating ?? 0);
  const reviewsOf = (c) => Number(c.totalReviews ?? c.reviews ?? 0);
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
