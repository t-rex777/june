/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Base from "../../../base/Base";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchJunePosts, getUserData, selectUser } from "../userSlice";
import { RiSendPlaneFill } from "react-icons/ri";
import { BsFillChatFill } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { Image } from "cloudinary-react";
import { selectPost, unlikePost } from "../../post/postSlice";
import {
  followPerson,
  getPerson,
  selectPerson,
} from "../../person/personSlice";
import { likePost } from "../../post/postSlice";
import CommentPage from "../../post/CommentPage";
import Loader from "../../../base/Loader";
import { fetchAllUsers } from "../userSlice";
import { unfollowPerson } from "../../person/personSlice";
import { Link } from "react-router-dom";

function Home() {
  const { user, allUsers, junePosts, userStatus } = useAppSelector(selectUser);
  const { person, personStatus } = useAppSelector(selectPerson);
  const { postStatus } = useAppSelector(selectPost);
  const dispatch = useAppDispatch();

  const [commentModal, setCommentModal] = useState(false);
  const [commentPost, setCommentPost] = useState("");
  const [userForModal, setUserForModal] = useState("");

  useEffect(() => {
    if (
      userStatus === "fetched_userdata" ||
      userStatus === "signed_in" ||
      postStatus === "post_uploaded"
    ) {
      dispatch(fetchAllUsers());
    }
    if (userStatus === "fetched_allusers") {
      dispatch(fetchJunePosts());
    }
  }, [dispatch, postStatus, userStatus]);

  const isLiked = (post) => post.likes.includes(user._id);

  const isFollowed = (person) => person.followers.includes(user._id);

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

  const unfollow = async (personUsername) => {
    try {
      const res = await dispatch(unfollowPerson(personUsername));
      if (res) dispatch(getUserData());
    } catch (error) {
      console.log(error);
    }
  };

  const follow = async (personUsername) => {
    try {
      const res = await dispatch(followPerson(personUsername));
      if (res) dispatch(getUserData());
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Base className="flex flex-col justify-center ">
      {
      !user ||
      postStatus === "posts_loading" ||
      userStatus === "loading" ||
      userStatus === "signed_out" ||
      personStatus === "loading" ? (
        <Loader />
      ) : (
        <div className="flex flex-col-reverse sm:flex-row">
          <ul className="flex flex-col flex-grow items-center">
            {junePosts &&
              junePosts.map((post) => (
                <li key={post._id}>
                  <div
                    className="m-3 py-2 px-4 border-2 rounded-md"
                    key={post._id}
                  >
                    <Link
                      to={`/person/${post.user.username}`}
                      className="flex  justify-between"
                    >
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
                        <p className="ml-2">{post.user.username}</p>
                      </span>
                    </Link>
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
                          setUserForModal(post.user);
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
            <>
              {commentModal && (
                <CommentPage
                  setCommentModal={setCommentModal}
                  post={commentPost}
                  personDetails={userForModal}
                  isLiked={isLiked}
                  likeUnlikePost={likeUnlikePost}
                />
              )}
            </>
          </ul>
          <aside className="w-auto p-3 flex flex-col items-center sm:border-l">
            <h1 className="text-center font-bold text-gray-500">
              Suggestions for you
            </h1>
            {allUsers &&
              // eslint-disable-next-line array-callback-return
              allUsers.map((person, index) => {
                if (
                  person._id !== user._id &&
                  !isFollowed(person) &&
                  index < 5
                ) {
                  return (
                    <div
                      key={person._id}
                      className="flex justify-between p-3 border mt-2 w-60 "
                    >
                      <Link
                        to={`/person/${person.username}`}
                        className="flex mr-5"
                      >
                        <Image
                          cloudName="june-social"
                          publicId={person.profile_photo}
                          width="30"
                          height="30"
                          responsiveUseBreakpoints="true"
                          crop="fill"
                          radius="max"
                        />
                        <p className="mt-1 ml-2">{person.username}</p>
                      </Link>

                      <button
                        className="bg-gray-600 text-white px-2 py-1 rounded-sm "
                        onClick={() => {
                          follow(person.username);
                        }}
                      >
                        follow
                      </button>
                    </div>
                  );
                }
              })}
          </aside>
        </div>
      )}
    </Base>
  );
}

export default Home;
