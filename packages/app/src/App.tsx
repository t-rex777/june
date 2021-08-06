import React, { useEffect, Suspense } from "react";
import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom";
import { JuneAPI, setJuneHeader, axiosRequestError } from "./utils";
import { useAppDispatch } from "./app/hooks";
import SuspenseLoader from "./base/loaders/SuspenseLoader";
import useLoader from "./base/loaders/Loader";

// private route
import { PrivateRoute } from "./PrivateRoute";

// slices
import {
  fetchAllUsers,
  getUserData,
  signout,
} from "./features/userAuth/userSlice";
import { getPerson } from "./features/person/personSlice";
import { fetchJunePosts, fetchPostById } from "./features/post/postSlice";

// lazy load components
const Network = React.lazy(
  () => import("./features/userAuth/components/Network")
);
const Signin = React.lazy(() => import("./features/userAuth/pages/Signin"));
const Signup = React.lazy(() => import("./features/userAuth/pages/Signup"));
const Dashboard = React.lazy(
  () => import("./features/userAuth/pages/Dashboard")
);
const PersonPage = React.lazy(() => import("./features/person/PersonPage"));
const Post = React.lazy(() => import("./features/post/NewPost"));
const NotificationPage = React.lazy(
  () => import("./features/notification/NotificationPage.js")
);
const PostComment = React.lazy(() => import("./features/post/PostComment"));
const Feed = React.lazy(() => import("./features/userAuth/pages/Feed.js"));

// invalid route
export const invalidRoute = () => (
  <div className="flex wrap flex-col justify-center items-center text-2xl mt-20">
    <h1>Invalid Route</h1>
    <p>Please check the URL again</p>
  </div>
);

const JuneRoutes: React.FC = () => {
  const { setLoaderDisplay, LoaderComponent } = useLoader();
  const dispatch = useAppDispatch();
  const rToken = localStorage.getItem("__rtoken");
  const history = useHistory();

  useEffect(() => {
    if (rToken !== undefined && typeof rToken === "string") {
      (async () => {
        try {
          setLoaderDisplay("block");
          const response = await JuneAPI.get("/token/refresh", {
            headers: {
              "refresh-token": `Bearer ${rToken}`,
            },
          });
          const { accessToken, refreshToken } = response.data;
          setJuneHeader(accessToken);
          localStorage.setItem("__rtoken", refreshToken);
          const postId = window.location.pathname.split("post/")[1];
          const username = window.location.pathname.split("person/")[1];
          const userData = await dispatch(getUserData());
          if (userData.payload._id) {
            await dispatch(fetchAllUsers());
            await dispatch(fetchJunePosts());
            postId && (await dispatch(fetchPostById(postId)));
            if (username && username === userData.payload.username) {
              history.push("/user/dashboard");
            } else if (username) {
              await dispatch(getPerson(username));
            }
          }
          setLoaderDisplay("none");
        } catch (error) {
          dispatch(signout());
          axiosRequestError(error);
          setLoaderDisplay("none");
        }

        // fetches accessToken token before every 15 mins
        setInterval(async () => {
          const response = await JuneAPI.get("/token/refresh", {
            headers: {
              "refresh-token": `Bearer ${rToken}`,
            },
          });
          const { accessToken, refreshToken } = response.data;
          setJuneHeader(accessToken);
          localStorage.setItem("__rtoken", refreshToken);
        }, 840000);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      <LoaderComponent />
      <Suspense fallback={<SuspenseLoader />}>
        <Switch>
          <Route path="/signin" exact component={Signin} />
          <Route path="/signup" exact component={Signup} />
          <PrivateRoute path="/" exact component={Feed} />
          <PrivateRoute path="/user/dashboard" exact component={Dashboard} />
          <PrivateRoute path="/person/network" exact component={Network} />
          <PrivateRoute
            path="/person/:personUsername"
            exact
            component={PersonPage}
          />
          <PrivateRoute path="/user/newpost" exact component={Post} />
          <PrivateRoute path="/post/:postId" exact component={PostComment} />
          <PrivateRoute
            path="/notifications"
            exact
            component={NotificationPage}
          />
          <Route path="*" exact component={invalidRoute} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

export default JuneRoutes;
