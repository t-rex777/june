import React, { useState } from "react";
import Base from "./../../../base/Base";
import { useSelector } from "react-redux";
import { selectUser } from "../userSlice";
import Posts from "./../components/Posts.js";
import NoPosts from "./../components/NoPosts";
import EditUser from "./EditUser";

interface Props {}

const Dashboard: React.FC<Props> = () => {
  const { user } = useSelector(selectUser);

  const [editModal, setEditModal] = useState<Boolean>(false);

  const closeModal = () => {
    setEditModal(false);
  };
  return (
    <Base className="">
      <div className="flex justify-center my-2  ">
        <span className="self-center w-20 mr-4 sm:w-32 md:w-40">
          <img
            src="https://avatars0.githubusercontent.com/u/56619260?v=4"
            alt="profile_pic"
            className=" rounded-full mr-5 p-1 border-2 border-purple-400 "
          />
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
              {user?.followers} followers
            </p>
            <p className="self-center mx-2 text-sm sm:text-xl">
              {user?.followings} followings
            </p>
          </span>
          <span className="flex flex-col mx-2 mt-3">
            <p className="sm:text-xl">{user?.name}</p>
            <p className="sm:text-xl">{user?.bio}</p>
          </span>
          <div className="flex justify-center  w-1/2 ">
            <button
              className=" text-purple-500 font-bold w-full text-sm p-1 mt-3 rounded-lg hover:bg-purple-100 border-2 border-purple-400"
              onClick={() => {
                setEditModal(true);
              }}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
      <hr style={{ border: "solid 1px #C4B5FD", marginTop: "1rem" }} />
      <div className="flex justify-center my-5 p-4">
        {user?.posts ? <Posts /> : <NoPosts />}
      </div>
      {editModal && <EditUser setEditModal={() => closeModal()} />}
    </Base>
  );
};

export default Dashboard;
