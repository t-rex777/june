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
import { TiDeleteOutline } from "react-icons/ti";
import { AiFillHeart } from "react-icons/ai";
import { BsFillChatFill } from "react-icons/bs";
import { useEffect } from "react";
import { useAppDispatch } from "./../../app/hooks";
import Base from "./../../base/Base";
import { getPerson, selectPerson } from "../person/personSlice";
import useLoader from "../../base/loaders/Loader";

function PostComment() {
  const {
    LoaderComponent,
    setLoaderDisplay,
    SmallLoader,
    setSmallLoaderDisplay,
  } = useLoader();
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
      setSmallLoaderDisplay("block");
      const reqIds = {
        postId,
        commentId,
      };
      const res = await dispatch(uncommentPost(reqIds));
      if (res.payload) {
        const userData = await dispatch(getUserData());
        if (userData && person) await dispatch(getPerson(person.username));
        setSmallLoaderDisplay("none");
      }
    } catch (error) {
      console.log(error);
      setSmallLoaderDisplay("none");
    }
  };
  const likeUnlikePost = async (post) => {
    try {
      setSmallLoaderDisplay("block");
      if (isLiked(post)) {
        const res = await dispatch(unlikePost(post._id));
        if (res.payload) {
          const userData = await dispatch(getUserData());
          if (userData && person)
            if (person) await dispatch(getPerson(person.username));
          setSmallLoaderDisplay("none");
        }
      } else {
        const res = await dispatch(likePost(post._id));
        if (res.payload) {
          const userDetails = await dispatch(getUserData());
          if (userDetails && person) {
            await dispatch(getPerson(person.username));
          }
          setSmallLoaderDisplay("none");
        }
      }
    } catch (error) {
      console.log(error);
      setSmallLoaderDisplay("none");
    }
  };
  const submitComment = async (e) => {
    e.preventDefault();
    setUserComment({
      postId: "",
      comment: "",
    });
    try {
      setSmallLoaderDisplay("block");
      const res = await dispatch(commentPost(userComment));
      if (res.payload) {
        await dispatch(fetchPostById(postId));
        const userData = await dispatch(getUserData());
        if (userData && person) await dispatch(getPerson(person.username));
        setSmallLoaderDisplay("none");
      }
    } catch (error) {
      console.log(error);
      setSmallLoaderDisplay("none");
    }
  };
  useEffect(() => {
    (async () => {
      try {
        setLoaderDisplay("block");
        const res = dispatch(fetchPostById(postId));
        (await res).payload &&
            setLoaderDisplay("none");
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
          <div className="flex flex-col items-center mt-10 h-max  border border-gray-300 sm:flex-row sm:justify-center sm:items-start ">
            <div className="m-3 ">
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
            <div className="flex flex-col grow h-full items-stretch border max-w-sm border-gray-300 py-4">
              <div className="flex px-4">
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
                  <Link to={`/person/${post.user.username}`}>
                    <p className="mb-3 ml-2 mt-1 font-bold">
                      {post.user.username}
                    </p>
                  </Link>

                  <p className="mb-3 ml-2 mt-1 w-full text-sm text-gray-400">
                    {post.caption}
                  </p>
                </span>
              </div>

              <ul
                className="overflow-auto px-5	w-full h-full scrollbar border-t border-gray-300"
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
                      <TiDeleteOutline color="#FF616D" />
                    </span>
                  </li>
                ))}
              </ul>
              <div className="px-2	border-t border-gray-300">
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
                <div className="text-sm text-gray-400 mt-2">
                  {new Date(post.updatedAt).toLocaleDateString()}
                </div>

                <form onSubmit={submitComment} className="mt-2 flex w-full">
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
