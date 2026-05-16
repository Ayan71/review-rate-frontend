import api from "../axiosInstance";
import { API_ENDPOINTS } from "../../config/api";

/**
 * Auth Service - Handles all authentication-related API calls
 */

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and auth token
 */
export const loginUser = async (email, password) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    console.log(" Login response:", response.data);

    // Store token from successful login
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      console.log(" Auth token stored");
    }

    // Store user data (create user object if not provided by backend)
    const userData = response.data.user || {
      email,
      name: email.split("@")[0],
      role: response.data.role || "user",
    };
    localStorage.setItem("user", JSON.stringify(userData));
    console.log(" User data stored:", userData);

    return response.data;
  } catch (error) {
    console.error(" Login error:", error);
    throw error.response?.data || {
      message: "Login failed",
      error: error.message,
    };
  }
};

/**
 * Register a new user
 * @param {string} name - User full name
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} confirmPassword - Confirm password
 * @returns {Promise<Object>} User data and auth token
 */
export const signupUser = async (name, email, password, confirmPassword) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, {
      name,
      email,
      password,
      confirmPassword,
    });

    // Store token if provided
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    // Store user data
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Signup failed",
      error: error.message,
    };
  }
};

/**
 * Logout user (clear local storage)
 */
export const logoutUser = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};

/**
 * Get current user from localStorage
 * @returns {Object|null} Current user data or null
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};
