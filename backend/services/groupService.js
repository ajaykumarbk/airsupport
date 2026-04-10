const { google } = require("googleapis");
const { getAuthClient } = require("../googleClient");

const SCOPES = [
  "https://www.googleapis.com/auth/admin.directory.group.readonly",
];

exports.getGroupDetails = async (groupEmail) => {
  if (!groupEmail) {
    const err = new Error("Group email is required");
    err.status = 400;
    throw err;
  }

  const auth = getAuthClient(SCOPES);
  await auth.authorize();

  const service = google.admin({ version: "directory_v1", auth });

  const groupRes = await service.groups.get({ groupKey: groupEmail });
  const membersRes = await service.members.list({ groupKey: groupEmail });

  return {
    group: groupRes.data,
    members: membersRes.data.members || [],
  };
};
