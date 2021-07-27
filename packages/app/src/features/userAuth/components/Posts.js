import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "./../userSlice";
import PostEdit from "./PostEdit";
import Card from "./Card";

const Posts = ({ personDetails }) => {
  const { user } = useSelector(selectUser);
  const [editCaptionModal, setCaptionModal] = useState(false);
  const [selectEditPost, setEditPost] = useState("");

  return (
    <>
      {/* <LoaderComponent /> */}
      <div className="flex flex-wrap justify-center">
        {personDetails.posts &&
          personDetails.posts.map((post) => (
            <Card
              personDetails={personDetails}
              post={post}
              setEditPost={setEditPost}
              setCaptionModal={setCaptionModal}
            />
          ))}
        <>
          {editCaptionModal && personDetails._id === user._id && (
            <span>
              <PostEdit
                postId={selectEditPost}
                setCaptionModal={setCaptionModal}
              />
            </span>
          )}
        </>
      </div>
    </>
  );
};

export default Posts;
