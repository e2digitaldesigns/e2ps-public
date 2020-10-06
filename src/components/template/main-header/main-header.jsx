import React from "react";
import { Link } from "react-router-dom";
import MainHeaderShoppingCart from "./main-header-shopping-cart";
import { useSelector } from "react-redux";

export default () => {
  const logo = useSelector(
    state => state.system.storeFrontSettings.template.images.logo.file
  );

  return (
    <>
      <div className="storefront-main-header-wrapper">
        <div className="storefront-main-header">
          <Link to="/home" className="storefront-main-header-logo">
            <img src={process.env.REACT_APP_CLOUD + logo} alt="" />
          </Link>

          <div className="storefront-main-header-shopping-cart">
            <MainHeaderShoppingCart />
          </div>
        </div>
      </div>
    </>
  );
};
