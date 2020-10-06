import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PageHeader from "../../../template/main-content/page-header";
import { Link, useHistory } from "react-router-dom";
import _ from "lodash";

import OrderSummary from "./utils/order-summary";
import CheckOutForms from "./utils/check-out-forms";
import FormInputSelect from "../../../../_utils/forms/form-input-select";

import http from "../../../../utils/httpServices";
import PageEmpty from "../../_page-utils/page-empty";

import {
  alphaNumericValidate,
  emailValidate,
  numberMaxValidate,
  phoneValidate
} from "../../../../_utils";

import { userStatusCheck } from "../../../../redux/actions/user/userAuth";

export default props => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const shoppingCart = useSelector(state => state.shoppingCart.dataSet);
  const currentBillingInformationState = useRef();

  const count =
    shoppingCart && shoppingCart.storeInvoiceItems
      ? shoppingCart.storeInvoiceItems.length
      : 0;

  const [billingInformationState, setBillingInformationState] = useState({
    email: "rickyBobby@talladegaNights.com",
    emailError: false,
    shipToBilling: false,

    billingAddress: {
      company: "Talladega Nights",
      firstName: "Ricky",
      lastName: "Bobby",
      address1: "address1",
      address2: "address2",
      city: "city",
      state: "MI",
      zipCode: "48304"
    },

    shippingAddress: {
      company: "company",
      name: "name la la la",
      address1: "address1",
      address2: "address2",
      city: "city",
      state: "MI",
      zipCode: "48304"
    }
  });

  const [submitState, setSubmitState] = useState({ pending: false });

  useEffect(() => {
    console.log(64);
    let stillHere = true;

    if (!shoppingCart._id) return;
    if (
      _.isEqual(billingInformationState, currentBillingInformationState.current)
    )
      return;

    if (user.loggedIn) {
      const loadPage = async () => {
        try {
          const { data } = await http.get(
            `pageSetups/checkOut1/${user.dataSet._id}/${shoppingCart._id}`
          );

          if (data.error.errorCode === "0x0" && stillHere) {
            const billingState = _.cloneDeep(billingInformationState);
            billingState.email = user.dataSet.email;

            if (data.billingAddress)
              billingState.billingAddress = { ...data.billingAddress };

            if (data.shippingAddress)
              billingState.shippingAddress = {
                ...data.shippingAddress
              };

            setBillingInformationState(billingInformationState => ({
              ...billingState
            }));

            currentBillingInformationState.current = billingInformationState;
          }
        } catch (error) {
          console.error(100, error);
        }
      };
      loadPage();
    }

    return () => {
      stillHere = false;
    };
  }, [
    billingInformationState,
    shoppingCart._id,
    user.loggedIn,
    user.dataSet.email,
    user.dataSet._id
  ]);

  const handleFormChange = (e, type = null) => {
    let { name, value } = e.target;
    const state = _.cloneDeep(billingInformationState);

    if (name === "shipToBilling") {
      state.shipToBilling = !state.shipToBilling;
    } else if (name === "email") {
      value = emailValidate(value);
      state.email = value;
    } else {
      switch (name) {
        default:
        case "company":
        case "name":
        case "firstName":
        case "lastName":
        case "address1":
        case "address2":
        case "city":
          value = alphaNumericValidate(value, true);
          break;

        case "email":
          value = emailValidate(value);
          break;

        case "phone":
          value = phoneValidate(value);
          break;

        case "zipCode":
          value = numberMaxValidate(value, 5);
          break;
      }

      state[type][name] = value;
    }

    if (value || name === "shipToBilling")
      setBillingInformationState({ ...state });
  };

  const handleFormSubmit = async e => {
    e.preventDefault();

    await setBillingInformationState({
      ...billingInformationState,
      emailError: false
    });

    submitLoader(true);
    const state = _.cloneDeep(billingInformationState);

    const putObj = {
      loggedIn: user.loggedIn,
      ...state
    };

    try {
      const { data } = await http.put(
        `/shoppingCart/checkOut1/${shoppingCart._id}`,
        putObj
      );

      if (data.emailCheck === 1) {
        setBillingInformationState({
          ...billingInformationState,
          emailError: true
        });
        throw data.error;
      } else if (data.error.errorCode === "0x0") {
        if (data.signUserIn) {
          await localStorage.setItem(
            process.env.REACT_APP_JWT_TOKEN,
            data.token
          );
          await dispatch(userStatusCheck({ status: true, ...data.userObj }));
        }
        await submitLoader(false);
        history.push(`/account/check-out-2`);
        return;
      } else if (data.error.errorCode !== "0x0") {
        throw data.error.errorDesc;
      }
    } catch (error) {
      submitLoader(false);
    }
  };

  const submitLoader = async state => {
    await setSubmitState({
      ...submitState,
      pending: state
    });
  };

  if (count === 0) {
    return (
      <>
        <PageEmpty
          pageName="Account / Shopping Cart"
          icon="shopping_cart"
          title="You have no items in your shopping cart!"
          subTitle="Click the button to start shopping!"
        />
      </>
    );
  }

  return (
    <>
      <PageHeader pageName="Account / Order Check Out (Step 1 of 2)" />

      <OrderSummary />

      {!user.loggedIn && (
        <>
          <div className="card processing-card">
            <h3 className="custom-header">Please enter your email address</h3>

            <div>
              <FormInputSelect
                labelSize={["col-6 col-sm-12", "col-6 col-sm-12"]}
                name="email"
                value={billingInformationState.email}
                displayName=""
                onChange={e => handleFormChange(e)}
              />
            </div>

            <div className="mt-3">
              Already have an account?{" "}
              <Link to="/account/sign-in">Sign in now!</Link>
            </div>

            {billingInformationState.emailError && (
              <div className="alert alert-warning mt-5">
                Error Message: This email address is already in our system. Use
                a different email address or log in to continue.
              </div>
            )}
          </div>{" "}
        </>
      )}

      <div className="card processing-card processing-card-forms-holder">
        <CheckOutForms
          type="billingAddress"
          header="Billing Address"
          data={billingInformationState.billingAddress}
          shipToBilling={billingInformationState.shipToBilling}
          onChange={handleFormChange}
        />

        {!billingInformationState.billingAddress.shipTo && (
          <CheckOutForms
            type="shippingAddress"
            header="Shipping Address"
            data={billingInformationState.shippingAddress}
            shipToBilling={billingInformationState.shipToBilling}
            onChange={handleFormChange}
          />
        )}
      </div>

      <div className="card processing-card ">
        <button
          className={`btn btn-primary ${submitState.pending && "loading"}`}
          onClick={e => handleFormSubmit(e)}
        >
          Continue to Next Step
        </button>
      </div>
    </>
  );
};
