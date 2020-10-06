import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Redirect, Switch } from "react-router-dom";

import AccountSettings from "./account-settings/account-settings";
import ShippingProfiles from "./shipping-profiles/shippng-profiles";
import OrderHistory from "./order-history/order-history";
import OrderHistoryInvoice from "./order-history/order-history-invoice";
import { getUserSettings } from "../../../redux/actions/user/userAccount";

export default () => {
  const dispatch = useDispatch();
  const [documentState, setDocumentState] = useState({ docReady: false });

  useEffect(() => {
    let stillHere = true;

    async function loadData() {
      try {
        const result = await dispatch(getUserSettings());

        if (result.error.errorCode === "0x0" && stillHere === true) {
          setDocumentState(documentState => ({
            ...documentState,
            docReady: true
          }));
        }
      } catch (err) {}
    }

    loadData();

    return () => {
      stillHere = false;
    };
  }, [dispatch]);

  if (documentState.docReady === false) return <></>;

  return (
    <>
      <Switch>
        <Route
          exact
          path="/account/dashboard"
          render={props => <h1>dashboard</h1>}
        />

        <Route exact path="/account/" component={AccountSettings} />

        <Route exact path="/account/history/:type" component={OrderHistory} />

        <Route
          exact
          path="/account/invoice/:id"
          component={OrderHistoryInvoice}
        />

        <Route
          exact
          path="/account/shipping-profiles"
          component={ShippingProfiles}
        />

        <Redirect to="account/dashboard" />
      </Switch>
    </>
  );
};
