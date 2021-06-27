const express = require("express");
const router = express.Router();
const {
  createPost,
  updatePost,
  deletePost,
  findPostById,
  uploadPost,
  updateCaption,
  getPosts,
  likePost,
  unlikePost,
} = require("../controllers/post");

// middleware
router.param("postId", findPostById);

router
  .get("/posts", getPosts)
  .post("/post/upload", uploadPost)
  .patch("/post/update/caption/:postId", updateCaption) //todo:
  .patch("/post/update/like/:postId", likePost)
  .patch("/post/update/unlike/:postId", unlikePost)
  .delete("/post/delete/:postId", deletePost);

module.exports = router;
