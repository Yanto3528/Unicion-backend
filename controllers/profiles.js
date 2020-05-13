const Profile = require("../models/Profile");
const errorResponse = require("../utils/errorResponse");
const { deleteFile } = require("../fileUpload");
const path = require("path");

exports.getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({
      $and: [
        {
          _id: { $ne: req.user.profile._id },
        },
        {
          $or: [{ name: { $regex: req.query.s, $options: "i" } }],
        },
      ],
    })
      .populate("user")
      .select("user");
    res.json({
      success: true,
      data: profiles,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Update a profile
// @Method/Route    PUT /api/profiles/:id
// @Access          Private
exports.updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({
        error: `Cannot find profile with this id`,
      });
    }
    if (profile.user.toString() !== req.user.id.toString()) {
      return res
        .status(400)
        .json({ error: "You are not allowed to update this profile" });
    }
    if (req.file) {
      if (
        profile.avatar &&
        profile.avatar !== path.join(__dirname, `/images/no-photo.jpg`)
      ) {
        deleteFile(path.join(__dirname, `/uploads/${profile.avatar}`));
      }
      req.body.avatar = `/images/${req.file.filename}`;
    }
    profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    await profile.save();
    res.status(201).json({
      success: true,
      data: profile,
      msg: "Profile updated successfully",
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Update a profile cover photo
// @Method/Route    PUT /api/profiles/:id/cover-photo
// @Access          Private
exports.updateCoverPhoto = async (req, res) => {
  try {
    let profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({
        error: `Cannot find profile with this id`,
      });
    }
    if (profile.user.toString() !== req.user.id.toString()) {
      return res
        .status(400)
        .json({ error: "You are not allowed to update this profile" });
    }
    if (req.file) {
      if (profile.coverPhoto && profile.coverPhoto !== "/images/no-cover.jpg") {
        deleteFile(`uploads/${profile.coverPhoto}`);
      }
      req.body.coverPhoto = `/images/${req.file.filename}`;
    }
    profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    await profile.save();
    res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};
