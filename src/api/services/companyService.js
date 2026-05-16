import { companiesData } from "../../dummy/companies";

// Simulate async API call
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getCompanies = async (city = null, sortBy = "name") => {
  await delay(300);

  let filtered = [...companiesData];

  // Filter by city
  if (city) {
    const cityName = city.split(",")[0].trim();
    filtered = filtered.filter(
      (company) => company.city.toLowerCase() === cityName.toLowerCase()
    );
  }

  // Sort companies
  if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "reviews") {
    filtered.sort((a, b) => b.reviews - a.reviews);
  }

  return filtered;
};

export const getCompanyById = async (id) => {
  await delay(300);
  return companiesData.find((company) => company.id === parseInt(id));
};

export const searchCompanies = async (query, city = null) => {
  await delay(300);

  let filtered = companiesData;

  // Filter by city if provided
  if (city) {
    const cityName = city.split(",")[0].trim();
    filtered = filtered.filter(
      (company) => company.city.toLowerCase() === cityName.toLowerCase()
    );
  }

  // Filter by search query
  if (query) {
    const lowerQuery = query.toLowerCase();
    filtered = filtered.filter(
      (company) =>
        company.name.toLowerCase().includes(lowerQuery) ||
        company.address.toLowerCase().includes(lowerQuery)
    );
  }

  return filtered;
};
