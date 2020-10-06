import React, { useState } from "react";
import FormInputSelect from "../../../../_utils/forms/form-input-select";
import { numberMaxValidate } from "../../../../_utils";
import http from "./../../../../utils/httpServices";

export default ({ weight, lableSize }) => {
  const [shippingState, setShippingState] = useState({
    state: "IL",
    zipCode: 60644
  });

  const [shippingMethod, setShippingMethod] = useState({
    pending: false,
    options: []
  });

  const formChange = e => {
    let { name, value } = e.target;

    if (name === "zipCode") {
      value = numberMaxValidate(value, 5);
    }

    setShippingState({ ...shippingState, [name]: value });
  };

  const handleFormSubmit = async e => {
    e.preventDefault();

    await setShippingMethod({
      ...shippingMethod,
      pending: true,
      options: []
    });

    try {
      const { data } = await http.post("/shipping/fetchShippingRates", {
        ...shippingState,
        weight
      });

      if (data.error.errorCode === "0x0") {
        setShippingMethod(shippingMethod => ({
          ...shippingMethod,
          pending: false,
          options: data.dataSet
        }));
      } else {
        throw data.error.errorDesc;
      }
    } catch (error) {
      console.error(52, error);
    }
  };

  return (
    <>
      <div className="card mt-5">
        <form className="form-horizontal p-0">
          <FormInputSelect
            labelSize={lableSize}
            type="select"
            options="states"
            name="state"
            displayName="State"
            value={shippingState.state}
            onChange={e => formChange(e)}
          />

          <FormInputSelect
            labelSize={lableSize}
            name="zipCode"
            displayName="Zip Code"
            value={shippingState.zipCode}
            onChange={e => formChange(e)}
          />

          {shippingMethod.options.length > 0 && (
            <div className="card mb-2 print-order-form-shipping-method-div">
              <ul>
                {shippingMethod.options.map((m, i) => (
                  <li key={i}>
                    {m.service} - {m.amount}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            className={`btn btn-primary btn-block btn-flex ${
              shippingMethod.pending && "loading"
            }`}
            onClick={e => handleFormSubmit(e)}
          >
            <span className="btn-icon material-icons">local_shipping</span>
            Get Shipping Estimate
          </button>
        </form>
      </div>
    </>
  );
};
