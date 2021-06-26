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
  getPersonByUserName,
} = require("../controllers/user");



router
  .post("/signin", signin)
  .post("/signup", signup)
  .get("/token/refresh", createAccessToken);

router
  .use(isAuthenticatedToken)
  .get("/person/:personUserName",getPersonByUserName)
  .get("/user", getUser)
  .get("/user/posts", getUserPosts)
  .post("/user/update", updateUser)
  .delete("/user/delete", deleteUser);

module.exports = router;
