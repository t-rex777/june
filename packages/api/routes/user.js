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
  getAllUsers,
  setUserProfilePhoto,
} = require("../controllers/user");

// middlewware
router.param("personUsername", getPersonByUserName);

router
  .post("/signin", signin)
  .post("/signup", signup)
  .get("/token/refresh", createAccessToken);

router
  // .use(isAuthenticatedToken)
  .get("/person/:personUsername", getPerson)
  .get("/user", getUser)
  .get("/allusers", getAllUsers)
  .post("/user/update", updateUser)
  .post("/user/update/profilephoto", setUserProfilePhoto)

  .patch("/person/:personUsername/updateFollowers", updatePersonFollowers)
  .patch("/person/:personUsername/unfollow", UnfollowPerson)

  .delete("/user/delete", deleteUser);
  
module.exports = router;
