const express = require("express");
const {
  getNotifications,
  updateNotifications,
} = require("../controllers/notifications");

const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, getNotifications);
router.put("/", auth, updateNotifications);

module.exports = router;
