/**
 * Shared Drive Lookup Routes
 * Provides endpoints for retrieving Google Drive and permissions information
 */

const express = require('express');
const { google } = require('googleapis');
const { getAuthClient } = require('../googleClient');

const router = express.Router();

// API Scopes
const DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
];

/**
 * GET /api/drive/:driveId
 * Retrieve shared drive metadata and permissions
 * @param {string} driveId - Google Drive ID
 * @returns {object} Drive metadata and list of members/permissions
 */
router.get('/:driveId', async (req, res) => {
  const { driveId } = req.params;

  if (!driveId || driveId.trim().length === 0) {
    return res.status(400).json({ error: 'Drive ID parameter is required' });
  }

  try {
    // Authenticate with Google APIs
    const auth = getAuthClient(DRIVE_SCOPES);
    await auth.authorize();

    // Initialize Google Drive API
    const drive = google.drive({ version: 'v3', auth });

    // Fetch drive metadata
    const metadataRes = await drive.drives.get({
      driveId,
      fields: 'id,name',
    });

    const driveMetadata = metadataRes.data;

    // Fetch drive permissions
    const permissionsRes = await drive.permissions.list({
      fileId: driveId,
      supportsAllDrives: true,
      useDomainAdminAccess: true,
      fields: 'permissions(id,role,type,emailAddress,displayName)',
    });

    const permissions = permissionsRes.data.permissions || [];

    return res.status(200).json({
      success: true,
      drive: driveMetadata,
      members: permissions,
    });
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || 'Failed to fetch drive information';

    console.error(`[Drive Lookup] Error for ${driveId}:`, err);

    return res.status(status).json({
      success: false,
      error: message,
    });
  }
});

module.exports = router;