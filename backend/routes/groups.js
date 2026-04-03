/**
 * Group Lookup Routes
 * Provides endpoints for retrieving Google Group information
 */

const express = require('express');
const { google } = require('googleapis');
const { getAuthClient } = require('../googleClient');

const router = express.Router();

// API Scopes
const GROUP_SCOPES = [
  'https://www.googleapis.com/auth/admin.directory.group.readonly',
  'https://www.googleapis.com/auth/admin.directory.group.member.readonly',
];

/**
 * GET /api/group/:groupEmail
 * Retrieve group information and members
 * @param {string} groupEmail - Group email address
 * @returns {object} Group details and list of members
 */
router.get('/:groupEmail', async (req, res) => {
  const { groupEmail } = req.params;

  if (!groupEmail || groupEmail.trim().length === 0) {
    return res.status(400).json({ error: 'Group email parameter is required' });
  }

  try {
    // Authenticate with Google APIs
    const auth = getAuthClient(GROUP_SCOPES);
    await auth.authorize();

    // Initialize Admin Directory API
    const service = google.admin({ version: 'directory_v1', auth });

    // Fetch group information
    const groupRes = await service.groups.get({ groupKey: groupEmail });
    const group = groupRes.data;

    // Fetch group members (with fallback for errors)
    let members = [];
    try {
      const membersRes = await service.members.list({ groupKey: groupEmail });
      members = membersRes.data.members || [];
    } catch (membersErr) {
      console.warn(`Failed to fetch members for ${groupEmail}:`, membersErr.message);
      // Continue without members
    }

    return res.status(200).json({
      success: true,
      group,
      members,
    });
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || 'Failed to fetch group information';

    console.error(`[Group Lookup] Error for ${groupEmail}:`, err);

    return res.status(status).json({
      success: false,
      error: message,
    });
  }
});

module.exports = router;