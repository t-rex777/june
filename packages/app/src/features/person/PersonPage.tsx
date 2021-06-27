import React, { useEffect } from "react";
import ProfilePic from "./../userAuth/components/ProfilePic";
import Base from "./../../base/Base";
import Posts from "./../userAuth/components/Posts";
import NoPosts from "./../userAuth/components/NoPosts";
import { useSelector } from "react-redux";
import { followPerson, getPerson, selectPerson } from "./personSlice";
import { useAppDispatch } from "../../app/hooks";
import { useParams } from "react-router-dom";
import { paramsType } from "./personTypes";
import { getUserData, selectUser } from "./../userAuth/userSlice";
import { isFollowing } from "./helper";
import { UserType } from "./../userAuth/userTypes";

const Dashboard: React.FC = () => {
  const { personUsername } = useParams<paramsType>();
  const { person, status } = useSelector(selectPerson);
  const { user } = useSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "idle") {
      setTimeout(() => {
        dispatch(getPerson(personUsername));
      }, 500);
    }
  }, [dispatch, personUsername, status]);

  const followThePerson = () => {
    try {
      dispatch(followPerson(personUsername));
      dispatch(getUserData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Base className="">
      {person && (
        <>
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
                <p className="sm:text-xl">{person?.bio}</p>
              </span>
              <div className="flex justify-center  w-1/2 ">
                <button
                  className=" bg-purple-500 text-white font-bold w-full
                 text-sm p-1 mt-3 rounded-lg hover:bg-purple-400"
                  onClick={followThePerson}
                >
                  {isFollowing(user as UserType, person)
                    ? "Unfollow"
                    : "Follow"}
                </button>
              </div>
            </div>
          </div>
          <hr style={{ border: "solid 1px #C4B5FD", marginTop: "1rem" }} />
          <div className="flex justify-center my-5 p-4">
            {person?.posts ? <Posts user={person} /> : <NoPosts />}
          </div>
        </>
      )}
    </Base>
  );
};

export default Dashboard;
