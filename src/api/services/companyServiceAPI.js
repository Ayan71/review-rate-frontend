import api from "../axiosInstance";
import { API_ENDPOINTS } from "../../config/api";

/**
 * Company Service - Handles all company-related API calls
 */

/**
 * Get all companies with optional filters
 * @param {string} city - Optional city filter
 * @param {string} sortBy - Optional sort field (name, rating, reviews)
 * @returns {Promise<Array>} List of companies
 */
export const getAllCompanies = async (city = null, sortBy = "name") => {
  try {
    const params = {};
    if (city) params.city = city;
    if (sortBy) params.sortBy = sortBy;

    const response = await api.get(API_ENDPOINTS.COMPANY.GET_ALL, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error.response?.data || {
      message: "Failed to fetch companies",
      error: error.message,
    };
  }
};

/**
 * Create a new company
 * @param {Object|FormData} companyData - Company information
 * @param {string} companyData.companyName - Company name (required)
 * @param {string} companyData.city - Company city (required)
 * @param {string} companyData.address - Company address (required)
 * @param {string} companyData.foundedDate - Founded date in YYYY-MM-DD format (required)
 * @param {string} companyData.description - Company description (required)
 * @param {File} companyData.image - Company image file (optional)
 * @param {number} companyData.rating - Company rating (optional, 0-5)
 * @param {number} companyData.reviews - Number of reviews (optional)
 * @returns {Promise<Object>} Created company data
 */
export const createCompany = async (companyData) => {
  try {
    // Verify user is authenticated
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error(" No auth token found - user must be logged in");
      throw new Error("Authentication required. Please login first.");
    }

    console.log(" Creating company with auth token");

    // Check if it's FormData or regular object
    const isFormData = companyData instanceof FormData;
    
    // Validate required fields
    if (isFormData) {
      const companyName = companyData.get("companyName");
      const city = companyData.get("city");
      const address = companyData.get("address");
      const foundedDate = companyData.get("foundedDate");
      const description = companyData.get("description");

      if (!companyName || !city || !address || !foundedDate || !description) {
        throw new Error("Missing required fields");
      }
      console.log(" FormData validation passed");
    } else {
      const required = ["companyName", "city", "address", "foundedDate", "description"];
      const missing = required.filter((field) => !companyData[field]);
      
      if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(", ")}`);
      }
    }

    // Configure headers based on data type
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (isFormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    console.log(" Sending company creation request");
    
    const response = await api.post(
      API_ENDPOINTS.COMPANY.CREATE,
      companyData,
      config
    );
    
    console.log(" Company created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(" Error creating company:", error);
    throw error.response?.data || {
      message: "Failed to create company",
      error: error.message,
    };
  }
};

/**
 * Update an existing company
 * @param {string|number} id - Company ID
 * @param {Object} companyData - Updated company information
 * @returns {Promise<Object>} Updated company data
 */
export const updateCompany = async (id, companyData) => {
  try {
    const response = await api.patch(
      API_ENDPOINTS.COMPANY.UPDATE(id),
      companyData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating company:", error);
    throw error.response?.data || {
      message: "Failed to update company",
      error: error.message,
    };
  }
};

/**
 * Delete a company
 * @param {string|number} id - Company ID to delete
 * @returns {Promise<Object>} Deletion response
 */
export const deleteCompany = async (id) => {
  try {
    const response = await api.delete(API_ENDPOINTS.COMPANY.DELETE(id));
    return response.data;
  } catch (error) {
    console.error("Error deleting company:", error);
    throw error.response?.data || {
      message: "Failed to delete company",
      error: error.message,
    };
  }
};

/**
 * Search companies by query
 * @param {string} query - Search query
 * @param {string} city - Optional city filter
 * @returns {Promise<Array>} Filtered companies
 */
export const searchCompanies = async (query, city = null) => {
  try {
    const params = { search: query };
    if (city) params.city = city;

    const response = await api.get(API_ENDPOINTS.COMPANY.GET_ALL, { params });
    return response.data;
  } catch (error) {
    console.error("Error searching companies:", error);
    throw error.response?.data || {
      message: "Failed to search companies",
      error: error.message,
    };
  }
};
