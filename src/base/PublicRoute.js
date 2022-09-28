import React from "react";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("HamroSuperAdminAccessToken");
  return (
    <>
      <Route
        {...rest}
        render={(props) => {
          if (!token) {
            return <Component {...props} />;
          } else {
            return (
              <Redirect
                to={{
                  pathname: "/superadmin",
                  state: {
                    from: props.location,
                  },
                }}
              />
            );
          }
        }}
      />
    </>
  );
};

export default PublicRoute;
