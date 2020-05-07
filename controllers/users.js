const User = require("../models/User");
const Profile = require("../models/Profile");
const errorResponse = require("../utils/errorResponse");

// @description     Get all users
// @Method/Route    GET /api/users
// @Access          Private
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Get user friends
// @Method/Route    GET /api/users/:id/friends
// @Access          Private
exports.getUserFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const users = await User.find({ _id: user.friends }).populate("profile");
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Get user friends
// @Method/Route    GET /api/users/friend-requests
// @Access          Private
exports.getFriendRequests = async (req, res) => {
  try {
    const users = await User.find({ _id: req.user.friendRequests }).populate(
      "profile"
    );
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Get a single user
// @Method/Route    GET /api/users/:id/user
// @Access          Private
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Register a user
// @Method/Route    POST /api/users
// @Access          Private
exports.register = async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    address,
    gender,
    birthDate,
    country,
    state,
  } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ error: "User already exists, please sign in" });
    }
    user = await User.create({
      email,
      password,
    });
    const profile = await Profile.create({
      firstName,
      lastName,
      address: `${address}, ${state}, ${country}`,
      gender,
      birthDate,
      user: user._id,
    });
    const token = user.getSignedJwtToken();
    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Login a user
// @Method/Route    POST /api/users
// @Access          Private
exports.login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
    const isMatch = await user.matchPassword(req.body.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
    const token = user.getSignedJwtToken();
    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Get logged in user
// @Method/Route    GET /api/users/me
// @Access          Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Update existing user password
// @Method/Route    PUT /api/users/update-password
// @Access          Private
exports.updatePassword = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ error: "There is no user with this id" });
    }
    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }
    user.password = req.body.newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      msg: "Password updated successfully",
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Send a friend request
// @Method/Route    PUT /api/users/:id/friend-request
// @Access          Private
exports.sendFriendRequest = async (req, res) => {
  if (req.user.id.toString() === req.params.id) {
    return res
      .status(400)
      .json({ error: "You cannot send a request to yourself" });
  }
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "No user found with this id" });
    }
    const currentUser = req.user.id;
    if (
      user.friendRequests.includes(currentUser) ||
      user.friends.includes(currentUser)
    ) {
      return res.status(400).json({
        error: "You already sent a friend request or you're already friends.",
      });
    }
    user.friendRequests.push(currentUser);
    await user.save();
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Accept a friend request
// @Method/Route    PUT /api/users/:id/accept-friend-request
// @Access          Private
exports.acceptFriendRequest = async (req, res) => {
  try {
    friendRequestHandler(req, res, "accept");
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Delete a friend request
// @Method/Route    DELETE /api/users/:id/delete-friend-request
// @Access          Private
exports.deleteFriendRequest = async (req, res) => {
  try {
    friendRequestHandler(req, res);
  } catch (error) {
    errorResponse(res, error);
  }
};

// @description     Delete a friend
// @Method/Route    DELETE /api/users/:id/delete-friend
// @Access          Private
exports.deleteFriend = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "No user found with this id" });
    }
    let currentUser = req.user;
    if (!user.friends.includes(currentUser._id)) {
      return res
        .status(400)
        .json({ error: "You're not a friend of this user" });
    }
    const userIndex = currentUser.friends.indexOf(user.id);
    currentUser.friends.splice(userIndex, 1);
    const currentUserIndex = user.friends.indexOf(currentUser.id);
    user.friends.splice(currentUserIndex, 1);
    await currentUser.save();
    await user.save();
    res.status(200).json({
      success: true,
      data: currentUser,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// Helper function to handle accept and delete friend request
const friendRequestHandler = async (req, res, type = "") => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "No user found with this id" });
  }
  let currentUser = req.user;
  if (!currentUser.friendRequests.includes(user._id)) {
    return res.status(400).json({ error: "No friend request with this user" });
  }
  const userIndex = currentUser.friendRequests.indexOf(user._id);
  currentUser.friendRequests.splice(userIndex, 1);
  if (type === "accept") {
    currentUser.friends.push(user.id);
    user.friends.push(currentUser.id);
  }
  await currentUser.save();
  await user.save();
  res.status(200).json({
    success: true,
    data: currentUser,
  });
};
