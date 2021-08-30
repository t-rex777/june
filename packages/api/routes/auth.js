const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/redirect",
  passport.authenticate("google"),
  (req, res) => {
    const userDetails = req.user;
    const uid = userDetails?.id;
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

    const redirectUrl = !process.env.PROD
      ? `http://localhost:3000/signin?auth_success=${token}`
      : `https://june-social.netlify.app/signin?auth_success=${token}`;

    res.redirect(redirectUrl);
  }
);

module.exports = router;
