import React, { useEffect, useState } from "react";
import Base from "../../../base/Base";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchJunePosts, getUserData, selectUser } from "../userSlice";
import { RiSendPlaneFill } from "react-icons/ri";
import { BsFillChatFill } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { Image } from "cloudinary-react";
import { selectPost, unlikePost } from "../../post/postSlice";
import { getPerson, selectPerson } from "../../person/personSlice";
import { likePost } from "./../../post/postSlice";
import CommentPage from "./../../post/CommentPage";
import Loader from "./../../../base/Loader";

function App() {
  const { user, junePosts, userStatus } = useAppSelector(selectUser);
  const { person, personStatus } = useAppSelector(selectPerson);
  const { postStatus } = useAppSelector(selectPost);
  const dispatch = useAppDispatch();

  const [commentModal, setCommentModal] = useState(false);
  const [commentPost, setCommentPost] = useState("");

  useEffect(() => {
    if (userStatus === "fetched_userdata") dispatch(fetchJunePosts());
  }, [dispatch, userStatus]);

  const isLiked = (post) => {
    return post.likes.includes(user._id);
  };

  const likeUnlikePost = async (post) => {
    try {
      if (isLiked(post)) {
        const res = await dispatch(unlikePost(post._id));
        if (res) {
          const userData = await dispatch(getUserData());
          if (userData && person) dispatch(getPerson(person.username));
        }
      } else {
        const res = await dispatch(likePost(post._id));
        if (res) {
          const userData = await dispatch(getUserData());
          if (userData && person) dispatch(getPerson(person.username));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Base className="flex flex-col justify-center items-center">
      {postStatus !== "posts_loading" ||
      userStatus !== "loading" ||
      personStatus !== "loading" ? (
        <ul>
          {junePosts &&
            junePosts.map((post) => (
              <li key={post._id}>
                <div
                  className="m-3 py-2 px-4 border-2 rounded-md"
                  key={post._id}
                >
                  <div className="flex justify-between">
                    <span className="cursor-pointer my-2 flex items-center">
                      <Image
                        cloudName="june-social"
                        publicId={post.user.profile_photo}
                        width="30"
                        height="30"
                        responsiveUseBreakpoints="true"
                        crop="fill"
                        radius="max"
                      />
                      <p>{post.user.username}</p>
                    </span>
                  </div>
                  <span className="">
                    <Image
                      cloudName="june-social"
                      publicId={post.public_id}
                      width="320"
                      height="400"
                      responsiveUseBreakpoints="true"
                      crop="fill"
                    />
                  </span>
                  <div>
                    <p className="my-1">{post.caption}</p>
                  </div>
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
                    <span
                      className="mx-3 my-2 cursor-pointer"
                      onClick={() => {
                        setCommentModal(true);
                        setCommentPost(post);
                      }}
                    >
                      <BsFillChatFill size="21" />
                    </span>

                    <span className="mx-3 my-2 cursor-pointer">
                      <RiSendPlaneFill size="25" />
                    </span>
                  </div>
                  <div>
                    {post.likes.length}{" "}
                    {post.likes.length > 1 ? "likes" : "like"}
                  </div>
                </div>
              </li>
            ))}
          {/* <>
            {commentModal && (
              <CommentPage
                setCommentModal={setCommentModal}
                post={commentPost}
                // userDetails={userDetails}
                isLiked={isLiked}
                likeUnlikePost={likeUnlikePost}
              />
            )}
          </> */}
        </ul>
      ) : (
        <Loader />
      )}
    </Base>
  );
}

export default App;
