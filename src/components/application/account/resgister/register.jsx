import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import http from "../../../../utils/httpServices";

import PageHeader from "../../../template/main-content/page-header";
import FormInputSelect from "../../../../_utils/forms/form-input-select";
import {
  alphaNumericValidate,
  emailValidate,
  emailValidationSubmit,
  numberMaxValidate,
  phoneValidate
} from "../../../../_utils";

export default () => {
  const history = useHistory();
  const system = useSelector(state => state.system);
  const [state, setState] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    address1: "",
    address2: "",
    city: ""
  });

  const onChange = e => {
    let { name, value } = e.target;

    switch (name) {
      default:
      case "companyName":
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

    if (value === null) return;
    setState({ ...state, [name]: value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    if (
      !emailValidationSubmit(state.email) ||
      state.password !== state.confirmPassword
    )
      return;

    const formData = {
      updateType: "storeFrontRegister",
      dataSet: {
        storeOwnerId: system.storeOwnerId,
        storeFrontId: system.storeFrontId,
        ...state
      }
    };

    console.log(82, formData);

    try {
      const { data } = await http.post(
        `${process.env.REACT_APP_REST_API}customers/storeFront`,
        formData
      );

      if (data.error.errorCode === "0x0") {
        history.push("/account/sign-in");
      } else {
        alert("There was an error");
      }

      console.log(95, data);
    } catch (error) {}
  };

  return (
    <>
      <PageHeader pageName="Account Settings" />

      <form className="form-horizontal" onSubmit={onSubmit}>
        <FormInputSelect
          name="companyName"
          displayName="Company Name"
          value={state.companyName}
          onChange={onChange}
          placeholder="Company Name"
        />

        <FormInputSelect
          name="firstName"
          displayName="First Name"
          value={state.firstName}
          onChange={onChange}
          required={true}
        />

        <FormInputSelect
          name="lastName"
          displayName="Last Name"
          value={state.lastName}
          onChange={onChange}
          required={true}
        />

        <FormInputSelect
          name="phone"
          displayName="Phone"
          value={state.phone}
          onChange={onChange}
          placeholder="(582) 555-3659"
          required={true}
        />

        <FormInputSelect
          type="email"
          name="email"
          displayName="Email"
          value={state.email}
          onChange={onChange}
          placeholder="email@email.com"
          required={true}
        />

        {/* <FormInputSelect
          name="address1"
          displayName="Address"
          value={state.address1}
          onChange={onChange}
          placeholder=""
        />

        <FormInputSelect
          name="address2"
          displayName="Address 2"
          value={state.address2}
          onChange={onChange}
          placeholder=""
        />

        <FormInputSelect
          name="city"
          displayName="City"
          value={state.city}
          onChange={onChange}
          placeholder=""
        />

        <FormInputSelect
          type="select"
          options="states"
          name="state"
          displayName="State"
          value={state.state}
          onChange={onChange}
          placeholder=""
        />

        <FormInputSelect
          name="zipCode"
          displayName="Zip Code"
          value={state.zipCode}
          onChange={onChange}
          placeholder="90210"
        />
*/}
        <FormInputSelect
          type="password"
          name="password"
          displayName="Current Password"
          value={state.password}
          onChange={onChange}
        />

        <FormInputSelect
          type="password"
          name="confirmPassword"
          displayName="Confirm Password"
          value={state.confirmPassword}
          onChange={onChange}
        />

        <div className="form-group">
          <div className="col-2 col-sm-12">
            <label className="form-label form-label-text-align">*</label>
          </div>
          <div className="col-4 col-sm-12">
            <button type="submit" className="btn btn-primary btn-block">
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
