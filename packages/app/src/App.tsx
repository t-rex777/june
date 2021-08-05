import { getPerson } from "./features/person/personSlice";
import React, { useEffect, Suspense } from "react";
import {
  Redirect,
  BrowserRouter,
  Switch,
  Route,
  RouteComponentProps,
  useHistory,
} from "react-router-dom";
import { useAppDispatch } from "./app/hooks";
import { JuneAPI, setJuneHeader, axiosRequestError } from "./utils";
import {
  fetchAllUsers,
  getUserData,
  signout,
} from "./features/userAuth/userSlice";
import SuspenseLoader from "./base/loaders/SuspenseLoader";
import { fetchJunePosts } from "./features/post/postSlice";
import useLoader from "./base/loaders/Loader";
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

interface PrivateProps {
  path: string;
  exact?: boolean;
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

export const PrivateRoute = (props: PrivateProps) => {
  const rToken = localStorage.getItem("__rtoken");

  if (rToken && typeof rToken === "string") {
    return <Route {...props} />;
  }
  return <Redirect from={props.path} to="/signin" />;
};

export const invalidRoute = () => (
  <div className="flex justify-center mt-20">
    <h1>Invalid Route</h1>
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
          const userData = await dispatch(getUserData());
          await dispatch(fetchAllUsers());
          await dispatch(fetchJunePosts());
          const username = window.location.pathname.split("person/")[1];
          if (username && username === userData.payload.username) {
            history.push("/user/dashboard");
          } else if (username) {
            await dispatch(getPerson(username));
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
