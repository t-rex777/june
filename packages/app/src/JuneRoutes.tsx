import React, { useEffect } from "react";
import {
  Redirect,
  BrowserRouter,
  Switch,
  Route,
  RouteComponentProps,
} from "react-router-dom";
import App from "./App";
import Signin from "./features/userAuth/pages/Signin";
import Signup from "./features/userAuth/pages/Signup";
import Dashboard from "./features/userAuth/pages/Dashboard";
import { useAppDispatch } from "./app/hooks";
import { JuneAPI, setJuneHeader, axiosRequestError } from "./utils";
import { getUserData } from "./features/userAuth/userSlice";

const rToken = localStorage.getItem("__rtoken");

interface PrivateProps {
  path: string;
  exact?: boolean;
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

export const PrivateRoute = (props: PrivateProps) => {
  return rToken !== undefined && typeof rToken === "string" ? (
    <Route {...props} />
  ) : (
    <Redirect to="/signin" />
  );
  //
};

const JuneRoutes: React.FC = () => {
  const dispatch = useAppDispatch();

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
          axiosRequestError(error);
        }
      })();
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/signin" exact component={Signin} />
        <Route path="/signup" exact component={Signup} />
        <PrivateRoute path="/user/dashboard" exact component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
};

export default JuneRoutes;
