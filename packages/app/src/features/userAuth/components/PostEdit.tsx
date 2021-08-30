import React, { useCallback, useEffect, useState } from "react";
import { modalStyle } from "./EditUser";
import { useAppDispatch } from "./../../../app/hooks";
import { editCaption } from "./../../post/postSlice";
import { getUserData } from "./../userSlice";
interface PropType {
  postId: string;
  setCaptionModal: (value: boolean) => void;
}
const PostEdit: React.FC<PropType> = ({ postId, setCaptionModal }) => {
  const dispatch = useAppDispatch();
  const [caption, setCaption] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCaption(e.target.value);
  };

  const submitCaption = async () => {
    const captionData = {
      postId: postId,
      caption,
    };
    const res = await dispatch(editCaption(captionData));
    if (res) dispatch(getUserData());
    setCaptionModal(false);
  };

  const watchKey = useCallback(
    (e) => {
      if (e.key === "Escape") {
        setCaptionModal(false);
      }
    },
    [setCaptionModal]
  );
  const watchClick = useCallback(
    (e) => {
      if (e.target.classList[0] === "editCaption-modal") {
        setCaptionModal(false);
      }
    },
    [setCaptionModal]
  );

  useEffect(() => {
    document.addEventListener("keydown", watchKey);
    document.addEventListener("click", watchClick);

    return () => {
      document.removeEventListener("keydown", watchKey);
      document.removeEventListener("click", watchClick);
    };
  }, [watchClick, watchKey]);
  return (
    <div
      className="editCaption-modal flex flex-col justify-center items-center"
      style={modalStyle}
    >
      <div className=" bg-white h-max flex flex-col items-center px-10 py-10 w-max rounded-lg z-20 sm:p-20">
        <input
          type="text"
          value={caption}
          onChange={handleChange}
          placeholder="Enter New Caption"
          className="border border-gray-500 h-8 rounded mb-4 p-1 w-full"
        />
        <div className="flex flex-col">
          <button
            onClick={submitCaption}
            className="w-24 h-8 px-1 mb-2 rounded-sm text-white bg-gray-800 hover:bg-gray-600"
          >
            Edit caption
          </button>
          {/* <button className="w-24 h-8 px-1 mb-2 rounded-sm text-sm text-white bg-red-400">
            Delete post
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default PostEdit;
