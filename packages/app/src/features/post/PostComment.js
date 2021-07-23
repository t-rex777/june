import { useState, useRef } from "react";
import { Image, Transformation } from "cloudinary-react";
import { useAppSelector } from "../../app/hooks";
import {
  commentPost,
  fetchPostById,
  likePost,
  selectPost,
  uncommentPost,
  unlikePost,
} from "./postSlice";
import { Link, useParams } from "react-router-dom";
import { getUserData, selectUser } from "./../userAuth/userSlice";
import { AiFillDelete } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { BsFillChatFill } from "react-icons/bs";
import { useEffect } from "react";
import { useAppDispatch } from "./../../app/hooks";
import Base from "./../../base/Base";
import { getPerson, selectPerson } from "../person/personSlice";
import useLoader from "./../../base/Loader";

function PostComment() {
  const { LoaderComponent, setLoaderDisplay } = useLoader();
  const { post } = useAppSelector(selectPost);
  const { person } = useAppSelector(selectPerson);
  const { user } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const { postId } = useParams();
  const commentRef = useRef();
  const isLiked = (post) => post.likes.includes(user._id);
  const [userComment, setUserComment] = useState({
    postId: "",
    comment: "",
  });

  const handleChange = (e) => {
    setUserComment({ postId: post._id, comment: e.target.value });
  };

  const deleteComment = async (postId, commentId) => {
    try {
      setLoaderDisplay("block");
      const reqIds = {
        postId,
        commentId,
      };
      const res = await dispatch(uncommentPost(reqIds));
      if (res) {
        const userData = await dispatch(getUserData());
        if (userData && person) await dispatch(getPerson(person.username));
      }
      setLoaderDisplay("none");
    } catch (error) {
      console.log(error);
      setLoaderDisplay("none");
    }
  };
  const likeUnlikePost = async (post) => {
    try {
      setLoaderDisplay("block");
      if (isLiked(post)) {
        const res = await dispatch(unlikePost(post._id));
        if (res) {
          const userData = await dispatch(getUserData());
          if (userData && person)
            if (person) await dispatch(getPerson(person.username));
        }
        setLoaderDisplay("none");
      } else {
        const res = await dispatch(likePost(post._id));
        if (res) {
          const userDetails = await dispatch(getUserData());
          if (userDetails && person) {
            await dispatch(getPerson(person.username));
          }
        }
      }
      setLoaderDisplay("none");
    } catch (error) {
      console.log(error);
      setLoaderDisplay("none");
    }
  };
  const submitComment = async (e) => {
    e.preventDefault();
    setUserComment({
      postId: "",
      comment: "",
    });
    try {
      setLoaderDisplay("block");
      const res = await dispatch(commentPost(userComment));
      if (res) {
        await dispatch(fetchPostById(postId));
        const userData = await dispatch(getUserData());

        if (userData && person) dispatch(getPerson(person.username));
      }
      setLoaderDisplay("none");
    } catch (error) {
      console.log(error);
      setLoaderDisplay("none");
    }
  };
  useEffect(() => {
    (async () => {
      try {
        setLoaderDisplay("block");
        const res = dispatch(fetchPostById(postId));
        res &&
          setTimeout(() => {
            setLoaderDisplay("none");
          }, 500);
      } catch (error) {
        setLoaderDisplay("none");
        console.log(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  return (
    <>
      <LoaderComponent />
      {post && (
        <Base className="flex justify-center">
          <div className="flex flex-col items-center mt-10 h-max w-max border-2 border-gray-500 sm:flex-row sm:justify-center sm:items-start sm:gap-10">
            <div className="border-r-2 border-gray-500">
              <Image
                cloudName="june-social"
                publicId={post.public_id}
                width={window.innerWidth < 400 ? "250" : "500"}
                height={window.innerWidth < 400 ? "300" : "600"}
                responsiveUseBreakpoints="true"
                crop="fill"
              >
                <Transformation quality="auto" fetchFormat="auto" />
              </Image>
            </div>
            <div className="flex flex-col items-start py-4 px-2 sm:pr-8">
              <div className="flex mt-3 ">
                <Link to={`/person/${post.user.username}`}>
                  <Image
                    cloudName="june-social"
                    publicId={post.user.profile_photo}
                    width="30"
                    height="30"
                    responsiveUseBreakpoints="true"
                    crop="fill"
                    radius="max"
                  />
                </Link>
                <span className="flex flex-col ">
                  <p className="mb-3 ml-2 mt-1 font-bold">
                    {post.user.username}
                  </p>
                  <p className="mb-3 -ml-6 mt-1 text-lg">{post.caption}</p>
                </span>
              </div>

              <ul
                className=" overflow-auto	w-full h-full scrollbar border-t-2 border-gray-300"
                id="style-2"
                style={{ maxHeight: "360px" }}
              >
                {post.comments.map((item) => (
                  <li className="flex justify-between my-2" key={item._id}>
                    <span className="flex justify-between ">
                      <Link
                        to={`/person/${item.commentedBy.username}`}
                        className="h-12 w-12"
                      >
                        <Image
                          cloudName="june-social"
                          publicId={item.commentedBy.profile_photo}
                          width="30"
                          height="30"
                          responsiveUseBreakpoints="true"
                          crop="fill"
                          radius="max"
                        />
                      </Link>

                      <span>
                        <p className="mt-1 ml-1 font-bold h-min-w-0">
                          {item.commentedBy.username}
                        </p>
                        <p className="mt-1 ml-2">{item.comment}</p>
                      </span>
                    </span>
                    <span
                      className={`mt-2 ml-2 cursor-pointer ${
                        item.commentedBy._id !== user._id && "hidden"
                      }`}
                      onClick={() => {
                        deleteComment(post._id, item._id);
                      }}
                    >
                      <AiFillDelete color="#FF616D" />
                    </span>
                  </li>
                ))}
              </ul>
              <div>
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
                    onClick={() => {
                      commentRef.current.focus();
                    }}
                    className="mx-3 my-2 cursor-pointer"
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
                <hr className="w-full  border-t-2 border-gray-300 mt-1" />
                <form onSubmit={submitComment} className="mt-2 flex">
                  <input
                    type="text"
                    ref={commentRef}
                    value={userComment.comment}
                    onChange={handleChange}
                    placeholder="add a comment"
                    className="p-1 outline-none"
                  />
                  <button
                    type="submit"
                    className="font-bold text-purple-600 border border-purple-500 rounded px-3 py-1 hover:bg-purple-500 hover:text-white"
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Base>
      )}
    </>
  );
}

export default PostComment;
