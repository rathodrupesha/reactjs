import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({
  component: Component,
  allowCondition,
  redirectionPath,
  ...rest
}) => {
  const token =
    allowCondition !== undefined
      ? allowCondition
      : localStorage.getItem("HamroSuperAdminAccessToken");
  return (
    <Route
      {...rest}
      render={(props) =>
        token ? (
          <Route {...rest} component={Component} />
        ) : (
          <Redirect
            to={{
              pathname: redirectionPath ?? "/",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;
