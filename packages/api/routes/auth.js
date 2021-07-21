const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/redirect",
  passport.authenticate("google"),
  (req, res) => {
      const user = req.user;
    const uid = user?.id;
    const token = jwt.sign({ userId: uid }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15min",
    });
    const accessToken = jwt.sign(
      { userId: uid },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );
    const refreshToken = jwt.sign(
      { userId: uid },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const redirectUrl = `http://localhost:3000`;
    res.json({ user, accessToken, refreshToken });
    // res.redirect(redirectUrl);
  }
);

module.exports = router;
