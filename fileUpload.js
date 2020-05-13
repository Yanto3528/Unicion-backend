const multer = require("multer");
const fs = require("fs");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images");
  },
  filename: (req, file, cb) => {
    cb(null, `image-${new Date().getTime()}.${file.mimetype.split("/")[1]}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const limits = {
  fileSize: 1000000,
};

const uploadImage = multer({
  storage: fileStorage,
  fileFilter,
  limits,
}).single("image");

exports.uploadFileImage = (req, res, next) => {
  uploadImage(req, res, function (error) {
    if (error) {
      if (error.code === "LIMIT_FILE_SIZE") {
        error.message = "File Size is too large. Allowed file size is 1MB";
        error.success = false;
      }
      return res.json(error);
    }
    next();
  });
};

exports.deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      throw err;
    }
  });
};
