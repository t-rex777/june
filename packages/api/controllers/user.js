const User = require("../models/user");
const Notification = require("../models/notification");
const jwt = require("jsonwebtoken");
const { extend } = require("lodash");
const { cloudinary } = require("../utils/cloudinary");


// middleware
exports.isAuthenticatedToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader && typeof authHeader !== "string") {
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
      error: error.message,
      message: "token cannot be verified",
    });
  }
};

exports.getPersonByUserName = async (req, res, next, personUsername) => {
  try {
    const person = await User.find({
      username: personUsername,
    });
    req.personId = person[0]._id;
    return next();
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.getPerson = async (req, res) => {
  try {
    const person = await User.findById(req.personId).populate({
      path: "posts",
      populate: {
        path: "comments.commentedBy",
        select: ["username", "profile_photo"],
      },
    });
    return res.json(person);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

// read
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "posts",
      populate: {
        path: "comments.commentedBy",
        select: ["username", "profile_photo"],
      },
    });

    const {
      _id,
      name,
      username,
      email,
      posts,
      followers,
      followings,
      bio,
      profile_photo,
    } = user;
    const userDetails = {
      _id,
      name,
      username,
      email,
      posts,
      followers,
      followings,
      bio,
      profile_photo,
    };
    return res.json(userDetails);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// create
exports.signup = async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    const notification = new Notification({
      notificationMessage: `Welcome aboard ${user.name}`,
      user: user._id,
    });
    notification.save();
    const {
      _id,
      name,
      username,
      email,
      posts,
      followers,
      followings,
      bio,
      profile_photo,
    } = savedUser;
    const userDetails = {
      _id,
      name,
      username,
      email,
      posts,
      followers,
      followings,
      bio,
      profile_photo,
    };
    return res.json(userDetails);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = req.body;
    const { username, password } = user;

    await User.findOne({ username })
      .populate("posts")
      .exec((err, user) => {
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
            expiresIn: "7d",
          }
        );
        const refreshToken = jwt.sign(
          { userId: user._id },
          process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: "7d",
          }
        );

        const {
          _id,
          name,
          username,
          email,
          posts,
          followers,
          followings,
          bio,
          profile_photo,
        } = user;
        const userDetails = {
          _id,
          name,
          username,
          email,
          posts,
          followers,
          followings,
          bio,
          profile_photo,
        };
        return res.json({ userDetails, accessToken, refreshToken });
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
    let user = await User.findById(req.userId).populate("posts");
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

exports.setUserProfilePhoto = async (req, res) => {
  try {
    let user = await User.findById(req.userId).populate("posts");
    const fileStr = req.body.photo;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "june_gallary",
    });
    user.profile_photo = uploadResponse.public_id;
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.updatePersonFollowers = async (req, res) => {
  try {
    let person = await User.findById(req.personId).populate("posts");
    let user = await User.findById(req.userId);
    person.followers.unshift(req.userId);
    user.followings.unshift(req.personId);

    const updatedPerson = await person.save();
    const updatedUser = await user.save();

    const notification = new Notification({
      notificationMessage: `${user.username} started following you.`,
      user: person._id,
      actionBy: user._id,
    });

    await notification.save();

    res.json(updatedPerson);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.UnfollowPerson = async (req, res) => {
  try {
    let person = await User.findById(req.personId).populate("posts");
    let user = await User.findById(req.userId);

    userIndex = person.followers.findIndex(
      (follower) => follower == req.userId.toString()
    );
    personIndex = user.followings.findIndex(
      (following) => following == req.personId.toString()
    );

    person.followers.splice(userIndex, 1);
    user.followings.splice(personIndex, 1);

    const updatedPerson = await person.save();
    const updatedUser = await user.save();

    res.json(updatedPerson);
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
