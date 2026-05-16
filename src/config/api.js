// API Configuration
// Change this single URL to switch between local development and production

export const BASE_URL =  "https://review-rate-backend.vercel.app";

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
  },

  // Company endpoints
  COMPANY: {
    CREATE: "/api/company/create",
    GET_ALL: "/api/company/all",
    DELETE: (id) => `/api/company/delete/${id}`,
    UPDATE: (id) => `/api/company/update/${id}`,
  },

  // Review endpoints
  REVIEW: {
    CREATE: "/api/review/create",
    GET_SUMMARY: (companyId) => `/api/review/summary/${companyId}`,
    GET_REVIEWS: (companyId) => `/api/review/summary/reviews/${companyId}`,
  },
};
