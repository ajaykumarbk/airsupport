const express = require('express');
const router = express.Router();
const {google} = require('googleapis');
const {getAuthClient} = require('../googleClient');


// GET /api/group/:groupEmail
router.get('/:groupEmail', async (req, res) => {
const groupEmail = req.params.groupEmail;
try {
const auth = getAuthClient(['https://www.googleapis.com/auth/admin.directory.group.readonly','https://www.googleapis.com/auth/admin.directory.group.member.readonly']);
await auth.authorize();
const service = google.admin({version: 'directory_v1', auth});


const groupRes = await service.groups.get({groupKey: groupEmail});
const group = groupRes.data;


// list members
const membersRes = await service.members.list({groupKey: groupEmail}).catch(() => ({data:{members:[]}}));
const members = membersRes.data.members || [];


res.json({group, members});
} catch (err) {
console.error(err);
res.status(500).json({error: err.message});
}
});


module.exports = router;