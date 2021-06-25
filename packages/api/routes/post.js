const express = require("express");
const router = express.Router();
const {
  createPost,
  updatePost,
  deletePost,
  findPostById,
  getPostPic,
  uploadPost,
} = require("../controllers/post");

// middleware
router.param("postId", findPostById);

router
  .post("/post/upload", uploadPost)
  .get("/post/photo/:postId", getPostPic)
  .post("/post/create", createPost)
  .put("/post/update/:postId", updatePost)
  .delete("/post/delete/:postId", deletePost);

module.exports = router;
