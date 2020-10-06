import React from "react";
import { Route, Redirect } from "react-router-dom";
import jwtDecode from "jwt-decode";

const Auth = {
  getAuth() {
    let loggedIn = false;

    try {
      const token = jwtDecode(
        localStorage.getItem(process.env.REACT_APP_JWT_TOKEN)
      );

      if (token.authLevel !== "public") {
        localStorage.clear();
        throw new Error("authLevel Error");
      }
      loggedIn = true;
    } catch (err) {
      console.log(21, err);
    }

    return loggedIn;
  },

  privateRoute({ component: Component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          Auth.getAuth() ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/contact",
              }}
            />
          )
        }
      />
    );
  },
};

export default Auth;
