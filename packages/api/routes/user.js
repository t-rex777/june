const express = require("express");
const router = express.Router();

const { signin, signup, getUser } = require("../controllers/user");

router
.post("/signin", signin)
.post("/signup", signup)
.get("/user", getUser);

module.exports = router;
