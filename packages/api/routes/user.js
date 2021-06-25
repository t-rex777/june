const express = require("express");
const router = express.Router();

const {
  signin,
  signup,
  getUser,
  isAuthenticatedToken,
  updateUser,
  deleteUser,
  createAccessToken,
  getUserPosts,
} = require("../controllers/user");

router
  .post("/signin", signin)
  .post("/signup", signup)
  .get("/token/refresh", createAccessToken);

router
  .use(isAuthenticatedToken)
  .get("/user", getUser)
  .get("/user/posts", getUserPosts)
  .post("/user/update", updateUser)
  .delete("/user/delete", deleteUser);

module.exports = router;
