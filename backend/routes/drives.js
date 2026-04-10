const express = require("express");
const router = express.Router();
const driveController = require("../controllers/driveController");

router.get("/:driveId", driveController.getDrive);

module.exports = router;
