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
  getPerson,
  getPersonByUserName,
  updatePersonFollowers,
  UnfollowPerson,
  getAllUsers
} = require("../controllers/user");

// middlewware
router.param("personUsername",getPersonByUserName);

router
  .post("/signin", signin)
  .post("/signup", signup)
  .get("/token/refresh", createAccessToken);

router
  .use(isAuthenticatedToken)
  .get("/person/:personUsername",getPerson)
  .get("/user", getUser)
  .get("/allusers", getAllUsers)
  .post("/user/update", updateUser)
  .delete("/user/delete", deleteUser)

  .patch("/person/:personUsername/updateFollowers",updatePersonFollowers)
  .patch("/person/:personUsername/unfollow",UnfollowPerson)

module.exports = router;
