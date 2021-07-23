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
import useLoader from "./../../../base/Loader";
import {
  followPerson,
  getPerson,
  selectPerson,
} from "../../person/personSlice";

function Home() {
  const { LoaderComponent, setLoaderDisplay } = useLoader();
  const { user, allUsers, userStatus } = useAppSelector(selectUser);
  const { person } = useAppSelector(selectPerson);
  const { posts, postStatus } = useAppSelector(selectPost);
  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      if (
        userStatus === "fetched_userdata" ||
        userStatus === "signed_in" ||
        postStatus === "post_uploaded"
      ) {
        setLoaderDisplay("block");
        try {
          const res = await dispatch(fetchAllUsers());
          if (res) dispatch(fetchJunePosts());
        } catch (error) {
          console.log(error);
        } finally {
          setLoaderDisplay("none");
        }
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, postStatus, userStatus]);

  const isLiked = (post) => post.likes.includes(user._id);

  const isFollowed = (person) => person.followers.includes(user._id);

  const likeUnlikePost = async (post) => {
    setLoaderDisplay("block");
    try {
      if (isLiked(post)) {
        const res = await dispatch(unlikePost(post._id));
        if (res) {
          const userData = await dispatch(getUserData());
          if (userData && person) dispatch(getPerson(person.username));
        }
      } else {
        const res = await dispatch(likePost(post._id));
        if (res) {
          const userData = await dispatch(getUserData());
          if (userData && person) dispatch(getPerson(person.username));
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setLoaderDisplay("none");
      }, 600);
    }
  };

  const follow = async (personUsername) => {
    setLoaderDisplay("block");
    try {
      const res = await dispatch(followPerson(personUsername));
      if (res) dispatch(getUserData());
    } catch (error) {
      console.log(error);
    } finally {
      setLoaderDisplay("none");
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
          <aside className="w-auto p-3 flex flex-col items-center sm:border-l">
            <h1 className="text-center font-bold text-gray-500">
              Suggestions for you
            </h1>
            {allUsers &&
              // eslint-disable-next-line array-callback-return
              allUsers.map((person, index) => {
                if (
                  person._id !== user._id &&
                  !isFollowed(person) &&
                  index < 8
                ) {
                  return (
                    <div
                      key={person._id}
                      className="flex justify-between p-3 border mt-2 w-60 "
                    >
                      <Link
                        to={`/person/${person.username}`}
                        className="flex mr-5"
                      >
                        <Image
                          cloudName="june-social"
                          publicId={person.profile_photo}
                          width="30"
                          height="30"
                          responsiveUseBreakpoints="true"
                          crop="fill"
                          radius="max"
                        />
                        <p className="mt-1 ml-2">{person.username}</p>
                      </Link>

                      <button
                        className="bg-gray-600 text-white px-2 py-1 rounded-sm "
                        onClick={() => {
                          follow(person.username);
                        }}
                      >
                        follow
                      </button>
                    </div>
                  );
                }
              })}
          </aside>
        </div>
      </Base>
    </>
  );
}

export default Home;
