import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../../template/main-content/page-header";
import FormInputSelect from "../../../_utils/forms/form-input-select";
import http from "./../../../utils/httpServices";

export default props => {
  const system = useSelector(state => state.system);

  const [state, setState] = useState({
    emailAddress: "mymonti@gmail.com"
  });

  const [resetState, SetResetState] = useState({
    successMessage: null,
    errorMessage: null
  });

  const onChange = e => {
    e.preventDefault();
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    const { data: result } = await http.post(
      `${process.env.REACT_APP_REST_API}passwordReset`,
      {
        type: "public",
        storeOwnerId: system.storeOwnerId,
        email: state.emailAddress
      }
    );

    console.clear();
    console.log(result);

    if (result.error.errorCode === "0x0") {
      // history.push("/account/login");

      SetResetState({
        ...resetState,
        successMessage: "Reset email has been sent!",
        errorMessage: null
      });
    }

    if (result.error.errorCode !== "0x0") {
      SetResetState({
        ...resetState,
        successMessage: null,
        errorMessage: result.error.errorDesc
      });
    }
  };

  return (
    <>
      <PageHeader pageName="Account Sign In" />
      <form className="form-horizontal">
        <FormInputSelect
          name="emailAddress"
          displayName="Email"
          value={state.emailAddress}
          onChange={onChange}
        />

        {resetState.errorMessage && (
          <div className="form-group my-2">
            <div className="col-2 col-sm-12"></div>
            <div className="col-4 col-sm-12">{resetState.errorMessage}</div>
          </div>
        )}

        {resetState.successMessage && (
          <div className="form-group my-2">
            <div className="col-2 col-sm-12"></div>
            <div className="col-4 col-sm-12">{resetState.successMessage}</div>
          </div>
        )}

        <div className="form-group">
          <div className="col-2 col-sm-12"></div>
          <div className="col-4 col-sm-12">
            <button
              className="btn btn-primary btn-block"
              onClick={onSubmit}
              disabled={resetState.successMessage ? true : false}
            >
              Reset Password
            </button>
          </div>
        </div>

        <div className="form-group mt-4">
          <div className="col-2 col-sm-12"></div>
          <div className="col-4 col-sm-12">
            <Link to="/account/sign-in">Go to login!</Link>
          </div>
        </div>
      </form>
    </>
  );
};
