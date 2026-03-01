/**
 * JWT Helper Utilities
 * Decodes JWT token and checks expiration
 */

/**
 * Decode JWT token (without verification - just payload)
 * @param {string} token - JWT token
 * @returns {object} Decoded payload
 */
export const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired, false otherwise
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    // exp is in seconds, convert to milliseconds
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();

    // If expiration time is less than current time, token is expired
    return expirationTime < currentTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

/**
 * Get time remaining until token expires (in minutes)
 * @param {string} token - JWT token
 * @returns {number} Minutes remaining (or -1 if expired)
 */
export const getTokenTimeRemaining = (token) => {
  if (!token) return -1;

  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return -1;

    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const timeRemaining = expirationTime - currentTime;

    if (timeRemaining < 0) return -1;

    return Math.floor(timeRemaining / 60000); // Convert to minutes
  } catch (error) {
    console.error("Error calculating token time remaining:", error);
    return -1;
  }
};

/**
 * Get user info from token
 * @param {string} token - JWT token
 * @returns {object} User info (_id, role)
 */
export const getUserFromToken = (token) => {
  if (!token) return null;

  try {
    const decoded = decodeToken(token);
    if (!decoded) return null;

    return {
      _id: decoded._id,
      role: decoded.role,
      expiresIn: decoded.exp,
    };
  } catch (error) {
    console.error("Error getting user from token:", error);
    return null;
  }
};
