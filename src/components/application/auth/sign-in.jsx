import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";

import { userLogin } from "../../../redux/actions/user/userAuth";
import { getUserShoppingCartItems } from "../../../redux/actions/shopping-cart/shoppingCartActions";

import PageHeader from "../../template/main-content/page-header";

import FormInputSelect from "../../../_utils/forms/form-input-select";

export default props => {
  const dispatch = useDispatch();
  const system = useSelector(state => state.system);
  const user = useSelector(state => state.user);
  const [state, setState] = useState({
    emailAddress: "captainPhasma@email.com",
    password: "332310"
  });

  const [loginState, SetLoginState] = useState({ errorMessage: null });

  const onChange = e => {
    e.preventDefault();
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    const result = await dispatch(
      userLogin({
        emailAddress: state.emailAddress,
        password: state.password,
        storeFrontId: system.storeFrontId
      })
    );

    if (result.error.errorCode === "0x0") {
      await dispatch(getUserShoppingCartItems());
    }

    if (result.error.errorCode !== "0x0") {
      SetLoginState({ ...loginState, errorMessage: result.error.errorDesc });
    }
  };

  if (user.loggedIn) {
    return <Redirect to="/account/history/orders" />;
  }

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

        <FormInputSelect
          type="password"
          name="password"
          displayName="Password"
          value={state.password}
          onChange={e => onChange(e)}
        />

        {loginState.errorMessage && (
          <div className="form-group my-2">
            <div className="col-2 col-sm-12"></div>
            <div className="col-4 col-sm-12">{loginState.errorMessage}</div>
          </div>
        )}

        <div className="form-group">
          <div className="col-2 col-sm-12"></div>
          <div className="col-4 col-sm-12">
            <button className="btn btn-primary btn-block" onClick={onSubmit}>
              Log In
            </button>
          </div>
        </div>

        <div className="form-group mt-4">
          <div className="col-2 col-sm-12"></div>
          <div className="col-4 col-sm-12">
            <Link to="/account/pwd">Forgot your password?</Link> |{" "}
            <Link to="/account/register">Create new account?</Link>
          </div>
        </div>
      </form>
    </>
  );
};
