const express = require("express");
const {
  getPosts,
  getPostsByUser,
  addPost,
  updatePost,
  deletePost,
  likeUnlikePost,
} = require("../controllers/posts");

const commentRouter = require("./comments");

const auth = require("../middlewares/auth");
const { uploadFileImage } = require("../fileUpload");

const { checkText, validationResult } = require("../middlewares/validator");

const router = express.Router();

// Re route to comment router
router.use("/:postId/comments", commentRouter);

router.get("/", auth, getPosts);
router.get("/:id", auth, getPostsByUser);
router.post("/", auth, uploadFileImage, checkText, validationResult, addPost);
router.put(
  "/:id",
  auth,
  uploadFileImage,
  checkText,
  validationResult,
  updatePost
);
router.put("/:id/like", auth, likeUnlikePost);
router.delete("/:id", auth, deletePost);

module.exports = router;
