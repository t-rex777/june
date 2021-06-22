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
} = require("../controllers/user");

router
  .post("/signin", signin)
  .post("/signup", signup)
  .get("/token/refresh", createAccessToken);

router
  .use(isAuthenticatedToken)
  .get("/user", getUser)
  .post("/user/update", updateUser)
  .delete("/user/delete", deleteUser);

module.exports = router;
