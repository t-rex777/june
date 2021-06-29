import React, { useEffect } from "react";
import Base from "../../../base/Base";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchJunePosts, selectUser } from "../userSlice";
import { RiSendPlaneFill } from "react-icons/ri";
import { BsFillChatFill } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { Image } from "cloudinary-react";
import { BsThreeDotsVertical } from "react-icons/bs";

function App() {
  const { junePosts } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(fetchJunePosts());
    }, 1000);
  }, [dispatch]);

  console.log({ junePosts });
  return (
    <Base className="flex flex-col justify-center items-center">
      <ul>
        {junePosts &&
          junePosts.map((post) => (
            <li key={post._id}>
              <div className="m-3 py-2 px-4 border-2 rounded-md" key={post._id}>
                <div className="flex justify-between">
                  <span className="cursor-pointer my-2 ">
                    <p>{post.user.username}</p>
                  </span>
                </div>
                <span className="">
                  <span>{/* <PostEdit/> */}</span>
                  {/*todo: hover and change brightness*/}
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
                      // likeUnlikePost(post);
                    }}
                  >
                    <AiFillHeart
                      size="25"
                      // color={isLiked(post) ? "red" : "black"}
                    />
                  </span>
                  <span
                    className="mx-3 my-2 cursor-pointer"
                    onClick={() => {
                      // setCommentModal(true);
                      // setCommentPost(post);
                    }}
                  >
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
            </li>
          ))}
      </ul>
    </Base>
  );
}

export default App;
