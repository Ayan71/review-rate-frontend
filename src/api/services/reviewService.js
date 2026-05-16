import api from "../axiosInstance";
import { API_ENDPOINTS } from "../../config/api";

/**
 * Review Service - Handles all review-related API calls
 */

/**
 * Create a new review
 * @param {Object} reviewData - Review information
 * @param {string} reviewData.companyId - Company ID
 * @param {number} reviewData.rating - Rating (1-5)
 * @param {string} reviewData.title - Review title
 * @param {string} reviewData.comment - Review comment
 * @returns {Promise<Object>} Created review data
 */
export const createReview = async (reviewData) => {
  try {
    const response = await api.post(
      API_ENDPOINTS.REVIEW.CREATE,
      reviewData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error.response?.data || {
      message: "Failed to create review",
      error: error.message,
    };
  }
};

/**
 * Get review summary for a company
 * @param {string|number} companyId - Company ID
 * @returns {Promise<Object>} Review summary data (average rating, total reviews, etc.)
 */
export const getReviewSummary = async (companyId) => {
  try {
    const response = await api.get(
      API_ENDPOINTS.REVIEW.GET_SUMMARY(companyId)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching review summary:", error);
    throw error.response?.data || {
      message: "Failed to fetch review summary",
      error: error.message,
    };
  }
};

/**
 * Merge GET /company/all rows with live review summaries so averageRating/totalReviews match reviews.
 */
export async function enrichCompaniesWithReviewSummaries(companies) {
  if (!Array.isArray(companies) || companies.length === 0) return companies;

  const settled = await Promise.allSettled(
    companies.map((c) => {
      const id = c._id ?? c.id;
      if (id == null) return Promise.resolve(null);
      return getReviewSummary(id);
    })
  );

  return companies.map((c, i) => {
    const res = settled[i];
    if (res.status !== "fulfilled" || res.value == null) return c;

    const s = res.value;
    const avg = Number(s.averageRating ?? s.avgRating);
    const total = Number(s.totalReviews ?? s.reviewCount);
    const next = { ...c };
    if (Number.isFinite(total)) next.totalReviews = Math.max(0, Math.floor(total));
    if (Number.isFinite(avg)) next.averageRating = avg;
    return next;
  });
}

/**
 * Get all reviews for a company
 * @param {string|number} companyId - Company ID
 * @returns {Promise<Array>} List of reviews
 */
export const getCompanyReviews = async (companyId) => {
  try {
    const response = await api.get(
      API_ENDPOINTS.REVIEW.GET_REVIEWS(companyId)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching company reviews:", error);
    throw error.response?.data || {
      message: "Failed to fetch company reviews",
      error: error.message,
    };
  }
};
