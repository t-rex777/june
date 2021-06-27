import React, { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { uploadPost } from "./postSlice";
import { postInput } from "./postTypes";
import Base from "../../base/Base";

const NewPost: React.FC= () => {
  const dispatch = useAppDispatch();

  const [post, setPost] = useState<postInput>({
    caption: "",
    photo: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
      const postFile = {
        caption: post.caption,
        photo: reader.result,
      };
      dispatch(uploadPost(postFile));
    };
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    console.log({ name, value, files });
    if (files) 
    setSelectedFile((files as FileList)[0]);
    setPost((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };
  return (
    <Base className="flex flex-col justify-center items-center pt-28">
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
          className="bg-purple-700 text-white font-bold border-2 border-purple-700 m-2 p-1 rounded-md hover:bg-purple-500 hover:border-purple-500"
        >
          Upload
        </button>
      </form>
    </Base>
  );
};

export default NewPost;
