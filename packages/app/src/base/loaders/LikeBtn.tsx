import React from "react";
import { AiFillHeart } from "react-icons/ai";
import useLoader from "./Loader";
import { useAppDispatch } from "./../../app/hooks";
import {
  fetchJunePosts,
  likePost,
  unlikePost,
} from "./../../features/post/postSlice";
import { getUserData } from "../../features/userAuth/userSlice";
import { useSelector } from "react-redux";
import { selectPerson } from "../../features/person/personSlice";
import { getPerson } from "./../../features/person/personSlice";
import { selectUser } from "./../../features/userAuth/userSlice";
import { PostType } from "./../../features/userAuth/userTypes";

interface PropType {
  post: PostType;
  feed: boolean;
}

function LikeBtn({ post, feed }: PropType) {
  const { SmallLoader, smallLoaderDisplay, setSmallLoaderDisplay } =
    useLoader();
  const { person } = useSelector(selectPerson);
  const { user } = useSelector(selectUser);
  const isLiked = (post: PostType) => {
    return post.likes.includes(user?._id);
  };
  const dispatch = useAppDispatch();
  const likeUnlikePost = async (post: PostType) => {
    setSmallLoaderDisplay("block");
    try {
      if (isLiked(post)) {
        const res = await dispatch(unlikePost(post._id));
        if (res.payload) {
          const userData = await dispatch(getUserData());
          if (userData && person)
            person && (await dispatch(getPerson(person.username)));
        }
      } else {
        const res = await dispatch(likePost(post._id));
        if (res.payload) {
          const userDetails = await dispatch(getUserData());
          if (userDetails && person) await dispatch(getPerson(person.username));
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSmallLoaderDisplay("none");
      await dispatch(fetchJunePosts());
    }
  };
  return (
    <>
      {smallLoaderDisplay === "block" ? (
        <span className="mr-3 my-2">
          <SmallLoader />
        </span>
      ) : (
        <span
          className="mr-3 my-2 cursor-pointer"
          onClick={() => {
            likeUnlikePost(post);
          }}
        >
          <AiFillHeart size="25" color={isLiked(post) ? "red" : "black"} />
        </span>
      )}
    </>
  );
}

export default LikeBtn;
