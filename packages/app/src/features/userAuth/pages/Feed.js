import React, { useEffect } from "react";
import Base from "../../../base/Base";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getUserData, selectUser } from "../userSlice";
import { BsFillChatFill } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { Image, Transformation } from "cloudinary-react";
import { fetchJunePosts, selectPost, unlikePost } from "../../post/postSlice";
import { likePost } from "../../post/postSlice";
import { fetchAllUsers } from "../userSlice";
import { Link, useHistory } from "react-router-dom";
import useLoader from "../../../base/loaders/Loader";
import { source } from "./../../../utils";
import { getPerson, selectPerson } from "../../person/personSlice";
import Suggesteduser from "./Suggesteduser";

function Home() {
  const { LoaderComponent, setLoaderDisplay } = useLoader();
  const { user, userStatus } = useAppSelector(selectUser);
  const { person } = useAppSelector(selectPerson);
  const { posts, postStatus } = useAppSelector(selectPost);
  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      if (
        userStatus === "loading" ||
        userStatus === "fetched_userdata" ||
        userStatus === "signed_in" ||
        postStatus === "post_uploaded"
      ) {
        setLoaderDisplay("block");
        try {
          const res = await dispatch(fetchAllUsers());
          if (res.payload) {
            const res1 = await dispatch(fetchJunePosts());
            res1.payload && setLoaderDisplay("none");
          }
        } catch (error) {
          console.log(error);
          setLoaderDisplay("none");
        }
      }
    })();

    return () => {
      source.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, postStatus, userStatus]);

  const isLiked = (post) => post.likes.includes(user._id);

  const likeUnlikePost = async (post) => {
    setLoaderDisplay("block");
    try {
      if (isLiked(post)) {
        const res = await dispatch(unlikePost(post._id));
        if (res.payload) {
          const userData = await dispatch(getUserData());
          if (userData && person) {
            const res1 = await dispatch(getPerson(person.username));
            res1.payload && setLoaderDisplay("none");
          }
        }
      } else {
        const res = await dispatch(likePost(post._id));
        if (res.payload) {
          const userData = await dispatch(getUserData());
          if (userData && person) {
            const res1 = await dispatch(getPerson(person.username));
            res1.payload && setLoaderDisplay("none");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <LoaderComponent />
      <Base className="flex flex-col justify-center ">
        <div className="flex flex-col-reverse sm:flex-row">
          <ul className="flex flex-col flex-grow items-center">
            {posts &&
              posts.map((post) => (
                <li key={post._id}>
                  <div
                    className="m-3 py-2 px-4 border-2 rounded-md"
                    key={post._id}
                  >
                    <Link
                      to={`/person/${post.user.username}`}
                      className="flex  justify-between"
                    >
                      <span className="cursor-pointer my-2 flex items-center">
                        <Image
                          cloudName="june-social"
                          publicId={post.user.profile_photo}
                          width="30"
                          height="30"
                          responsiveUseBreakpoints="true"
                          crop="fill"
                          radius="max"
                        />
                        <p className="ml-2">{post.user.username}</p>
                      </span>
                    </Link>
                    <span className="">
                      <Image
                        cloudName="june-social"
                        loading="lazy"
                        publicId={post.public_id}
                        width="320"
                        height="400"
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
                      {post.likes.length}{" "}
                      {post.likes.length > 1 ? "likes" : "like"}
                    </div>
                  </div>
                </li>
              ))}
          </ul>
          <Suggesteduser />
        </div>
      </Base>
    </>
  );
}

export default Home;
