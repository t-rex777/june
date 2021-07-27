import React, { useState } from "react";
import { Image, Transformation } from "cloudinary-react";
import { AiFillHeart } from "react-icons/ai";
import { BsFillChatFill, BsThreeDotsVertical } from "react-icons/bs";
import { useAppDispatch } from "./../../../app/hooks";
import { likePost, unlikePost } from "./../../post/postSlice";
import { useSelector } from "react-redux";
import { getUserData, selectUser } from "./../userSlice";
import { getPerson, selectPerson } from "../../person/personSlice";
import PostEdit from "./PostEdit";
import { useHistory } from "react-router-dom";
import useLoader from "../../../base/loaders/Loader";

const Posts = ({ personDetails }) => {
  const { LoaderComponent, setLoaderDisplay } = useLoader();
  const dispatch = useAppDispatch();
  const { user } = useSelector(selectUser);
  const { person } = useSelector(selectPerson);
  const history = useHistory();
  const [editCaptionModal, setCaptionModal] = useState(false);
  const [selectEditPost, setEditPost] = useState("");

  const isLiked = (post) => {
    return post.likes.includes(user._id);
  };

  const likeUnlikePost = async (post) => {
    setLoaderDisplay("block")
    try {
      if (isLiked(post)) {
        const res = await dispatch(unlikePost(post._id));
        if (res.payload) {
          const userData = await dispatch(getUserData());
          if (userData && person)
            person && dispatch(getPerson(person.username));
        }
      } else {
        const res = await dispatch(likePost(post._id));
        if (res.payload) {
          const userDetails = await dispatch(getUserData());
          if (userDetails && person) dispatch(getPerson(person.username));
        }
      }
    } catch (error) {
      console.log(error);
    }finally{
      setLoaderDisplay("none")
    }
  };

  return (
    <>
      <LoaderComponent />
      <div className="flex flex-wrap justify-center">
        {personDetails.posts &&
          personDetails.posts.map((post) => (
            <div className="m-3 py-2 px-4 border-2 rounded-md" key={post._id}>
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
                <span
                  className="cursor-pointer my-2 "
                  onClick={() => {
                    setCaptionModal(true);
                    setEditPost(post._id);
                  }}
                >
                  <BsThreeDotsVertical />
                </span>
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
                  <AiFillHeart
                    size="25"
                    color={isLiked(post) ? "red" : "black"}
                  />
                </span>
                <span
                  className="mx-3 my-2 cursor-pointer"
                  onClick={() => {
                    history.push(`/post/${post._id}`);
                  }}
                >
                  <BsFillChatFill size="21" />
                </span>

                {/* <span className="mx-3 my-2 cursor-pointer">
                    <RiSendPlaneFill size="25" />
                  </span> */}
              </div>
              <div>
                {post.likes.length} {post.likes.length > 1 ? "likes" : "like"}
              </div>
            </div>
          ))}
        <>
          {editCaptionModal && personDetails._id === user._id && (
            <span>
              <PostEdit
                postId={selectEditPost}
                setCaptionModal={setCaptionModal}
              />
            </span>
          )}
        </>
      </div>
    </>
  );
};

export default Posts;
