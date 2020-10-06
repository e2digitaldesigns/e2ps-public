import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default () => {
  const user = useSelector(state => state.user);
  const { email, phone } = useSelector(
    state => state.system.storeFrontSettings.template.contact
  );

  return (
    <div className="storefront-top-header-wrapper">
      <div className="storefront-top-header">
        <div className="top-header-contact-information">
          <ul>
            <li>
              {email && (
                <>
                  <span className="icon material-icons">email</span> {email}
                </>
              )}
            </li>

            <li>
              {phone && (
                <>
                  <span className="icon material-icons">phone</span> {phone}
                </>
              )}
            </li>
          </ul>
        </div>
        <div className="top-header-menu">
          <ul>
            <li>
              <span className="icon material-icons">home</span>{" "}
              <Link to="/home">Home</Link>
            </li>
            <li>
              <span className="icon material-icons">account_circle</span>{" "}
              <Link to="/account">Account</Link>
            </li>

            {!user.loggedIn && (
              <>
                <li>
                  <span className="icon material-icons">
                    supervised_user_circle
                  </span>{" "}
                  <Link to="/account/register">New Account</Link>
                </li>

                <li>
                  <span className="icon material-icons">login</span>{" "}
                  <Link to="/account/sign-in">Sign In</Link>
                </li>
              </>
            )}

            {user.loggedIn && (
              <li>
                <span className="icon material-icons">login</span>{" "}
                <Link to="/account/sign-out">Sign Out</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
