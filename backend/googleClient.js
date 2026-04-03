/**
 * Google Workspace Authentication Client
 * Provides JWT authentication for Google Admin APIs
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

// Configuration
const KEY_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || './service-account.json';
const ADMIN_SUBJECT = process.env.GOOGLE_ADMIN_SUBJECT;

// Validate key file existence
if (!fs.existsSync(KEY_PATH)) {
  console.warn(
    `⚠️  Service account key not found at ${KEY_PATH}. ` +
    'Create and place the JSON file there or set GOOGLE_SERVICE_ACCOUNT_KEY_PATH environment variable.'
  );
}

// Load service account key
const keyFile = fs.existsSync(KEY_PATH) ? require(path.resolve(KEY_PATH)) : null;

/**
 * Get authenticated JWT client for Google APIs
 * @param {string[]} scopes - List of API scopes required
 * @returns {google.auth.JWT} Authenticated JWT client
 * @throws {Error} If service account key is not loaded
 */
function getAuthClient(scopes = []) {
  if (!keyFile) {
    throw new Error(
      'Service account key JSON not loaded. ' +
      'Ensure GOOGLE_SERVICE_ACCOUNT_KEY_PATH points to a valid service account JSON file.'
    );
  }

  const jwtClient = new google.auth.JWT({
    email: keyFile.client_email,
    key: keyFile.private_key,
    scopes,
    subject: ADMIN_SUBJECT,
  });

  return jwtClient;
}

module.exports = {
  getAuthClient,
};