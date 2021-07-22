import React, { useEffect, useState } from "react";
import Base from "../../../base/Base";
import { useSelector } from "react-redux";
import { selectUser } from "../userSlice";
import Posts from "./../components/Posts.js";
import NoPosts from "./../components/NoPosts";
import EditUser from "../components/EditUser";
import ProfilePic from "./../components/ProfilePic";
import Loader from "../../../base/Loader";
import useToast from "./../../../base/Toast";

const Dashboard: React.FC = () => {
  const { ToastComponent, setToast } = useToast();
  const { user, userStatus } = useSelector(selectUser);
  const [loading, setLoading] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);

  const closeModal = () => {
    setEditModal(false);
  };
  useEffect(() => {
    user && userStatus !== "loading" ? setLoading(false) : setLoading(true);
    (userStatus !== "loading" && userStatus === "signed_in") ||
      (userStatus !== "loading" &&
        userStatus === "fetched_userdata" &&
        setToast("Logged In", "success"));
  }, [user, userStatus]);
  return (
    <Base className="">
      {loading && <Loader />}
      <>
        <ToastComponent />
        <div className="flex justify-center my-2  ">
          <span className="self-center w-20 mr-4 sm:w-32 md:w-40">
            <ProfilePic user_profile_pic={user?.profile_photo} />
          </span>
          <div className="self-center">
            <p className="text-lg font-bold ml-1 sm:text-3xl mb-2">
              {user?.username}
            </p>

            <span className="flex justify-evenly">
              <p className="self-center mx-2 text-sm sm:text-xl">
                {user?.posts.length} posts
              </p>
              <p className="self-center mx-2 text-sm sm:text-xl">
                {user?.followers.length} followers
              </p>
              <p className="self-center mx-2 text-sm sm:text-xl">
                {user?.followings.length} followings
              </p>
            </span>
            <span className="flex flex-col mx-2 mt-3">
              <p className="sm:text-xl">{user?.name}</p>
              <p className="text-md">{user?.bio}</p>
            </span>
            <div className="flex justify-center  w-1/2 ">
              <button
                className=" text-gray-500 font-bold w-full text-sm p-1 mt-3 rounded-lg hover:bg-gray-300 border-2 border-gray-400"
                onClick={() => {
                  setEditModal(true);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
        <hr style={{ border: "solid 1px gray", marginTop: "1rem" }} />
        <div className="flex justify-center my-5 p-4">
          {user && user?.posts.length > 0 ? (
            <Posts personDetails={user} />
          ) : (
            <NoPosts />
          )}
        </div>
        {editModal && <EditUser setEditModal={() => closeModal()} />}
      </>
    </Base>
  );
};

export default Dashboard;
