const Post = require("../models/post");
const User = require("../models/user");
const formidable = require("formidable");
const fs = require("fs");
const { extend } = require("lodash");

// middleware
exports.findPostById = async (req, res, next, postId) => {
  try {
    let post = await Post.findById(postId);
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

// read posts

// create post
exports.createPost = async (req, res) => {
  try {
    let user = await User.findById(req.userId);
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
          message: "problem with the image",
        });
      }

      const post = new Post(fields);

      // checking if the photo is not too big
      if (file.photo) {
        if (file.photo.size > 3000000) {
          return res.status(400).json({
            message: "Photo size is too big",
          });
        }
        post.photo.data = fs.readFileSync(file.photo.path);
        post.photo.contentType = file.photo.type;

        const savedPost = await post.save();
        if (savedPost === undefined) {
          return res.status(400).json({
            message: "post didn't save",
          });
        }

        user.posts.push(savedPost);
        const savedUser = await user.save();
        if (savedPost === undefined) {
          return res.status(400).json({
            message: "post didn't save to user",
          });
        }
        return res.json(savedPost);
      }
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

// update post
exports.updatePost = async (req, res) => {
  try {
    let user = await User.findById(req.userId);
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
          message: "problem with the image",
        });
      }

      let post = req.post;
      post = extend(post, fields);

      // checking if the photo is not too big
      if (file.photo) {
        if (file.photo.size > 3000000) {
          return res.status(400).json({
            message: "Photo size is too big",
          });
        }
        post.photo.data = fs.readFileSync(file.photo.path);
        post.photo.contentType = file.photo.type;

        const savedPost = await post.save();
        if (savedPost === undefined) {
          return res.status(400).json({
            message: "post didn't save",
          });
        }

        user.posts.push(savedPost);
        const savedUser = await user.save();
        if (savedPost === undefined) {
          return res.status(400).json({
            message: "post didn't save to user",
          });
        }
        return res.json(savedPost);
      }
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

// delete post
exports.deletePost = async (req, res) => {
  try {
    let user = await User.findById(req.userId);
    let post = req.post;
    console.log(post._id);
    const filteredUser = user.posts.filter(
      (item) => post._id.toString() !== item._id.toString()
    );
    const removedPost = await post.remove();
    if (removedPost === undefined) {
      return res.status(400).json({
        message: "post didn't delete",
      });
    }
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
