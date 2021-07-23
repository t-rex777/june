import React, { useEffect, useState } from "react";
import ProfilePic from "./../userAuth/components/ProfilePic";
import Base from "../../base/Base";
import Posts from "./../userAuth/components/Posts";
import NoPosts from "./../userAuth/components/NoPosts";
import { useSelector } from "react-redux";
import {
  followPerson,
  unfollowPerson,
  getPerson,
  selectPerson,
} from "./personSlice";
import { useAppDispatch } from "../../app/hooks";
import { useParams } from "react-router-dom";
import { paramsType } from "./personTypes";
import { getUserData, selectUser } from "./../userAuth/userSlice";
import useLoader from "../../base/Loader";

const Dashboard: React.FC = () => {
  const {LoaderComponent,setLoaderDisplay} = useLoader()
  const { personUsername } = useParams<paramsType>();
  const { person, personStatus } = useSelector(selectPerson);
  const { user, userStatus } = useSelector(selectUser);
  const dispatch = useAppDispatch();

  const [isFollowing, setIsFollowings] = useState(false);

  useEffect(() => {
    dispatch(getPerson(personUsername));
  }, [dispatch, personUsername]);

  useEffect(() => {
    user &&
      person &&
      user.followings.includes(person._id) &&
      setIsFollowings(true);
  }, [user, person]);

  const unfollow = async () => {
    try {
      const res = await dispatch(unfollowPerson(personUsername));
      if (res) dispatch(getUserData());
      setIsFollowings(false);
    } catch (error) {
      console.log(error);
    }
  };

  const follow = async () => {
    try {
      const res = await dispatch(followPerson(personUsername));
      if (res) dispatch(getUserData());
      setIsFollowings(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Base className="">
      {user &&
      person &&
      personStatus !== "loading" &&
      userStatus !== "loading" ?  setLoaderDisplay("none") : setLoaderDisplay("block")}
        <>
        <LoaderComponent/>
          <div className="flex justify-center my-2  ">
            <span className="self-center w-20 mr-4 sm:w-32 md:w-40">
              <ProfilePic user_profile_pic={person?.profile_photo} />
            </span>
            <div className="self-center">
              <p className="text-lg font-bold ml-1 sm:text-3xl mb-2">
                {person?.username}
              </p>
              <span className="flex justify-evenly">
                <p className="self-center mx-2 text-sm sm:text-xl">
                  {person?.posts.length} posts
                </p>
                <p className="self-center mx-2 text-sm sm:text-xl">
                  {person?.followers.length} followers
                </p>
                <p className="self-center mx-2 text-sm sm:text-xl">
                  {person?.followings.length} followings
                </p>
              </span>
              <span className="flex flex-col mx-2 mt-3">
                <p className="sm:text-xl">{person?.name}</p>
                <p className="text-md">{person?.bio}</p>
              </span>
              <div className="flex justify-center  w-1/2 ">
                {isFollowing ? (
                  <button
                    className=" bg-purple-500 text-white font-bold w-full
                 text-sm p-1 mt-3 rounded-lg hover:bg-purple-400"
                    onClick={unfollow}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    className=" bg-purple-500 text-white font-bold w-full
                 text-sm p-1 mt-3 rounded-lg hover:bg-purple-400"
                    onClick={follow}
                  >
                    Follow
                  </button>
                )}
              </div>
            </div>
          </div>
          <hr style={{ border: "solid 1px gray", marginTop: "1rem" }} />
          <div className="flex justify-center my-5 p-4">
            {person && person?.posts.length > 0 ? (
              <Posts personDetails={person} />
            ) : (
              <NoPosts />
            )}
          </div>
        </>
    </Base>
  );
};

export default Dashboard;
