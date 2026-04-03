/**
 * User Lookup Routes
 * Provides endpoints for retrieving Google Workspace user information
 */

const express = require('express');
const { google } = require('googleapis');
const { getAuthClient } = require('../googleClient');

const router = express.Router();

// API Scopes
const USER_SCOPES = [
  'https://www.googleapis.com/auth/admin.directory.user.readonly',
  'https://www.googleapis.com/auth/admin.directory.group.readonly',
];

const ALIAS_SCOPES = [
  'https://www.googleapis.com/auth/admin.directory.user.readonly',
];

/**
 * GET /api/user/:email
 * Retrieve user information, aliases, and groups
 * @param {string} email - User email address
 * @returns {object} User details, aliases, and group memberships
 */
router.get('/:email', async (req, res) => {
  const { email } = req.params;

  if (!email || email.trim().length === 0) {
    return res.status(400).json({ error: 'Email parameter is required' });
  }

  try {
    // Authenticate with Google APIs
    const auth = getAuthClient(USER_SCOPES);
    await auth.authorize();

    // Initialize Admin Directory API
    const service = google.admin({ version: 'directory_v1', auth });

    // Fetch user information
    const userRes = await service.users.get({ userKey: email });
    const user = userRes.data;

    // Fetch user aliases (with fallback for errors)
    let aliases = [];
    try {
      const aliasesRes = await service.users.aliases.list({ userKey: email });
      aliases = aliasesRes.data.aliases || [];
    } catch (aliasErr) {
      console.warn(`Failed to fetch aliases for ${email}:`, aliasErr.message);
      // Continue without aliases
    }

    // Fetch user's groups (with fallback for errors)
    let groups = [];
    try {
      const groupsRes = await service.groups.list({ userKey: email, maxResults: 200 });
      groups = groupsRes.data.groups || [];
    } catch (groupsErr) {
      console.warn(`Failed to fetch groups for ${email}:`, groupsErr.message);
      // Continue without groups
    }

    return res.status(200).json({
      success: true,
      user,
      aliases,
      groups,
    });
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || 'Failed to fetch user information';

    console.error(`[User Lookup] Error for ${email}:`, err);

    return res.status(status).json({
      success: false,
      error: message,
    });
  }
});

module.exports = router;