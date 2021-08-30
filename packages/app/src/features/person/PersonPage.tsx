import React, { useEffect, useState } from "react";
import ProfilePic from "./../userAuth/components/ProfilePic";
import Base from "../../base/Base";
import Posts from "./../userAuth/components/Posts";
import NoPosts from "./../userAuth/components/NoPosts";
import { useSelector } from "react-redux";
import { getPerson, selectPerson } from "./personSlice";
import { useAppDispatch } from "../../app/hooks";
import { useHistory, useParams } from "react-router-dom";
import { paramsType } from "./personTypes";
import { selectUser } from "./../userAuth/userSlice";
import useLoader from "../../base/loaders/Loader";
import FollowBtn from "../../base/loaders/FollowBtn";

const Dashboard: React.FC = () => {
  const history = useHistory();
  const { LoaderComponent, setLoaderDisplay } = useLoader();
  const { personUsername } = useParams<paramsType>();
  const { person } = useSelector(selectPerson);
  const { user } = useSelector(selectUser);
  const dispatch = useAppDispatch();

  const [isFollowing, setIsFollowings] = useState(false);

  useEffect(() => {
    if (personUsername === user?.username) {
      history.push("/user/dashboard");
    }
    (async () => {
      setLoaderDisplay("block");
      try {
        await dispatch(getPerson(personUsername));
        setLoaderDisplay("none");
      } catch (error) {
        console.log(error);
        setLoaderDisplay("none");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personUsername]);

  useEffect(() => {
    user &&
      person &&
      user.followings.includes(person._id) &&
      setIsFollowings(true);
  }, [user, person]);

  return (
    <>
      <LoaderComponent />
      <Base className="">
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
                <p className="text-md">{person?.bio}</p>
              </span>
              <div className="flex justify-center  w-1/2 ">
                <FollowBtn
                  personPage={true}
                  isFollowing={isFollowing}
                  personUsername={personUsername}
                  setIsFollowings={setIsFollowings}
                />
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
    </>
  );
};

export default Dashboard;
