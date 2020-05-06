const express = require("express");
const {
  getProfiles,
  updateProfile,
  updateCoverPhoto,
} = require("../controllers/profiles");

const auth = require("../middlewares/auth");
const { uploadFileImage } = require("../fileUpload");

const { checkProfile, validationResult } = require("../middlewares/validator");

const router = express.Router();

router.get("/", auth, getProfiles);
router.put(
  "/:id",
  auth,
  uploadFileImage,
  checkProfile,
  validationResult,
  updateProfile
);
router.put("/:id/cover-photo", auth, uploadFileImage, updateCoverPhoto);

module.exports = router;
