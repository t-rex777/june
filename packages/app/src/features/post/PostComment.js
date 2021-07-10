import React, { useState } from "react";
import { Image } from "cloudinary-react";
import { useAppSelector } from "../../app/hooks";
import { fetchPostById, selectPost } from "./postSlice";
import { Link, useParams } from "react-router-dom";
import { getPerson, selectPerson } from "./../person/personSlice";
import { selectUser } from "./../userAuth/userSlice";
import { AiFillDelete } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { BsFillChatFill } from "react-icons/bs";
import { RiSendPlaneFill } from "react-icons/ri";
import { useEffect } from "react";
import { useAppDispatch } from "./../../app/hooks";
import Loader from "./../../base/Loader";

function PostComment() {
  const { post } = useAppSelector(selectPost);
  const { person, personStatus } = useAppSelector(selectPerson);
  const { user, userStatus } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const { postId } = useParams();
  const isLiked = (post) => post.likes.includes(user._id);
  const [userComment, setUserComment] = useState({
    postId: "",
    comment: "",
  });

  const handleChange = (e) => {
    setUserComment({ postId: post._id, comment: e.target.value });
  };

  const deleteComment = () => {};
  const likeUnlikePost = () => {};
  const submitComment = () => {};

  useEffect(() => {
    if (userStatus === "fetched_userdata") dispatch(fetchPostById(postId));
  }, [dispatch, postId, userStatus]);
  return (
    <div>
      {post ? (
        <div className="overflow-y-auto bg-white h-3/4 flex flex-col items-center w-max p-5 rounded-lg z-20 sm:flex-row  sm:p-10">
          <div className="">
            <Image
              cloudName="june-social"
              publicId={post.public_id}
              width={window.innerWidth < 400 ? "83" : "250"}
              height={window.innerWidth < 400 ? "100" : "300"}
              responsiveUseBreakpoints="true"
              crop="fill"
            />
          </div>
          <div className="flex flex-col ml-5">
            <Link to={`/person/${post.user.username}`} className="flex mt-3 ">
              <span>
                <Image
                  cloudName="june-social"
                  publicId={post.user.profile_photo}
                  width="30"
                  height="30"
                  responsiveUseBreakpoints="true"
                  crop="fill"
                  radius="max"
                />
              </span>

              <p className="mb-3 ml-2 mt-1 font-bold">{post.user.username}</p>
            </Link>
            <hr />
            <ul
              className=" overflow-auto	scrollbar sm:h-44"
              id="style-2"
              style={{ maxHeight: "200px" }}
            >
              {post.comments.map((item) => (
                <li className="flex justify-between my-2" key={item._id}>
                  <span className="flex justify-between align-center">
                    <Link
                      to={`/person/${item.commentedBy.username}`}
                      className="flex"
                    >
                      <Image
                        cloudName="june-social"
                        publicId={item.commentedBy.profile_photo}
                        width="30"
                        height="30"
                        responsiveUseBreakpoints="true"
                        crop="fill"
                        radius="max"
                      />
                      <p className="mt-1 ml-1 font-bold">
                        {item.commentedBy.username}
                      </p>
                    </Link>
                    <p className="mt-1 ml-2">{item.comment}</p>
                  </span>
                  <span
                    className={`mt-2 cursor-pointer ${
                      item.commentedBy._id !== user._id && "hidden"
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
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default PostComment;
