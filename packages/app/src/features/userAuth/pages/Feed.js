import React, { useEffect } from "react";
import Base from "../../../base/Base";
import { useAppSelector } from "../../../app/hooks";
import { fetchJunePosts, selectPost } from "../../post/postSlice";
import useLoader from "../../../base/loaders/Loader";
import Suggesteduser from "./Suggesteduser";
import Card from "../components/Card";
import { fetchAllUsers, selectUser } from "./../userSlice";
import { useAppDispatch } from "./../../../app/hooks";

function Home() {
  const { LoaderComponent } = useLoader();
  const { posts } = useAppSelector(selectPost);
  const { allUsers } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  useEffect(() => {
    (async () => {
      await dispatch(fetchAllUsers());
      await dispatch(fetchJunePosts());
    })();
  }, [allUsers, posts]);
  return (
    <>
      <LoaderComponent />
      <Base className="flex flex-col justify-center ">
        <div className="flex flex-col-reverse sm:flex-row">
          <div className="flex flex-col flex-grow items-center">
            {posts &&
              posts.map((post) => (
                <Card
                  key={post._id}
                  personDetails={post.user}
                  post={post}
                  edit={false}
                  feed={true}
                />
              ))}
          </div>
          <Suggesteduser />
        </div>
      </Base>
    </>
  );
}

export default Home;
