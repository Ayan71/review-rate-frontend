import api from "../axiosInstance";
import { API_ENDPOINTS } from "../../config/api";
import {
  extractReviewsFromResponse,
  getAggregatesFromReviewList,
} from "../../utils/reviewList";

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
 * Get all reviews for a company
 * @param {string|number} companyId - Company ID
 * @returns {Promise<Object>} Payload including reviews array
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

/**
 * Merge GET /company/all rows with live stats from GET /review/reviews/:id.
 * The summary endpoint often stays at 0 while the reviews list is populated.
 */
export async function enrichCompaniesWithReviewSummaries(companies) {
  if (!Array.isArray(companies) || companies.length === 0) return companies;

  const settled = await Promise.allSettled(
    companies.map(async (c) => {
      const id = c._id ?? c.id;
      if (id == null) return null;
      try {
        const data = await getCompanyReviews(id);
        const list = extractReviewsFromResponse(data);
        const agg = getAggregatesFromReviewList(list);

        let totalReviews = 0;
        let averageRating = 0;

        if (agg) {
          totalReviews = agg.totalReviews;
          averageRating = agg.averageRating;
        }

        const payloadTotal = Number(data?.totalReviews);
        const payloadAvg = Number(data?.averageRating);

        if (!agg && Number.isFinite(payloadTotal)) {
          totalReviews = Math.max(0, Math.floor(payloadTotal));
        }
        if (!agg && Number.isFinite(payloadAvg)) {
          averageRating = payloadAvg;
        }

        if (
          agg &&
          Number.isFinite(payloadTotal) &&
          payloadTotal > agg.totalReviews
        ) {
          totalReviews = Math.max(0, Math.floor(payloadTotal));
        }

        return { averageRating, totalReviews };
      } catch {
        return null;
      }
    })
  );

  return companies.map((c, i) => {
    const res = settled[i];
    if (res.status !== "fulfilled" || res.value == null) return c;

    const { averageRating, totalReviews } = res.value;
    const next = { ...c };
    if (Number.isFinite(totalReviews)) next.totalReviews = totalReviews;
    if (Number.isFinite(averageRating)) next.averageRating = averageRating;
    return next;
  });
}
