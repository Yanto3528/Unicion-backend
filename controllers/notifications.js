const Notification = require("../models/Notification");
const errorResponse = require("../utils/errorResponse");

// @description     Get all notification by current logged user
// @Method/Route    GET /api/notifications
// @Access          Private
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiver: req.user._id,
    }).sort("-createdAt");
    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Update notifications
// @Method/Route    PUT /api/notifications
// @Access          Private
exports.updateNotifications = async (req, res) => {
  try {
    const notifications = await Notification.updateMany(
      {
        receiver: req.user._id,
      },
      { $set: { read: true } }
    ).sort("-createdAt");
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};
