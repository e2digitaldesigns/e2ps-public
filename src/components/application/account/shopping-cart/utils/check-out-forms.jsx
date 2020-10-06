import React from "react";
import { useSelector } from "react-redux";
import FormInputSelect from "../../../../../_utils/forms/form-input-select";

export default ({ type, header, data, shipToBilling, onChange }) => {
  if (!data) return <div />;

  const user = useSelector(state => state.user);
  const shoppingCart = useSelector(state => state.shoppingCart.dataSet);
  const lableSize = ["col-3 col-sm-12", "col-9 col-sm-12"];

  let showForm = true;
  if (
    type === "shippingAddress" &&
    (shipToBilling === true || shoppingCart.needShipping === false)
  ) {
    showForm = false;
  }

  let showAddress = true;
  if (user.loggedIn === true && type === "billingAddress") {
    // showAddress = false;
  }

  return (
    <>
      <div className="contact-div">
        <h3 className="custom-header">{header}</h3>
        {type === "shippingAddress" && (
          <>
            {shipToBilling && (
              <div className="alert alert-warning">
                Your order will be shipped to your billing address.
              </div>
            )}

            {!shoppingCart.needShipping && (
              <div className="alert alert-warning">
                Design orders will be delivered digitally.
              </div>
            )}
          </>
        )}

        {showForm && (
          <form className="form-horizontal">
            <FormInputSelect
              labelSize={lableSize}
              name="company"
              displayName="Company"
              value={data.company}
              onChange={e => onChange(e, type)}
            />

            {type === "shippingAddress" && (
              <>
                <FormInputSelect
                  labelSize={lableSize}
                  name="name"
                  displayName="Name"
                  value={data.name}
                  onChange={e => onChange(e, type)}
                />
              </>
            )}

            {type === "billingAddress" && (
              <>
                {/* {!user.loggedIn && ()} */}

                <FormInputSelect
                  labelSize={lableSize}
                  name="firstName"
                  displayName="First Name"
                  value={data.firstName}
                  onChange={e => onChange(e, type)}
                />

                <FormInputSelect
                  labelSize={lableSize}
                  name="lastName"
                  displayName="Last Name"
                  value={data.lastName}
                  onChange={e => onChange(e, type)}
                />
              </>
            )}

            {showAddress && (
              <>
                <FormInputSelect
                  labelSize={lableSize}
                  name="address1"
                  displayName="Address 1"
                  value={data.address1}
                  onChange={e => onChange(e, type)}
                />
                <FormInputSelect
                  labelSize={lableSize}
                  name="address2"
                  displayName="Address 2"
                  value={data.address2}
                  onChange={e => onChange(e, type)}
                />
                <FormInputSelect
                  labelSize={lableSize}
                  name="city"
                  displayName="City"
                  value={data.city}
                  onChange={e => onChange(e, type)}
                />
                <FormInputSelect
                  labelSize={lableSize}
                  type="select"
                  options="states"
                  name="state"
                  displayName="State"
                  value={data.state}
                  onChange={e => onChange(e, type)}
                />{" "}
              </>
            )}

            <FormInputSelect
              labelSize={lableSize}
              name="zipCode"
              displayName="Zip Code"
              value={data.zipCode}
              onChange={e => onChange(e, type)}
            />
          </form>
        )}

        {type === "billingAddress" && shoppingCart.needShipping && (
          <div className="form-group">
            <label className="form-checkbox form-checkbox-billing">
              <input
                type="checkbox"
                name="shipToBilling"
                checked={shipToBilling}
                onChange={e => onChange(e, type)}
              />
              <i className="form-icon"></i> Ship items to the above billing
              address.
            </label>
          </div>
        )}
      </div>
    </>
  );
};
