const userService = require("../services/userService");

exports.getUser = async (req, res, next) => {
  try {
    const { email } = req.query;
    const user = await userService.getUser(email);
    res.json(user);
  } catch (err) {
    next(err);
  }
};
