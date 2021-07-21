import React, { useEffect } from "react";
import {
  Redirect,
  BrowserRouter,
  Switch,
  Route,
  RouteComponentProps,
  useLocation,
  useHistory,
} from "react-router-dom";
import Feed from "./features/userAuth/pages/Feed.js";
import Signin from "./features/userAuth/pages/Signin";
import Signup from "./features/userAuth/pages/Signup";
import Dashboard from "./features/userAuth/pages/Dashboard";
import PersonPage from "./features/person/PersonPage";
import { useAppDispatch } from "./app/hooks";
import { JuneAPI, setJuneHeader, axiosRequestError } from "./utils";
import { getUserData, signout } from "./features/userAuth/userSlice";
import Post from "./features/post/NewPost";
import NotificationPage from "./features/notification/NotificationPage.js";
import PostComment from "./features/post/PostComment";

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
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    console.log(location.pathname)
    // if (!search) return;
    // const token = search.split("?auth_success=")[1];
    // console.log({token})
    // if (!token) return history.push("/signin");
    // (() => {
    //   try {
    //     localStorage.setItem("param", token);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // })();
  }, []);

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
    </BrowserRouter>
  );
};

export default JuneRoutes;
