import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../../../template/main-content/page-header";
import FormInputSelect from "../../../../_utils/forms/form-input-select";
import {
  alphaNumericValidate,
  emailValidate,
  emailValidationSubmit,
  numberMaxValidate,
  phoneValidate
} from "../../../../_utils";
import { updateUserSettings } from "../../../../redux/actions/user/userAccount";

export default () => {
  const dispatch = useDispatch();
  const contact = useSelector(state => state.userAccount.dataSet.contact);
  const [userState, setUserState] = useState({ ...contact });

  const onChange = e => {
    let { name, value } = e.target;

    switch (name) {
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

      default:
        break;
    }

    if (value === null) return;
    setUserState({ ...userState, [name]: value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    if (!emailValidationSubmit(userState.email)) return;

    const formData = {
      updateType: "storeFrontContact",
      dataSet: userState
    };

    try {
      await dispatch(updateUserSettings(formData));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <PageHeader pageName="Account Settings" />

      <form className="form-horizontal" onSubmit={onSubmit}>
        <FormInputSelect
          name="company"
          displayName="Company Name"
          value={userState.companyName}
          onChange={onChange}
          placeholder="Company Name"
        />

        <FormInputSelect
          name="firstName"
          displayName="First Name"
          value={userState.firstName}
          onChange={onChange}
          required={true}
        />

        <FormInputSelect
          name="lastName"
          displayName="Last Name"
          value={userState.lastName}
          onChange={onChange}
          required={true}
        />

        <FormInputSelect
          name="phone"
          displayName="Phone"
          value={userState.phone}
          onChange={onChange}
          placeholder="(582) 555-3659"
          required={true}
        />

        <FormInputSelect
          type="email"
          name="email"
          displayName="Email"
          value={userState.email}
          onChange={onChange}
          placeholder="email@email.com"
          required={true}
        />

        <FormInputSelect
          name="address1"
          displayName="Address"
          value={userState.address1}
          onChange={onChange}
          placeholder=""
        />

        <FormInputSelect
          name="address2"
          displayName="Address 2"
          value={userState.address2}
          onChange={onChange}
          placeholder=""
        />

        <FormInputSelect
          name="city"
          displayName="City"
          value={userState.city}
          onChange={onChange}
          placeholder=""
        />

        <FormInputSelect
          type="select"
          options="states"
          name="state"
          displayName="State"
          value={userState.state}
          onChange={onChange}
          placeholder=""
        />

        <FormInputSelect
          name="zipCode"
          displayName="Zip Code"
          value={userState.zipCode}
          onChange={onChange}
          placeholder="90210"
        />

        <FormInputSelect
          type="password"
          name="password"
          displayName="Current Password"
          value=""
          onChange={onChange}
        />

        <FormInputSelect
          type="password"
          name="newPassword"
          displayName="New Password"
          value=""
          onChange={onChange}
        />

        <FormInputSelect
          type="password"
          name="confirmPassword"
          displayName="Confirm Password"
          value=""
          onChange={onChange}
        />

        <div className="form-group">
          <div className="col-2 col-sm-12">
            <label className="form-label form-label-text-align">xxx</label>
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
