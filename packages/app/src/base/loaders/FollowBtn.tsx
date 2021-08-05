import React from "react";
import { useAppDispatch } from "../../app/hooks";
import {
  followPerson,
  unfollowPerson,
} from "../../features/person/personSlice";
import { getUserData } from "../../features/userAuth/userSlice";
import useLoader from "./Loader";
interface PropType {
  isFollowing: boolean;
  setIsFollowings: (value: boolean) => void;
  personUsername: string;
}

const FollowBtn: React.FC<PropType> = ({
  isFollowing,
  setIsFollowings,
  personUsername,
}) => {
  const { SmallLoader, smallLoaderDisplay, setSmallLoaderDisplay } =
    useLoader();
  const dispatch = useAppDispatch();
  const unfollow = async () => {
    try {
      setSmallLoaderDisplay("block");
      const res = await dispatch(unfollowPerson(personUsername));
      if (res.payload) dispatch(getUserData());
      setIsFollowings(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSmallLoaderDisplay("none");
    }
  };

  const follow = async () => {
    try {
      setSmallLoaderDisplay("block");
      const res = await dispatch(followPerson(personUsername));
      if (res.payload) dispatch(getUserData());
      setIsFollowings(true);
    } catch (error) {
      console.log(error);
    } finally {
      setSmallLoaderDisplay("none");
    }
  };
  return (
    <div className="mt-5">
      {smallLoaderDisplay === "block" ? (
        <span className="pt-1">
          <SmallLoader />
        </span>
      ) : (
        <span>
          {isFollowing ? (
            <button
              className="flex bg-white text-gray font-bold w-full text-sm px-8 py-2 border-2 border-gray-800 rounded-lg hover:bg-gray-800 hover:text-white"
              onClick={unfollow}
            >
              Unfollow
            </button>
          ) : (
            <button
              className="flex  bg-white text-gray font-bold w-full text-sm px-8 py-2 border-2 rounded-lg border-gray-800 hover:bg-gray-800 hover:text-white"
              onClick={follow}
            >
              Follow
            </button>
          )}
        </span>
      )}
    </div>
  );
};

export default FollowBtn;
