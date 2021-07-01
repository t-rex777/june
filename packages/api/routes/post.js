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
  commentPosts,
  unCommentPosts,
  getNotificationsById,
  getJunePosts,
} = require("../controllers/post");

// middleware
router.param("postId", findPostById);

router
  .get("/posts", getPosts)
  .get("/juneposts", getJunePosts)
  .post("/post/upload", uploadPost)
  .post("/post/comment/:postId", commentPosts)
  .post("/post/uncomment/:postId/:commentId", unCommentPosts)
  .patch("/post/update/caption/:postId", updateCaption)
  .patch("/post/like/:postId", likePost)
  .patch("/post/unlike/:postId", unlikePost)
  .delete("/post/delete/:postId", deletePost)

  .get("/usernotifications", getNotificationsById);
module.exports = router;
