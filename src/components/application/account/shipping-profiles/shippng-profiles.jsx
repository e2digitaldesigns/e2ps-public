import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import PageHeader from "../../../template/main-content/page-header";

import FormInputSelect from "../../../../_utils/forms/form-input-select";

import {
  alphaNumericValidate,
  emailValidate,
  numberMaxValidate,
  phoneValidate
} from "../../../../_utils";
import { updateUserSettings } from "../../../../redux/actions/user/userAccount";

export default () => {
  const dispatch = useDispatch();
  const shippingProfiles = useSelector(
    state => state.userAccount.dataSet.shippingProfiles
  );

  const [shippingProfileState, setShippingProfileState] = useState({
    index: -1,
    profiles: _.cloneDeep(shippingProfiles)
  });

  const shippingProfilesLength = shippingProfiles.length;

  useEffect(() => {
    console.log(30);
    let stillHere = true;

    if (stillHere && shippingProfilesLength > 0) {
      setShippingProfileState(shippingProfileState => ({
        ...shippingProfileState,
        index: 0
      }));
    }

    return () => {
      stillHere = false;
    };
  }, [shippingProfilesLength]);

  const onProfileChange = e => {
    setShippingProfileState({ ...shippingProfileState, index: e.target.value });
  };

  const onChange = e => {
    let { name, value } = e.target;

    switch (name) {
      default:
      case "profileName":
      case "company":
      case "name":
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
    const index = shippingProfileState.index;
    const updateProfiles = shippingProfileState.profiles;

    updateProfiles[index][name] = value;
    setShippingProfileState({
      ...shippingProfileState,
      profiles: updateProfiles
    });
  };

  const onSubmit = async e => {
    e.preventDefault();

    const formData = {
      updateType: "storeFrontShippingProfiles",
      dataSet: shippingProfileState.profiles
    };

    try {
      await dispatch(updateUserSettings(formData));
    } catch (error) {
      console.error(error);
    }

    return;
  };

  const shippingTypes = [
    { value: "COM", display: "Commercial" },
    { value: "RES", display: "Residential" }
  ];

  const theProfile = shippingProfileState.profiles[shippingProfileState.index];

  return (
    <>
      <PageHeader pageName="Shipping Profiles" />

      <form className="form-horizontal" onSubmit={onSubmit}>
        <FormInputSelect
          type="select"
          name="profileName"
          id=""
          displayName="Profile"
          value={shippingProfileState.index}
          onChange={onProfileChange}
          theOptions={shippingProfiles.map((m, index) => (
            <option key={index} value={index}>
              {m.profileName}
            </option>
          ))}
        />

        {shippingProfileState.index !== -1 && (
          <>
            <FormInputSelect
              name="profileName"
              displayName="Profile Name"
              value={theProfile.profileName}
              onChange={onChange}
              required={true}
            />

            <FormInputSelect
              type="select"
              options={shippingTypes}
              name="type"
              displayName="Type"
              value={theProfile.type}
              onChange={onChange}
            />

            <FormInputSelect
              name="company"
              displayName="Company Name"
              value={theProfile.company}
              onChange={onChange}
            />

            <FormInputSelect
              name="phone"
              displayName="Phone"
              value={theProfile.phone}
              onChange={onChange}
            />

            <FormInputSelect
              name="name"
              displayName="Contact Name"
              value={theProfile.name}
              onChange={onChange}
              required={true}
            />

            <FormInputSelect
              name="address1"
              displayName="Address"
              value={theProfile.address1}
              onChange={onChange}
              required={true}
            />

            <FormInputSelect
              name="address2"
              displayName="Address 2"
              value={theProfile.address2}
              onChange={onChange}
              placeholder=""
            />

            <FormInputSelect
              name="city"
              displayName="City"
              value={theProfile.city}
              onChange={onChange}
              required={true}
            />

            <FormInputSelect
              type="select"
              options="states"
              name="state"
              displayName="State"
              value={theProfile.state}
              onChange={onChange}
            />

            <FormInputSelect
              name="zipCode"
              displayName="Zip Code"
              value={theProfile.zipCode}
              onChange={onChange}
              required={true}
            />
            <div className="form-group">
              <div className="col-2 col-sm-12">
                <label className="form-label form-label-text-align">xxx</label>
              </div>
              <div className="col-4 col-sm-12">
                <button className="btn btn-primary btn-block">
                  default button
                </button>
              </div>
            </div>
          </>
        )}
      </form>
    </>
  );
};
