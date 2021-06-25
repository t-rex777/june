const express = require("express");
const router = express.Router();
const {
  createPost,
  updatePost,
  deletePost,
  findPostById,
  getPostPic,
  uploadPost,
  updateCaption,
  getPosts,
} = require("../controllers/post");

// middleware
router.param("postId", findPostById);

router
  .get("/posts",getPosts)
  .post("/post/upload", uploadPost)
  .put("/post/update/caption/:postId", updateCaption)
  .delete("/post/delete/:postId", deletePost);

module.exports = router;
