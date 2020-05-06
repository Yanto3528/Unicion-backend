const express = require("express");
const {
  getUsers,
  getUserFriends,
  getFriendRequests,
  getUser,
  register,
  login,
  getMe,
  updatePassword,
  sendFriendRequest,
  acceptFriendRequest,
  deleteFriendRequest,
  deleteFriend,
} = require("../controllers/users");

const {
  checkRegister,
  checkLogin,
  checkPassword,
  validationResult,
} = require("../middlewares/validator");

const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, getUsers);
router.get("/:id/user", auth, getUser);
router.get("/:id/friends", auth, getUserFriends);
router.get("/friend-requests", auth, getFriendRequests);
router.get("/me", auth, getMe);
router.post("/register", checkRegister, validationResult, register);
router.post("/login", checkLogin, validationResult, login);
router.put(
  "/update-password",
  auth,
  checkPassword,
  validationResult,
  updatePassword
);
router.put("/:id/friend-request", auth, sendFriendRequest);
router.put("/:id/accept-friend-request", auth, acceptFriendRequest);
router.delete("/:id/delete-friend-request", auth, deleteFriendRequest);
router.delete("/:id/delete-friend", auth, deleteFriend);

module.exports = router;
