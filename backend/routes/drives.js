const express = require('express');
const router = express.Router();
const {google} = require('googleapis');
const {getAuthClient} = require('../googleClient');


// GET /api/drive/:driveId
router.get('/:driveId', async (req, res) => {
const driveId = req.params.driveId;
try {
const auth = getAuthClient(['https://www.googleapis.com/auth/drive.readonly']);
await auth.authorize();
const drive = google.drive({version: 'v3', auth});


// Get drive metadata
const metadata = await drive.drives.get({driveId, fields: 'id,name'});


// List permissions/members for the drive — requires drive scope
// Drive API doesn't return "role" the same way as members in Drive, but permissions will show role and emailAddress if available
const permsRes = await drive.permissions.list({
fileId: driveId,
supportsAllDrives: true,
useDomainAdminAccess: true,
fields: 'permissions(id,role,type,emailAddress,displayName)'
});


const permissions = permsRes.data.permissions || [];
res.json({drive: metadata.data, members: permissions});
} catch (err) {
console.error(err);
res.status(500).json({error: err.message});
}
});


module.exports = router;