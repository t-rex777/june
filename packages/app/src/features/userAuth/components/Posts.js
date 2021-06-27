import React, { useEffect } from "react";
import { Image } from "cloudinary-react";
import { AiFillHeart } from "react-icons/ai";
import { BsFillChatFill, BsThreeDotsVertical } from "react-icons/bs";
import { RiSendPlaneFill } from "react-icons/ri";
import PostEdit from "./PostEdit";
import { useAppDispatch } from "./../../../app/hooks";
import { likePost, selectPost, unlikePost } from "./../../post/postSlice";
import { useSelector } from "react-redux";
import { getUserData, selectUser } from "./../userSlice";
import Loader from "./../../../base/Loader";
import { getPerson, selectPerson } from "../../person/personSlice";

const Posts = ({ userDetails }) => {
  const dispatch = useAppDispatch();
  const { user } = useSelector(selectUser);
  const { person } = useSelector(selectPerson);
  const { postStatus } = useSelector(selectPost);
  useEffect(() => {}, []);

  const isLiked = (post) => {
    return post.likes.includes(user._id);
  };

  const likeUnlikePost = (post) => {
    try {
      if (isLiked(post)) {
        dispatch(unlikePost(post._id));
        setTimeout(() => {
          dispatch(getUserData());
          person && dispatch(getPerson(person.username));
        }, 500);
      } else {
        dispatch(likePost(post._id));
        setTimeout(() => {
          dispatch(getUserData());
          person && dispatch(getPerson(person.username));
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {postStatus !== "posts_loading" ? (
        <div className="flex flex-wrap justify-start">
          {userDetails.posts &&
            userDetails.posts.map((post) => (
              <div className="m-3 py-2 px-4 border-2 rounded-md" key={post._id}>
                <div className="flex justify-between">
                  <p>{userDetails.username}</p>
                  <span className="cursor-pointer my-2 ">
                    <BsThreeDotsVertical />
                  </span>
                </div>
                <span className="hover:filter brightness-75">
                  <span>{/* <PostEdit/> */}</span>
                  {/*todo: hover and change brightness*/}
                  <Image
                    cloudName="june-social"
                    publicId={post.public_id}
                    width="250"
                    height="300"
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
                  <span className="mx-3 my-2 cursor-pointer">
                    <BsFillChatFill size="21" />
                  </span>
                  <span className="mx-3 my-2 cursor-pointer">
                    <RiSendPlaneFill size="25" />
                  </span>
                </div>
                <div>{post.likes.length} likes</div>
              </div>
            ))}
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Posts;
