import React from "react";
import { useSelector } from "react-redux";
import FormInputSelect from "../../../../../../_utils/forms/form-input-select";

import AuthorizeNetForm from "./authorizeNet/authorizeNet-form";
import SquarePayment from "./square/square-payment";

export default ({ paymentFormState, paymentInfoObj, onChange }) => {
  const paymentGateways = useSelector(state => state.system.paymentGateway);

  const lableSize = ["col-4 col-sm-12", "col-8 col-sm-12"];
  return (
    <>
      <form className="form-horizontal">
        {paymentFormState.paymentOption === "creditCard" &&
          paymentGateways.square.isActive && (
            <>
              <SquarePayment paymentInfoObj={paymentInfoObj} />
            </>
          )}

        {paymentFormState.paymentOption === "creditCard" &&
          paymentGateways.authorizeNet.isActive && (
            <>
              <AuthorizeNetForm
                paymentFormState={paymentFormState}
                onChange={onChange}
              />
            </>
          )}

        {paymentFormState.paymentOption === "payPal" &&
          paymentGateways.payPal.isActive && (
            <FormInputSelect
              labelSize={lableSize}
              name="email"
              displayName="Email"
              value={paymentFormState.email}
              onChange={e => onChange(e)}
            />
          )}
      </form>
    </>
  );
};
