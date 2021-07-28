import React, { useEffect } from "react";
import Base from "../../../base/Base";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectUser } from "../userSlice";
import { fetchJunePosts, selectPost } from "../../post/postSlice";
import { fetchAllUsers } from "../userSlice";
import useLoader from "../../../base/loaders/Loader";
import { source } from "./../../../utils";
import Suggesteduser from "./Suggesteduser";
import Card from "../components/Card";

function Home() {
  const { LoaderComponent, setLoaderDisplay } = useLoader();
  const { userStatus } = useAppSelector(selectUser);
  const { posts, postStatus } = useAppSelector(selectPost);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      if (
        userStatus === "loading" ||
        userStatus === "fetched_userdata" ||
        userStatus === "signed_in" ||
        postStatus === "post_uploaded"
      ) {
        try {
          setLoaderDisplay("block");
          const res = await dispatch(fetchAllUsers());
          console.log(res.payload);
          if (res.payload) {
            const res1 = await dispatch(fetchJunePosts());
            res1.payload && setLoaderDisplay("none");
          }
        } catch (error) {
          console.log(error);
          setLoaderDisplay("none");
        }
      }
    })();

    return () => {
      source.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
