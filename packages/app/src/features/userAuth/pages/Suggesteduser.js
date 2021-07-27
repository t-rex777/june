import React from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectUser, getUserData } from "./../userSlice";
import { useAppDispatch } from "./../../../app/hooks";
import { followPerson } from "../../person/personSlice";
import useLoader from "./../../../base/loaders/Loader";
import { Link } from "react-router-dom";
import { Image } from "cloudinary-react";

function Suggesteduser() {
  const { setLoaderDisplay } = useLoader();
  const { user, allUsers } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const isFollowed = (person) => person.followers.includes(user._id);

  const follow = async (personUsername) => {
    try {
      setLoaderDisplay("block");
      const res = await dispatch(followPerson(personUsername));
      if (res.payload) {
        const res1 = await dispatch(getUserData());
        res1 && setLoaderDisplay("none");
      }
    } catch (error) {
      console.log(error);
      setLoaderDisplay("none");
    }
  };
  return (
    <aside className="w-auto p-3 flex flex-col items-center sm:border-l">
      <h1 className="text-center font-bold text-gray-500">
        Suggestions for you
      </h1>
      {user &&
        allUsers &&
        // eslint-disable-next-line array-callback-return
        allUsers.map((person, index) => {
          if (person._id !== user._id && !isFollowed(person) && index < 8) {
            return (
              <div
                key={person._id}
                className="flex justify-between p-3 border mt-2 w-60 "
              >
                <Link to={`/person/${person.username}`} className="flex mr-5">
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
  );
}

export default Suggesteduser;
