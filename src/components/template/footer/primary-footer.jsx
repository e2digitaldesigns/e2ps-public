import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default () => {
  const user = useSelector(state => state.user);
  const system = useSelector(state => state.system);
  const pages = system.pages;

  const { contact, hours } = system.storeFrontSettings.template;

  const contactEntry = data => {
    if (data !== "") {
      return <li>{data}</li>;
    }
  };

  return (
    <div className="storefront-primary-footer">
      <div>
        <ul>
          <li className="header">Information</li>
          {pages
            .filter(f => f.isInformationMenu === true)
            .map((m, i) => (
              <li key={i}>
                <Link to={"/pages/" + m.url}>{m.name}</Link>
              </li>
            ))}

          <li>
            <Link to="/design">Design</Link>
          </li>

          <li>
            <Link to="/print">Print</Link>
          </li>

          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>

      <div>
        <ul>
          <li className="header">My Account</li>
          <li>
            <Link to="/account">My Account</Link>
          </li>

          <li>
            <Link to="/account/shopping-cart">Shopping Cart</Link>
          </li>

          {!user.loggedIn && (
            <>
              <li>
                <Link to="/account/sign-in">Sign In</Link>
              </li>
              <li>
                <Link to="/account/register">New Account</Link>
              </li>{" "}
            </>
          )}

          <li>
            <Link to="/account/history/orders">Order History</Link>
          </li>
          <li>
            <Link to="/account/history/estimates">Estimates</Link>
          </li>

          <li>
            <Link to="/account/shipping-profiles">Shipping Profiles</Link>
          </li>

          {user.loggedIn && (
            <li>
              <Link to="/account/sign-out">Sign Out</Link>
            </li>
          )}
        </ul>
      </div>

      <div>
        <ul>
          <li className="header">Resources</li>
          {pages
            .filter(f => f.isResourceMenu === true)
            .map((m, i) => (
              <li key={i}>
                <Link to={"/pages/" + m.url}>{m.name}</Link>
              </li>
            ))}
        </ul>
      </div>

      <div>
        <ul>
          {hours.length > 0 && (
            <>
              <li className="header">Office Hours</li>
              {hours.map((m, i) => (
                <li key={i}>
                  {m.day} - {m.time}
                </li>
              ))}{" "}
            </>
          )}
          <li className="header mid-headerX">Contact Us</li>
          {contactEntry(contact.phone)}
          {contactEntry(contact.email)}
        </ul>
      </div>
    </div>
  );
};
