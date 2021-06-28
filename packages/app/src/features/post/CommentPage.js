import React from "react";
import { modalStyle } from "../userAuth/pages/EditUser";
import { Image } from "cloudinary-react";
import { RiSendPlaneFill } from "react-icons/ri";
import { BsFillChatFill } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";

function CommentPage({ post, userDetails }) {
  return (
    <div
      className="flex flex-col justify-center items-center"
      style={modalStyle}
    >
      <div className="bg-white flex flex-col w-max p-10 rounded-lg z-1 sm:flex-row">
        <div>
          <Image
            cloudName="june-social"
            publicId={"june_gallary/lwk0ogyfegz6kovimw1a"}
            width="250"
            height="300"
            responsiveUseBreakpoints="true"
            crop="fill"
          />
        </div>
        <div className="flex flex-col ml-5">
          <p>{userDetails.username}</p>
          <ul>
            {post.comments.map(comment=>(
              <li key={comment._id}>{comment}</li>
            ))}
          </ul>

          <div className="flex flex-start">
            <span className="mr-3 my-2 cursor-pointer">
              <AiFillHeart size="25" />
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
        </div>
      </div>
    </div>
  );
}

export default CommentPage;
