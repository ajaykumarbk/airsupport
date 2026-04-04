/**
 * API Client
 * Handles all HTTP requests to the backend server
 */

const API_BASE = '/api';

/**
 * Standard error response from API
 * @typedef {Object} ApiError
 * @property {boolean} success - Always false for errors
 * @property {string} error - Error message
 */

/**
 * Fetch user information by email
 * @param {string} email - User email address
 * @returns {Promise<Object>} User data with aliases
 * @throws {Error} If request fails
 */
export async function fetchUser(email) {
  if (!email || email.trim().length === 0) {
    throw new Error('Email is required');
  }

  const url = `${API_BASE}/user/${encodeURIComponent(email)}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`[${res.status}] ${errorText || 'Failed to fetch user'}`);
    }

    return await res.json();
  } catch (err) {
    console.error('fetchUser error:', err);
    throw new Error(err.message || 'Failed to fetch user information');
  }
}

/**
 * Fetch shared drive information by ID
 * @param {string} driveId - Google Drive ID
 * @returns {Promise<Object>} Drive metadata and members/permissions
 * @throws {Error} If request fails
 */
export async function fetchDrive(driveId) {
  if (!driveId || driveId.trim().length === 0) {
    throw new Error('Drive ID is required');
  }

  const url = `${API_BASE}/drive/${encodeURIComponent(driveId)}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`[${res.status}] ${errorText || 'Failed to fetch drive'}`);
    }

    return await res.json();
  } catch (err) {
    console.error('fetchDrive error:', err);
    throw new Error(err.message || 'Failed to fetch drive information');
  }
}

/**
 * Fetch group information by email
 * @param {string} groupEmail - Group email address
 * @returns {Promise<Object>} Group data with members
 * @throws {Error} If request fails
 */
export async function fetchGroup(groupEmail) {
  if (!groupEmail || groupEmail.trim().length === 0) {
    throw new Error('Group email is required');
  }

  const url = `${API_BASE}/group/${encodeURIComponent(groupEmail)}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`[${res.status}] ${errorText || 'Failed to fetch group'}`);
    }

    return await res.json();
  } catch (err) {
    console.error('fetchGroup error:', err);
    throw new Error(err.message || 'Failed to fetch group information');
  }
}