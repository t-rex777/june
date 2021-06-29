import React, { useEffect, useState, useCallback } from "react";
import { modalStyle } from "../userAuth/pages/EditUser";
import { Image } from "cloudinary-react";
import { RiSendPlaneFill } from "react-icons/ri";
import { BsFillChatFill } from "react-icons/bs";
import { AiFillHeart, AiFillDelete } from "react-icons/ai";
import { useAppDispatch } from "./../../app/hooks";
import { commentPost, uncommentPost } from "./postSlice";
import { getUserData } from "../userAuth/userSlice";
import { getPerson, selectPerson } from "../person/personSlice";
import { useSelector } from "react-redux";
import { selectUser } from "./../userAuth/userSlice";
import "./scrollbar.css"

function CommentPage({
  post,
  userDetails,
  setCommentModal,
  isLiked,
  likeUnlikePost,
}) {
  const { person } = useSelector(selectPerson);
  const { user } = useSelector(selectUser);
  const dispatch = useAppDispatch();
  const [userComment, setUserComment] = useState({
    postId: "",
    comment: "",
  });

  const handleChange = (e) => {
    setUserComment({ postId: post._id, comment: e.target.value });
  };
  const submitComment = async (e) => {
    e.preventDefault();
    dispatch(commentPost(userComment));
    setTimeout(() => {
      dispatch(getUserData());
      person && dispatch(getPerson(person.username));
    }, 500);
    setUserComment("");
  };

  const deleteComment = (postId, commentId) => {
    try {
      dispatch(uncommentPost(postId, commentId));
      setTimeout(() => {
        dispatch(getUserData());
        person && dispatch(getPerson(person.username));
      }, 500);
    } catch (error) {
      console.log(error);
    }
  };
  const watchKey = useCallback(
    (e) => {
      if (e.key === "Escape") {
        setCommentModal(false);
      }
    },
    [setCommentModal]
  );
  const watchClick = useCallback(
    (e) => {
      if (e.target.classList[0] === "comment-modal") {
        setCommentModal(false);
      }
    },
    [setCommentModal]
  );

  useEffect(() => {
    document.addEventListener("keydown", watchKey);
    document.addEventListener("click", watchClick);

    return () => {
      document.removeEventListener("keydown", watchKey);
      document.removeEventListener("click", watchClick);
    };
  }, [watchClick, watchKey]);
  return (
    <div
      className="comment-modal flex flex-col justify-center items-center"
      style={modalStyle}
    >
      <div className="bg-white h-max flex flex-col items-center w-max p-10 rounded-lg z-20 sm:flex-row">
        <div className="">
          <Image
            cloudName="june-social"
            publicId={post.public_id}
            width={window.innerWidth<400 ? "83" : "250"}
            height={window.innerWidth<400 ? "100" : "300"}
            responsiveUseBreakpoints="true"
            crop="fill"
          />
        </div>
        <div className="flex flex-col ml-5">
          <p className="mb-3 text-center">{userDetails.username}</p>
          <hr />
          <ul className="h-44 overflow-auto	scrollbar" id="style-2">
            {post.comments.map((item) => (
              <li className="flex justify-between my-2" key={item._id}>
                {item.comment}
                <span
                  className={`mt-1 cursor-pointer ${
                    item.commentedBy !== user._id && "hidden"
                  }`}
                  onClick={() => {
                    deleteComment(post._id, item._id);
                  }}
                >
                  <AiFillDelete color="#FF616D" />
                </span>
              </li>
            ))}
          </ul>
          <div>
            <div className="flex flex-start">
              <span
                className="mr-3 my-2 cursor-pointer"
                onClick={() => {
                  likeUnlikePost(post);
                }}
              >
                <AiFillHeart
                  size="25"
                  color={isLiked(post) ? "red" : "black"}
                />
              </span>
              <span className="mx-3 my-2 cursor-pointer">
                <BsFillChatFill size="21" />
              </span>
              <span className="mx-3 my-2 cursor-pointer">
                <RiSendPlaneFill size="25" />
              </span>
            </div>
            <div>
              {post.likes.length} {post.likes.length > 1 ? "likes" : "like"}
            </div>
            <hr />
            <form onSubmit={submitComment}>
              <input
                type="text"
                value={userComment.comment}
                onChange={handleChange}
                placeholder="add a comment"
                className="p-1 outline-none"
              />
              <button type="submit" className="font-bold text-purple-600">
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentPage;