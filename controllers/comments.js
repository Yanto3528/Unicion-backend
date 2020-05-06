const Comment = require("../models/Comment");
const Post = require("../models/Post");
const errorResponse = require("../utils/errorResponse");

// @description     Get all comment by specific post id
// @Method/Route    GET /api/posts/:postId/comments
// @Access          Private
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId });
    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Create new comment
// @Method/Route    POST /api/posts/:postId/comments
// @Access          Private
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: "There is no post with this id" });
    }
    req.body.postedBy = req.user.id;
    req.body.post = req.params.postId;
    const comment = await Comment.create(req.body);
    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Update a comment
// @Method/Route    PUT /api/comments/:id
// @Access          Private
exports.updateComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        error: `Cannot find comment with this id`,
      });
    }
    if (comment.postedBy._id.toString() !== req.user.id.toString()) {
      return res
        .status(400)
        .json({ error: "You are not allowed to update this comment" });
    }
    comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Like/Unlike a comment
// @Method/Route    PUT /api/comments/:id/like
// @Access          Private
exports.likeUnlikeComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        error: `Cannot find comment with this id`,
      });
    }
    const currentUser = req.user.id;
    if (comment.likes.includes(currentUser)) {
      const currentUserIndex = comment.likes.indexOf(currentUser);
      comment.likes.splice(currentUserIndex, 1);
    } else {
      comment.likes.push(currentUser);
    }
    await comment.save();
    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Delete a comment
// @Method/Route    DELETE /api/comments/:id
// @Access          Private
exports.deleteComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        error: `Cannot find comment with this id`,
      });
    }
    if (comment.postedBy._id.toString() !== req.user.id.toString()) {
      return res
        .status(400)
        .json({ error: "You are not allowed to delete this comment" });
    }
    await comment.remove();
    res.status(201).json({
      success: true,
      data: {},
    });
  } catch (error) {
    errorResponse(res, error);
  }
};
