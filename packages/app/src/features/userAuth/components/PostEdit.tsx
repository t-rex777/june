import React from "react";
import { modalStyle } from "../pages/EditUser";
const PostEdit: React.FC = () => {
  return (
    <div
      className="flex flex-col justify-center items-center"
      style={modalStyle}
    >
      <button className="w-24 h-8 px-1 mb-2 rounded-sm text-white bg-yellow-400">
        Edit caption
      </button>
      <button className="w-24 h-8 px-1 mb-2 rounded-sm text-white bg-red-400">
        Delete post
      </button>
    </div>
  );
};

export default PostEdit;
