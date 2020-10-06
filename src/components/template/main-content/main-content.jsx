import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import Auth from "../../../utils/authServices";
import SecondaryMenu from "./../secondary-menu/secondary-menu";

//ROUTES
import OrderListStarter from "../../application/ordering/order-list-starter";
import OrdersDesign from "../../application/ordering/design/design-order-page";
import DesignListStarter from "../../application/ordering/design/design-list-starter";
import PrintListStarter from "../../application/ordering/print/print-list-starter";
import OrdersPrint from "../../application/ordering/print/print-order-page";
import PrintFileUpload from "../../application/ordering/print-files-upload/print-files-upload";
import DesignFileUpload from "../../application/ordering/design-file-upload/design-file-upload";

import Home from "../../application/home/home";
import Account from "../../application/account/account";
import ShoppingCart from "../../application/account/shopping-cart/shopping-cart";
import CheckOut1 from "../../application/account/shopping-cart/check-out-1";
import CheckOut2 from "../../application/account/shopping-cart/check-out-2";
import CheckOut4 from "../../application/account/shopping-cart/check-out-4";

import SignIn from "../../application/auth/sign-in";
import SignOut from "../../application/auth/sign-out";
import Register from "../../application/account/resgister/register";
import PasswordReset from "../../application/auth/password-reset";
import PasswordUpdate from "../../application/auth/password-update";

import Pages from "../../application/pages/pages";

import Contact from "../../application/contact/contact";
import QuoteRequest from "../../application/quote-request/quote-request";

export default () => {
  return (
    <>
      <div className="storefront-main-content-body-wrapper">
        <div className="storefront-main-content-wrapper">
          <SecondaryMenu />

          <div className="storefront-page-content">
            <Switch>
              <Route exact path="/home" component={Home} />

              <Route exact path="/account/pwd" component={PasswordReset} />
              <Route exact path="/account/sign-in" component={SignIn} />
              <Route exact path="/account/sign-out" component={SignOut} />
              <Route exact path="/account/register" component={Register} />

              <Route
                exact
                path="/account/password-reset/:id"
                component={PasswordUpdate}
              />

              <Route
                exact
                path="/account/shopping-cart"
                component={ShoppingCart}
              />

              <Route exact path="/account/check-out-1" component={CheckOut1} />
              <Route exact path="/account/check-out-2" component={CheckOut2} />
              <Route exact path="/account/check-out-4" component={CheckOut4} />

              <Auth.privateRoute path="/account" component={Account} />

              <Route exact path="/start-order" component={OrderListStarter} />

              <Route
                exact
                path="/design/upload/:id"
                component={DesignFileUpload}
              />
              <Route exact path="/design/:url" component={OrdersDesign} />
              <Route exact path="/design" component={DesignListStarter} />

              <Route
                exact
                path="/print/upload/:id"
                component={PrintFileUpload}
              />
              <Route exact path="/print/:url" component={OrdersPrint} />
              <Route exact path="/print" component={PrintListStarter} />

              <Route path="/quote-request" component={QuoteRequest} />
              <Route path="/contact" component={Contact} />

              <Route path="/pages/:url" component={Pages} />
              <Redirect to="/home" />
            </Switch>
          </div>
        </div>
      </div>
    </>
  );
};
