const express = require("express");
const {
  getComments,
  addComment,
  updateComment,
  deleteComment,
  likeUnlikeComment,
} = require("../controllers/comments");

const auth = require("../middlewares/auth");

const { checkText, validationResult } = require("../middlewares/validator");

const router = express.Router({ mergeParams: true });

router.get("/", auth, getComments);
router.post("/", auth, checkText, validationResult, addComment);
router.put("/:id", auth, checkText, validationResult, updateComment);
router.put("/:id/like", auth, likeUnlikeComment);
router.delete("/:id", auth, deleteComment);

module.exports = router;
