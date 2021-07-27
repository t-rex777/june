import React from "react";
import { Image } from "cloudinary-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Transformation } from "cloudinary-react";
import { AiFillHeart } from "react-icons/ai";
import { BsFillChatFill } from "react-icons/bs";
import { useHistory } from "react-router-dom";
import { useAppDispatch } from "./../../../app/hooks";
import { useSelector } from "react-redux";
import { getUserData, selectUser } from "./../userSlice";
import { getPerson, selectPerson } from "../../person/personSlice";
import useLoader from "../../../base/loaders/Loader";
import { fetchJunePosts, likePost, unlikePost } from "./../../post/postSlice";

function Card({
  personDetails,
  post,
  setEditPost,
  setCaptionModal,
  edit,
  feed,
}) {
  const history = useHistory();
  const { SmallLoader, setSmallLoaderDisplay } = useLoader();
  const dispatch = useAppDispatch();
  const { user } = useSelector(selectUser);
  const { person } = useSelector(selectPerson);

  const isLiked = (post) => {
    return post.likes.includes(user._id);
  };

  const likeUnlikePost = async (post) => {
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
      feed && (await dispatch(fetchJunePosts()));
      setSmallLoaderDisplay("none");
    }
  };

  return (
    <div className="m-3 py-2 px-4 border-2 rounded-md">
      <div className="flex justify-between mb-2">
        <span className="flex">
          <Image
            cloudName="june-social"
            publicId={personDetails.profile_photo}
            width="30"
            height="30"
            responsiveUseBreakpoints="true"
            crop="fill"
            radius="max"
          />
          <p className="mt-1 ml-2">{personDetails.username}</p>
        </span>

        {edit && user._id === personDetails._id && (
          <span
            className="cursor-pointer my-2 "
            onClick={() => {
              setCaptionModal(true);
              setEditPost(post._id);
            }}
          >
            <BsThreeDotsVertical />
          </span>
        )}
      </div>
      <span className="hover:filter brightness-75">
        <Image
          cloudName="june-social"
          publicId={post.public_id}
          loading="lazy"
          width="250"
          height="300"
          responsiveUseBreakpoints="true"
          crop="fill"
        >
          <Transformation quality="auto" fetchFormat="auto" />
        </Image>
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
          <AiFillHeart size="25" color={isLiked(post) ? "red" : "black"} />
        </span>
        <span
          className="mx-3 my-2 cursor-pointer"
          onClick={() => {
            history.push(`/post/${post._id}`);
          }}
        >
          <BsFillChatFill size="21" />
        </span>
        <span className="mx-3 my-2 cursor-pointer">
          <SmallLoader />
        </span>

        {/* <span className="mx-3 my-2 cursor-pointer">
              <RiSendPlaneFill size="25" />
            </span> */}
      </div>
      <div>
        {post.likes.length} {post.likes.length > 1 ? "likes" : "like"}
      </div>
    </div>
  );
}

export default Card;
