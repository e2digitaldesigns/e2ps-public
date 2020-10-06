import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default () => {
  const system = useSelector(state => state.system);
  const pages = system.pages;
  return (
    <>
      {" "}
      <ul>
        <li className="storefront-secondary-menu-header">My Account</li>

        <li>
          <Link to="/upload/5f22c75a9c00f351e0335f70">Upload</Link>
        </li>

        <li>
          <Link to="/account/shopping-cart">Shopping Cart</Link>
        </li>

        <li>
          <Link to="/account/dashboard">Dashboard</Link>
        </li>

        <li>
          <Link to="/account">My Account</Link>
        </li>

        <li>
          <Link to="/account/history/orders">Order History</Link>
        </li>

        <li>
          <Link to="/account/history/estimates">Estimates</Link>
        </li>

        <li>
          <Link to="/account/shipping-profiles">Shipping Profiles</Link>
        </li>

        {pages
          .filter(f => f.isAccountMenu === true)
          .map((m, i) => (
            <li key={i}>
              <Link to={"/pages/" + m.url}>{m.name}</Link>
            </li>
          ))}
      </ul>
    </>
  );
};
