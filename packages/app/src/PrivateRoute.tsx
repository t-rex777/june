import React from 'react'
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';

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