import React, { useEffect, Suspense } from "react";
import {
  Redirect,
  BrowserRouter,
  Switch,
  Route,
  RouteComponentProps,
} from "react-router-dom";
import { useAppDispatch } from "./app/hooks";
import { JuneAPI, setJuneHeader, axiosRequestError } from "./utils";
import { getUserData, signout } from "./features/userAuth/userSlice";
import Loader from "./base/Loader";
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
  const dispatch = useAppDispatch();
  const rToken = localStorage.getItem("__rtoken");

  useEffect(() => {
    if (rToken !== undefined && typeof rToken === "string") {
      (async () => {
        try {
          const response = await JuneAPI.get("/token/refresh", {
            headers: {
              "refresh-token": `Bearer ${rToken}`,
            },
          });
          const { accessToken, refreshToken } = response.data;
          setJuneHeader(accessToken);
          localStorage.setItem("__rtoken", refreshToken);
          await dispatch(getUserData());
        } catch (error) {
          dispatch(signout());
          axiosRequestError(error);
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
  }, [dispatch, rToken]);

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
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
