const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");

router.get("/:groupEmail", groupController.getGroup);

module.exports = router;
