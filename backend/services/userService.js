const db = require("../database");

exports.getUser = async (email) => {
  if (!email) {
    const error = new Error("Email is required");
    error.status = 400;
    throw error;
  }

  return await db.getUser(email);
};
