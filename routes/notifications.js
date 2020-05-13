const express = require("express");
const {
  getNotifications,
  updateNotifications,
  deleteNotifications,
  deleteNotification,
} = require("../controllers/notifications");

const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, getNotifications);
router.put("/", auth, updateNotifications);
router.delete("/", auth, deleteNotifications);
router.delete("/:id", auth, deleteNotification);

module.exports = router;
