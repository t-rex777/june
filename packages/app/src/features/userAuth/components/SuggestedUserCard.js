import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Image } from "cloudinary-react";
import FollowBtn from "../../../base/loaders/FollowBtn";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "./../userSlice";

function SuggestedUserCard({ person }) {
  const [isFollowing, setIsFollowings] = useState(false);
  const { user } = useAppSelector(selectUser);
  useEffect(() => {
    person && user.followings.includes(person._id) && setIsFollowings(true);
  }, [user, person]);
  return (
    <div className="flex justify-between p-3 border mt-2 w-full" style={{minWidth:"280px"}}>
      <Link
        to={`/person/${person.username}`}
        className="flex items-center mr-5"
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
      <span className="-mt-5">
        <FollowBtn
          isFollowing={isFollowing}
          personUsername={person.username}
          setIsFollowings={setIsFollowings}
          personPage={false}
        />
      </span>
    </div>
  );
}

export default SuggestedUserCard;
