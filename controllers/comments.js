const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const socket = require("../socket");
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
    const io = socket.getIO();
    req.body.postedBy = req.user.id;
    req.body.post = req.params.postId;
    const comment = await Comment.create(req.body);
    if (comment.postedBy._id.toString() !== post.postedBy._id.toString()) {
      const notification = await Notification.create({
        sender: req.user._id,
        receiver: post.postedBy._id,
        message: `${comment.postedBy.profile.name} commented on your post.`,
      });
      console.log(post.postedBy.socketId);
      io.to(post.postedBy.socketId).emit("get-notification", notification);
    }
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
    const io = socket.getIO();
    if (comment.likes.includes(currentUser)) {
      const currentUserIndex = comment.likes.indexOf(currentUser);
      comment.likes.splice(currentUserIndex, 1);
    } else {
      comment.likes.push(currentUser);
      if (comment.postedBy._id.toString() !== currentUser) {
        const notification = await Notification.create({
          sender: req.user._id,
          receiver: comment.postedBy._id,
          message: `${req.user.profile.name} liked your comment`,
        });
        io.to(comment.postedBy.socketId).emit("get-notification", notification);
      }
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
