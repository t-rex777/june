import React from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../userSlice";
import useLoader from "../../../base/loaders/Loader";
import SuggestedUserCard from "./SuggestedUserCard";
import { Image } from "cloudinary-react";

function Suggesteduser() {
  const { LoaderComponent } = useLoader();
  const { user, allUsers } = useAppSelector(selectUser);
  const isFollowed = (person) => person.followers.includes(user._id);

  return (
    <>
      <LoaderComponent />

      <aside className="w-auto p-3 flex flex-col items-center sm:border-l">
        <header
          className="hidden flex-col justify-center items-center mt-2 mb-10 gap-y-2 font-extrabold
        sm:flex "
        >
          <Image
            cloudName="june-social"
            publicId={user?.profile_photo}
            width="100"
            height="100"
            responsiveUseBreakpoints="true"
            crop="fill"
            radius="max"
          />
          <p className="text-gray-500 font-bold">{user?.username}</p>
          <p className="text-sm text-gray-500 font-normal">{user?.email}</p>
          <p className="text-lg font-bold">{user?.name}</p>
        </header>
        <h1 className="text-center font-bold text-gray-500">
          Suggestions for you
        </h1>
        {user &&
          allUsers &&
          // eslint-disable-next-line array-callback-return
          allUsers.map((person, index) => {
            if (person._id !== user._id && !isFollowed(person) && index < 8) {
              return (
                <div key={person._id} className="flex justify-between w-full ">
                  <SuggestedUserCard person={person} />
                  {/* <Link
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
                      isFollowing={isFollowed(person)}
                      personUsername={person.username}
                      personPage={false}
                    />
                  </span> */}
                </div>
              );
            }
          })}
      </aside>
    </>
  );
}

export default Suggesteduser;
