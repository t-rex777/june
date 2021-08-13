const Post = require("../models/post");
const User = require("../models/user");
const Notification = require("../models/notification");
const { extend } = require("lodash");
const { cloudinary } = require("../utils/cloudinary");
const user = require("../models/user");

// middleware
exports.findPostById = async (req, res, next, postId) => {
  try {
    let post = await Post.findById(postId)
      .populate({ path: "user", select: ["username", "profile_photo"] })
      .populate({
        path: "comments.commentedBy",
        select: ["username", "profile_photo"],
      });
    if (post === undefined) {
      return res.status.json({
        message: "could not find the post",
      });
    }
    req.post = post;
    return next();
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// get posts
exports.getPosts = async (req, res) => {
  try {
    const { resources } = await cloudinary.search
      .expression("folder:june_gallary")
      .sort_by("public_id", "desc")
      .max_results(10)
      .execute();

    const publicIds = resources.map((file) => file.public_id);
    res.send(publicIds);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId)
      .populate({ path: "user", select: ["username", "profile_photo"] })
      .populate({
        path: "comments.commentedBy",
        select: ["username", "profile_photo"],
      });
    res.json(post);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getJunePosts = async (req, res) => {
  try {
    const junePosts = await Post.find()
      .populate("comments")
      .populate({ path: "user", select: ["username", "profile_photo"] })
      .populate({
        path: "comments.commentedBy",
        select: ["username", "profile_photo"],
      })
      .sort({ _id: -1 })
      .limit(20);
    res.json(junePosts);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// get notifications
exports.getNotificationsById = async (req, res) => {
  try {
    const userNotifications = await Notification.find({
      user: req.userId,
    })
      .populate({ path: "user", select: ["username", "profile_photo"] })
      .populate({ path: "actionBy", select: ["username", "profile_photo"] })
      .sort({ _id: -1 });

    res.json(userNotifications);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// create post
exports.uploadPost = async (req, res) => {
  try {
    let user = await User.findById(req.userId);
    const fileStr = req.body.photo;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "june_gallary",
    });

    const post = await new Post({
      user: req.userId,
      caption: req.body.caption,
      photo: uploadResponse.url,
      public_id: uploadResponse.public_id,
    });
    // saving post to post DB
    const savedPost = await post.save();

    // saving post to user DB
    user.posts.unshift(savedPost._id);
    await user.save();

    res.json(savedPost);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Something went wrong", message: error.message });
  }
};

// update posts
exports.updateCaption = async (req, res) => {
  try {
    let post = req.post;
    let changedCaption = req.body.editedCaption;

    post = extend(post, changedCaption);
    const savedPost = await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.likePost = async (req, res) => {
  try {
    let post = req.post;
    let user = await User.findById(req.userId);
    post.likes.unshift(req.userId);
    user.likedPosts.unshift(post._id);
    post.save();
    user.save();

    // adding notification
    if (post.user._id.toString() !== req.userId.toString()) {
      const notification = new Notification({
        notificationMessage: `${user.username} liked your post`,
        user: post.user,
        post: post._id,
        actionBy: req.userId,
      });

      await notification.save();
    }

    res.json(post);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    let post = req.post;
    let user = await User.findById(req.userId);

    let userIndex = post.likes.findIndex(
      (like) => like.toString() == req.userId.toString()
    );
    let postIndex = user.likedPosts.findIndex(
      (like) => like.toString() == post._id.toString()
    );

    post.likes.splice(userIndex, 1);
    user.likedPosts.splice(postIndex, 1);

    post.save();
    user.save();
    // delete notification
    // Notification.deleteOne({ actionBy: req.userId, post: post._id });

    res.json(post);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.commentPosts = async (req, res) => {
  try {
    let post = req.post;
    let user = await User.findById(req.userId);
    let userComment = req.body.comment;
    post.comments.push({
      comment: userComment,
      commentedBy: req.userId,
    });
    user.commentedPosts.push(post._id);

    // adding notification
    if (post.user._id.toString() !== req.userId.toString()) {
      const notification = new Notification({
        notificationMessage: `${user.username} commented on your post : ${userComment}`,
        user: post.user,
        post: post._id,
        actionBy: req.userId,
      });

      await notification.save();
    }

    post.save();
    user.save();
    res.json(post);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      message: "Can't update comment",
    });
  }
};

exports.unCommentPosts = async (req, res) => {
  try {
    let post = req.post;
    let user = await User.findById(req.userId);
    let userIndex = post.comments.findIndex(
      (item) => item._id.toString() == req.params.commentId.toString()
    );
    let postIndex = user.commentedPosts.findIndex(
      (item) => item.toString() === post._id.toString()
    );

    post.comments.splice(userIndex, 1);
    user.commentedPosts.splice(postIndex, 1);

    post.save();
    user.save();

    res.json(post);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// delete post
exports.deletePost = async (req, res) => {
  try {
    let user = await User.findById(req.userId);
    let post = req.post;
    const filteredUser = user.posts.filter(
      (item) => post._id.toString() !== item._id.toString()
    );
    const removedPost = await post.remove();
    if (removedPost === undefined) {
      return res.status(400).json({
        message: "post didn't delete",
      });
    }
    // deleting from cloudinary DB
    cloudinary.v2.uploader.destroy(post.public_id);

    user.posts = filteredUser;

    // deleteting post from user DB
    const savedUser = await user.save();

    if (savedUser === undefined) {
      res.status(400).json({
        message: "post did not delete from the user DB",
      });
    }
    res.json({
      message: "post deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.deleteNotification = async (req, res) => {
  const notificationId = req.params.notificationId;

  try {
    const deletedNotification = await Notification.deleteOne({
      _id: notificationId,
    });
    res.json({
      message: `Notification deleted successfully!`,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Notification didn't delete!",
    });
  }
};
