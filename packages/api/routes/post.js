const express = require("express");
const router = express.Router();
const {
  createPost,
  updatePost,
  deletePost,
  findPostById,
} = require("../controllers/post");

// middleware
router.param("postId", findPostById);

router
  .post("/post/create", createPost)
  .post("post/update/:postId", updatePost)
  .delete("/post/delete/:postId", deletePost);

module.exports = router;
