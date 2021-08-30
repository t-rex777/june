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
      <div className="flex flex-wrap justify-center">
        {personDetails.posts &&
          personDetails.posts.map((post) => (
            <Card
              key={post._id}
              personDetails={personDetails}
              post={post}
              setEditPost={setEditPost}
              setCaptionModal={setCaptionModal}
              edit={true}
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
  );
};

export default Posts;
