import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PageHeader from "../../../template/main-content/page-header";
import { useHistory } from "react-router-dom";

import OrderSummary from "./utils/order-summary";
import PaymentForm from "./utils/payment-form/payment-form";
import TermsOfService from "./utils/terms-of-service";
import FormInputSelect from "../../../../_utils/forms/form-input-select";

import { emptyUserShoppingCart } from "../../../../redux/actions/shopping-cart/shoppingCartActions";

import http from "../../../../utils/httpServices";
import PageEmpty from "../../_page-utils/page-empty";

export default () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const shoppingCart = useSelector(state => state.shoppingCart.dataSet);
  const paymentGateways = useSelector(state => state.system.paymentGateway);

  const count =
    shoppingCart && shoppingCart.storeInvoiceItems
      ? shoppingCart.storeInvoiceItems.length
      : 0;

  const [shippingOptionsState, setShippingOptionsState] = useState({
    selectedIndex: 0,
    options: [{ service: "Loading Shipping Options", amount: undefined }]
  });

  // creditCard

  const [paymentFormState, setPaymentFormState] = useState({
    paymentOption: "creditCard",
    company: "Talladega Nights",
    firstName: "Ricky",
    lastName: "Bobby",
    creditCardNumber: "4111111111111111",
    creditCardExpirationMonth: 12,
    creditCardExpirationYear: 2021,
    creditCardCvv: "443",
    creditCardPostalCode: "90210",
    email: "email@email.com",
    termsOfService: true
  });

  useEffect(() => {
    let stillHere = true;

    if (!shoppingCart) return;

    if (user.loggedIn) {
      const loadPage = async () => {
        try {
          const { data } = await http.get(
            `pageSetups/checkOut2/${shoppingCart._id}`
          );

          if (data.error.errorCode === "0x0" && stillHere) {
            setShippingOptionsState(shippingOptionsState => ({
              ...shippingOptionsState,
              options: [
                { service: "Choose Shipping Option", amount: null },
                { service: "Customer Pick Up", amount: "0.00" },
                ...data.dataSet
              ]
            }));
          }
        } catch (error) {
          console.log(68, error);
        }
      };
      loadPage();
    }

    return () => {
      stillHere = false;
    };
  }, [user.loggedIn, shoppingCart]);

  const handleShippingOptionChange = e => {
    const selectedIndex = parseInt(e.target.value);

    setShippingOptionsState({
      ...shippingOptionsState,
      selectedIndex
    });
  };

  const handlePaymentOptionChange = e => {
    setPaymentFormState({ ...paymentFormState, paymentOption: e.target.value });
  };

  const handleTermsOfServiceChange = e => {
    setPaymentFormState({
      ...paymentFormState,
      termsOfService: !paymentFormState.termsOfService
    });
  };

  const handlePaymentFormChange = e => {
    console.log(94, "handlePaymentFormChange");
  };

  const handleSubmitOrder = async e => {
    console.clear();

    if (paymentFormState.paymentOption === "payPal") {
      await payPalSubmit();
    } else if (paymentGateways.authorizeNet.isActive) {
      await authorizeNetSubmit();
    } else if (paymentGateways.square.isActive) {
      await sqaureSubmit();
    }
  };

  const payPalSubmit = async () => {
    console.log(108, "payPal submit");
  };

  const sqaureSubmit = async () => {
    try {
      await window.thePaymentForm.requestCardNonce();
      // await dispatch(emptyUserShoppingCart());
      // history.push("/account/check-out-4");
    } catch (error) {
      console.log(115, error);
    }
  };

  const authorizeNetSubmit = async () => {
    try {
      let paymentAmount =
        parseFloat(shoppingCart.invoicePricing.grandTotal) +
        parseFloat(
          shippingOptionsState.options[shippingOptionsState.selectedIndex]
            .amount
        ).toString();

      const paymentObj = {
        storeFront: true,
        customerId: user.dataSet._id,
        invoiceId: shoppingCart._id,
        paymentAmount,

        creditCardNumber: paymentFormState.creditCardNumber,
        creditCardExpiration:
          paymentFormState.creditCardExpirationMonth +
          " " +
          paymentFormState.creditCardExpirationYear,
        creditCardCvv: paymentFormState.creditCardCvv,
        creditCardPostalCode: paymentFormState.creditCardPostalCode,

        shippingMethod: {
          ...shippingOptionsState.options[shippingOptionsState.selectedIndex]
        }
      };

      const { data } = await http.post(
        `paymentProcessing/authorizeNet/capture`,
        paymentObj
      );

      console.log(150, data);

      if (data.error.errorCode === "0x0") {
        await dispatch(emptyUserShoppingCart());
        history.push("/account/check-out-4");
      } else {
        throw data.error;
      }
    } catch (error) {
      console.log(130, error);
    }
  };

  // const lableSize = ["col-3 col-sm-12", "col-9 col-sm-12"];

  const theShipping =
    shippingOptionsState.options[shippingOptionsState.selectedIndex];

  theShipping.amount = theShipping.amount ? theShipping.amount : 0;

  const paymentAmount = shoppingCart.invoicePricing
    ? (shoppingCart.invoicePricing.subTotal * 100 + theShipping.amount * 100) /
      100
    : 0.0;

  const paymentInfoObj = { paymentAmount, theShipping };

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
      <PageHeader pageName="Account / Order Check Out (Step 2 of 2)" />

      <OrderSummary
        shipping={
          shippingOptionsState.options[shippingOptionsState.selectedIndex]
        }
      />

      <div className="card processing-card">
        <h3 className="custom-header">
          Shipping Method
          <span>
            <br />
            Please select a delivery method.
          </span>
        </h3>

        <div>
          <FormInputSelect
            labelSize={["col-6 col-sm-12", "col-6 col-sm-12"]}
            type="select"
            value={shippingOptionsState.selectedIndex}
            theOptions={shippingOptionsState.options.map((m, i) => (
              <option key={i} value={i}>
                {m.service} {m.amount !== null && ` - ${m.amount}`}
              </option>
            ))}
            name="shippingOptions"
            displayName=""
            onChange={e => handleShippingOptionChange(e)}
          />
        </div>
      </div>

      <div className="card processing-card">
        <h3 className="custom-header">
          Payment Method
          <span>
            <br />
            How would you like to pay for your order? <br />
            All transactions are secure and encrypted, and we never store your
            credit card information.
          </span>
        </h3>

        <div className="payment-wrapper">
          <div className="options">
            <form className="form-horizontal">
              <div className="form-group">
                <div className="col-sm-12">
                  <label className="form-radio">
                    <input
                      type="radio"
                      name="payment-option-type"
                      value="creditCard"
                      checked={
                        paymentFormState.paymentOption === "creditCard"
                          ? true
                          : false
                      }
                      onChange={e => handlePaymentOptionChange(e)}
                    />
                    <i className="form-icon"></i> Credit / Debit Card
                  </label>
                  <label className="form-radio">
                    <input
                      type="radio"
                      name="payment-option-type"
                      value="payPal"
                      checked={
                        paymentFormState.paymentOption === "payPal"
                          ? true
                          : false
                      }
                      onChange={e => handlePaymentOptionChange(e)}
                    />
                    <i className="form-icon"></i> PayPal
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div className="payment-form">
            <PaymentForm
              paymentFormState={paymentFormState}
              paymentInfoObj={paymentInfoObj}
              onChange={handlePaymentFormChange}
            />
          </div>
        </div>
      </div>

      <TermsOfService
        checked={paymentFormState.termsOfService}
        onChange={handleTermsOfServiceChange}
      />
      <div className="card processing-card">
        <button
          className={`btn btn-primary ${
            (shippingOptionsState.selectedIndex === 0 ||
              paymentFormState.paymentOption === "" ||
              paymentFormState.termsOfService === false) &&
            "disabled"
          }`}
          onClick={handleSubmitOrder}
        >
          Complete My Order
        </button>
      </div>
    </>
  );
};
