import React, { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { selectPost, uploadPost } from "./postSlice";
import { PostInput } from "./postTypes";
import Base from "../../base/Base";
import { useSelector } from "react-redux";
import Loader from "../../base/Loader";
import { getUserData, selectUser } from "./../userAuth/userSlice";
import useToast from "./../../base/Toast";

const NewPost: React.FC = () => {
  const { ToastComponent, setToast } = useToast();
  const dispatch = useAppDispatch();
  const { postStatus } = useSelector(selectPost);
  const { userStatus } = useSelector(selectUser);
  const [post, setPost] = useState<PostInput>({
    caption: "",
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
        if (res) {
          dispatch(getUserData());
          setPost({
            caption: "",
          });
        }
        setToast("Post uploaded successfully!", "success");
      };
    } catch (error) {
      console.log(error);
      setToast("Something went wrong, try again!", "error");
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
    <>
      <Base className="flex flex-col justify-center items-center pt-28">
        {postStatus !== "posts_loading" || userStatus === "loading" ? (
          <>
            <ToastComponent />
            <h1 className="font-bold text-3xl">Upload a new post</h1>
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
                onChange={handleChange}
                className="m-2 p-1 rounded-sm"
              />
              <button
                type="submit"
                disabled={post.caption === "" ? true : false}
                className="bg-purple-700 text-white font-bold border-2 border-purple-700 m-2 p-1 rounded-md disabled:opacity-30"
              >
                Upload
              </button>
            </form>
          </>
        ) : (
          <Loader />
        )}
      </Base>
    </>
  );
};

export default NewPost;
