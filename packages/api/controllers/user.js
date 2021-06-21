const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { extend, concat } = require("lodash");

// middleware
exports.isAuthenticatedToken = (req, res, next) => {
  if (
    !req.headers["authorization"] &&
    typeof req.headers["authorization"] !== "string"
  ) {
    return res.status(400).json({
      message: "no token found!",
    });
  }
  try {
    const accessToken = req.headers["authorization"].split(" ")[1];
    const { userId } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.userId = userId;
    return next();
  } catch (error) {
    res.status(400).json({
      message: "token cannot be verified",
    });
  }
};

// read
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    res.json({ user });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// create
exports.signup = async(req, res) => {
  try {
      const user = new User(req.body);
      const savedUser = await user.save();
      res.send(savedUser)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = req.body;
    const { email, password } = user;
    const userEmail = email;

    await User.findOne({ email: userEmail }).exec((err, user) => {
      if (err || user === null) {
        return res.status(400).json({
          message: "user does not exists!",
        });
      } else if (!user.authenticate(password)) {
        return res.status(401).json({
          message: "please enter the correct password!",
        });
      }
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15m",
        }
      );
      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "7d",
        }
      );
      res.json({ user, accessToken, refreshToken });
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.createAccessToken = (req, res) => {
  if (
    !req.headers["refresh-token"] &&
    typeof req.headers["refresh-token"] !== "string"
  ) {
    return res.status(401).json({
      message: "No refresh tokens found",
    });
  }

  try {
    const oldRefreshToken = req.headers["refresh-token"].split(" ")[1];
    const { userId } = jwt.verify(
      oldRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const refreshToken = jwt.sign(
      { userId: userId },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );
    const accessToken = jwt.sign(
      { userId: userId },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );
    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(401).json({
      message: "refresh token cannot be verified! please check it again.",
    });
  }
};

//Update
exports.updateUser = async (req, res) => {
  try {
    let updatedUser = req.body;
    let user = await User.findById(req.userId);
    updatedUser = await extend(user, updatedUser);
    updatedUser.save((err, updatedUser) => {
      if (err) {
        return res.status(400).json({
          message: "User didn't update",
        });
      }
      res.send(updatedUser);
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// delete
exports.deleteUser = async (req, res) => {
  try {
    let user = await User.findById(req.userId);
    user.deleteOne((err, user) => {
      if (err) {
        return res.status(400).json({
          message: "user didn't delete!",
        });
      }
      res.json({
        message: `user ${user.name} deleted successfully`,
      });
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
