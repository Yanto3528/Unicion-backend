const Post = require("../models/Post");
const errorResponse = require("../utils/errorResponse");
const { deleteFile } = require("../fileUpload");

// @description     Get all post
// @Method/Route    GET /api/posts
// @Access          Private
exports.getPosts = async (req, res) => {
  try {
    const query = req.user.friends;
    query.push(req.user);
    const posts = await Post.find({ postedBy: query }).sort("-createdAt");
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Get all post by specific user
// @Method/Route    GET /api/posts/:id
// @Access          Private
exports.getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.params.id }).sort(
      "-createdAt"
    );
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Create new post
// @Method/Route    POST /api/posts
// @Access          Private
exports.addPost = async (req, res) => {
  req.body.postedBy = req.user.id;
  try {
    if (req.file) {
      req.body.image = `/images/${req.file.filename}`;
    }
    const post = await Post.create(req.body);
    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Update a post
// @Method/Route    PUT /api/posts/:id
// @Access          Private
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        error: `Cannot find post with this id`,
      });
    }
    if (post.postedBy._id.toString() !== req.user.id.toString()) {
      return res
        .status(400)
        .json({ error: "You are not allowed to update this post" });
    }
    if (req.file) {
      if (post.image) {
        deleteFile(`uploads/${post.image}`);
      }
      req.body.image = `/images/${req.file.filename}`;
    }
    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Like/Unlike a post
// @Method/Route    PUT /api/posts/:id/like
// @Access          Private
exports.likeUnlikePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        error: `Cannot find post with this id`,
      });
    }
    const currentUser = req.user.id;
    if (post.likes.includes(currentUser)) {
      const currentUserIndex = post.likes.indexOf(currentUser);
      post.likes.splice(currentUserIndex, 1);
    } else {
      post.likes.push(currentUser);
    }
    await post.save();
    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Delete a post
// @Method/Route    DELETE /api/posts/:id
// @Access          Private
exports.deletePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        error: `Cannot find post with this id`,
      });
    }
    if (post.postedBy._id.toString() !== req.user.id.toString()) {
      return res
        .status(400)
        .json({ error: "You are not allowed to delete this post" });
    }
    if (post.image) deleteFile(`uploads/${post.image}`);
    await post.remove();
    res.status(201).json({
      success: true,
      data: {},
    });
  } catch (error) {
    errorResponse(res, error);
  }
};
