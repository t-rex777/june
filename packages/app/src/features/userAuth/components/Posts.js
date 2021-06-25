import React, { useEffect } from "react";
import { Image } from "cloudinary-react";
import { JuneAPI } from "../../../utils";
import { useSelector } from "react-redux";
import { selectUser, getPosts } from "./../userSlice";
import { AiFillHeart } from "react-icons/ai";
import { BsFillChatFill, BsThreeDotsVertical } from "react-icons/bs";
import { RiSendPlaneFill } from "react-icons/ri";
import { useAppDispatch } from "./../../../app/hooks";

const Posts = () => {
  const dispatch = useAppDispatch();
  const { user, posts } = useSelector(selectUser);

  useEffect(() => {
    dispatch(getPosts())
  }, [dispatch]);
  return (
    
    <div className="flex flex-wrap justify-center">
      {posts &&
        posts.map((imageId, index) => (
          <div className="m-3 py-2 px-4 bg-purple-100 rounded-md">
            <div className="flex justify-between">
              <p>{user.username}</p>
              <span className="cursor-pointer my-2">
                <BsThreeDotsVertical />
              </span>
            </div>
            <Image
              key={index}
              responsive
              cloudName="june-social"
              publicId={imageId}
              width="250"
              height="300"
              responsiveUseBreakpoints="true"
              crop="fill"
            />
            <div>
              <p>

              </p>
            </div>
            <div className="flex flex-start">
              <span className="mx-3 my-2 cursor-pointer">
                <AiFillHeart size="25" />
              </span>
              <span className="mx-3 my-2 cursor-pointer">
                <BsFillChatFill size="21" />
              </span>
              <span className="mx-3 my-2 cursor-pointer">
                <RiSendPlaneFill size="25" />
              </span>
            </div>
          </div>
        ))}
    </div>
  )
};

export default Posts;
