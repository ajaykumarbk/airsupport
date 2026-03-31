const express = require('express');
const router = express.Router();
const {google} = require('googleapis');
const {getAuthClient} = require('../googleClient');


// GET /api/user/:email
router.get('/:email', async (req, res) => {
const email = req.params.email;
try {
const auth = getAuthClient(['https://www.googleapis.com/auth/admin.directory.user.readonly']);
await auth.authorize();
const service = google.admin({version: 'directory_v1', auth});


const userRes = await service.users.get({userKey: email});
const user = userRes.data;


// also fetch aliases
const aliasesRes = await service.users.aliases.list({userKey: email}).catch(() => ({data:{aliases:[]}}));


res.json({user, aliases: aliasesRes.data.aliases || []});
} catch (err) {
console.error(err);
res.status(500).json({error: err.message});
}
});


module.exports = router;