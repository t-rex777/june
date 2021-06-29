export const isLiked = (post,userId) => {
    return post.likes.includes(userId);
  };

  