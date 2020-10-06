import React from "react";
import FormInputSelect from "../../../../../../../_utils/forms/form-input-select";

export default ({ paymentFormState, onChange }) => {
  const lableSize = ["col-4 col-sm-12", "col-8 col-sm-12"];
  return (
    <>
      {/* <FormInputSelect
        labelSize={lableSize}
        name="firstName"
        displayName="First Name"
        value={paymentFormState.firstName}
        onChange={e => onChange(e)}
      />
      <FormInputSelect
        labelSize={lableSize}
        name="lastName"
        displayName="Last Name"
        value={paymentFormState.lastName}
        onChange={e => onChange(e)}
      /> */}
      <FormInputSelect
        labelSize={lableSize}
        name="creditCardNumber"
        displayName="Number"
        value={paymentFormState.creditCardNumber}
        onChange={e => onChange(e)}
      />
      <FormInputSelect
        labelSize={lableSize}
        name="creditCardExpirationMonth"
        displayName="Expiration"
        value={paymentFormState.creditCardExpirationMonth}
        onChange={e => onChange(e)}
      />
      <FormInputSelect
        labelSize={lableSize}
        name="creditCardExpirationYear"
        displayName="Expiration"
        value={paymentFormState.creditCardExpirationYear}
        onChange={e => onChange(e)}
      />

      <FormInputSelect
        labelSize={lableSize}
        name="creditCardCvv"
        displayName="CCV"
        value={paymentFormState.creditCardCvv}
        onChange={e => onChange(e)}
      />

      <FormInputSelect
        labelSize={lableSize}
        name="creditCardPostalCode"
        displayName="Zip Code"
        value={paymentFormState.creditCardPostalCode}
        onChange={e => onChange(e)}
      />
    </>
  );
};
