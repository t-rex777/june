import React from "react";
import { Image } from "cloudinary-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Transformation } from "cloudinary-react";
import { BsFillChatFill } from "react-icons/bs";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "./../userSlice";
import LikeBtn from "../../../base/loaders/LikeBtn";

function Card({
  personDetails,
  post,
  setEditPost,
  setCaptionModal,
  edit,
  feed,
}) {
  const history = useHistory();
  const { user } = useSelector(selectUser);

  return (
    <div className="m-3 py-2 px-4 border-2 rounded-md">
      <div className="flex justify-between mb-2">
        <Link to={`/person/${personDetails.username}`}>
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
        </Link>

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
      <span className="">
        <Image
          cloudName="june-social"
          publicId={post.public_id}
          loading="lazy"
          width={feed ? "450" : "250"}
          height={feed ? "500" : "300"}
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
        <LikeBtn post={post} feed={feed} />
        <span
          className="mx-3 my-2 cursor-pointer"
          onClick={() => {
            history.push(`/post/${post._id}`);
          }}
        >
          <BsFillChatFill size="21" />
        </span>

      </div>
      <div>
        {post.likes.length} {post.likes.length > 1 ? "likes" : "like"}
      </div>
      <div className="text-sm text-gray-400 mt-2">
        {new Date(post.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
}

export default Card;
