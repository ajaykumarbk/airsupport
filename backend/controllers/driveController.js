const driveService = require("../services/driveService");

exports.getDrive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await driveService.getDriveDetails(id);

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
