// googleClient.js
const {google} = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();


const KEY_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || './service-account.json';
const SUBJECT = process.env.GOOGLE_ADMIN_SUBJECT; // admin to impersonate


if (!fs.existsSync(KEY_PATH)) {
console.warn(`Service account key not found at ${KEY_PATH}. Create and place the JSON there or set GOOGLE_SERVICE_ACCOUNT_KEY_PATH.`);
}


const keyFile = fs.existsSync(KEY_PATH) ? require(path.resolve(KEY_PATH)) : null;


function getAuthClient(scopes = []) {
if (!keyFile) throw new Error('Service account key JSON not loaded');
const jwtClient = new google.auth.JWT({
email: keyFile.client_email,
key: keyFile.private_key,
scopes,
subject: SUBJECT,
});
return jwtClient;
}


module.exports = {getAuthClient};