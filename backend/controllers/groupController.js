const groupService = require("../services/groupService");

exports.getGroup = async (req, res, next) => {
  try {
    const { email } = req.params;
    const data = await groupService.getGroupDetails(email);

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
