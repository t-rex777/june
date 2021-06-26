import React from "react";
import { Image } from "cloudinary-react";
import { useSelector } from "react-redux";
import { selectUser } from "./../userSlice";
import { AiFillHeart } from "react-icons/ai";
import { BsFillChatFill, BsThreeDotsVertical } from "react-icons/bs";
import { RiSendPlaneFill } from "react-icons/ri";
import PostEdit from "./PostEdit";

const Posts = () => {
  const { user } = useSelector(selectUser);

  return (
    <div className="flex flex-wrap justify-start">
      {user.posts &&
        user.posts.map((post, index) => (
          <div className="m-3 py-2 px-4 border-2 rounded-md" key={index}>
            <div className="flex justify-between">
              <p>{user.username}</p>
              <span className="cursor-pointer my-2 ">
                <BsThreeDotsVertical />
              </span>
            </div>
            <span className="hover:filter brightness-75">
              <span> 
              {/* <PostEdit/> */}
              </span>
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
            <div>{post.likes.length} likes</div>
          </div>
        ))}
    </div>
  );
};

export default Posts;
