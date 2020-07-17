import React from "react";

import { getCurrentUser } from "../services/auth.service";

import { Route, Redirect } from "react-router-dom";
import Login from "../components/User/Login";

function PrivateRoute({ component: Component, ...rest }) {
  const user = getCurrentUser();
  return (
    <Route
      {...rest}
      render={props =>
        user ? (
          <Component {...props} user={user} />
        ) : (
          <Redirect
            to={{
              pathname: "/login"
            }}
          />
        )
      }
    />
  );
}

export default function RequireAuthentication(WrappedComponent) {
  return function(props) {
    const user = getCurrentUser();
    if (user) {
      return <WrappedComponent {...props} />;
    }

    return <Login />;
  };
}

export { PrivateRoute };
