import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Cross from "../../../images/cross.svg";
import { selectUser, updateUser } from "../userSlice";

interface UserProps {
  [index: string]: string; //todo:read more about indexing ts
  email: string;
  username: string;
  name: string;
  bio: string;
}

export const modalStyle: React.CSSProperties = {
  position: "fixed",
  top: "0",
  left: "0",
  backgroundColor: "rgb(0,0,0,0.6)",
  width: "100%",
  height: "100%",
};

interface EditUserType {
  setEditModal: () => void;
}

const EditUser: React.FC<EditUserType> = ({ setEditModal }) => {
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector(selectUser);
  const { user } = userDetails;
  const [userData, setUserData] = useState<UserProps>({
    email: "",
    username: "",
    name: "",
    bio: "",
  });

  const diffMatcher = (
    newData: Record<string, string | number | any>,
    toMatch: Record<string, string | number | any>
  ) => {
    let diffedData: Record<string, any> = {};
    Object.keys(newData).forEach((key) => {
      newData[key] !== toMatch[key] &&
        newData[key].length > 0 &&
        (diffedData[key] = newData[key]);
    });
    return Object.entries(diffedData).length > 0 ? diffedData : null;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = e.target;
    setUserData((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prevData = {
      email: user?.email,
      username: user?.username,
      name: user?.name,
      bio: user?.bio,
    };
    const filteredData = diffMatcher(userData, prevData);
    console.log(filteredData);
    if (filteredData !== null) {
      const res = await dispatch(updateUser(filteredData)); //todo: fix the response
      cancelModal();
      console.log(res);
    }
  };
  const cancelModal = () => {
    setEditModal();
  };
  return (
    <div
      className="flex flex-col justify-center items-center"
      style={modalStyle}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white flex flex-col w-max p-10 rounded-lg z-1"
      >
        <span
          className="flex mx-auto mb-3 cursor-pointer w-max"
          onClick={cancelModal}
        >
          <img src={Cross} alt="cross" />
        </span>
        <h1 className="text-center mb-4 text-2xl font-bold ">Edit Profile</h1>
        <input
          type="text"
          placeholder="username"
          name="username"
          value={userData.username}
          onChange={handleChange}
          className="p-1 m-1 border-2 border-purple-300"
        />
        <input
          type="text"
          placeholder="name"
          name="name"
          value={userData.name}
          onChange={handleChange}
          className="p-1 m-1 border-2 border-purple-300"
        />
        <input
          type="text"
          placeholder="email"
          name="email"
          onChange={handleChange}
          value={userData.email}
          className="p-1 m-1 border-2 border-purple-300"
        />
        <textarea
          placeholder="bio"
          onChange={handleChange}
          value={userData.bio}
          name="bio"
          className="p-1 m-1 border-2 border-purple-300"
        />
        <button
          type="submit"
          className="bg-purple-500 p-1 mt-3 text-white rounded-md"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default EditUser;
