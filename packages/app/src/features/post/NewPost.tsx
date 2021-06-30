import React, { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { selectPost, uploadPost } from "./postSlice";
import { postInput } from "./postTypes";
import Base from "../../base/Base";
import { useSelector } from "react-redux";
import Loader from "./../../base/Loader";
import { Redirect } from "react-router-dom";
import { getUserData, selectUser } from "./../userAuth/userSlice";

const NewPost: React.FC = () => {
  const dispatch = useAppDispatch();
  const { postStatus } = useSelector(selectPost);
  const { userStatus } = useSelector(selectUser);
  const [shouldRedirect, setRedirect] = useState<Boolean>(false);
  const [post, setPost] = useState<postInput>({
    caption: "",
    photo: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedFile) return;
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = async () => {
        const postFile = {
          caption: post.caption,
          photo: reader.result,
        };
        const res = await dispatch(uploadPost(postFile));
        if (res) dispatch(getUserData());
        setRedirect(true);
      };
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) setSelectedFile((files as FileList)[0]);
    setPost((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };
  return (
    <Base className="flex flex-col justify-center items-center pt-28">
      {shouldRedirect && <Redirect to="/user/dashboard" />}
      {postStatus !== "posts_loading" || userStatus === "loading" ? (
        <>
          <h1 className="font-bold text-3xl">Upload a new Post</h1>
          <form
            onSubmit={submitPost}
            className="flex flex-col my-10 py-3 bg-purple-400 rounded-md xsm:p-3"
          >
            <input
              type="text"
              name="caption"
              value={post.caption}
              onChange={handleChange}
              placeholder="caption"
              className="m-2 p-1 rounded-sm"
            />
            <input
              type="file"
              name="photo"
              value={post.photo}
              onChange={handleChange}
              className="m-2 p-1 rounded-sm"
            />
            <button
              type="submit"
              disabled={post.photo === "" ? true : false}
              className="bg-purple-700 text-white font-bold border-2 border-purple-700 m-2 p-1 rounded-md disabled:opacity-50"
            >
              Upload
            </button>
          </form>
        </>
      ) : (
        <Loader />
      )}
    </Base>
  );
};

export default NewPost;
