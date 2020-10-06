import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import http from "../../../utils/httpServices";
import PageHeader from "../../template/main-content/page-header";
import FormInputSelect from "../../../_utils/forms/form-input-select";

export default props => {
  const history = useHistory();
  const system = useSelector(state => state.system);

  const [documentState, setDocumentState] = useState({
    docReady: false,
    error: false
  });

  const [state, setState] = useState({
    userId: "",
    password1: "",
    password2: ""
  });

  useEffect(() => {
    let stillHere = true;

    async function appMount() {
      try {
        const { data } = await http.get(
          `/passwordReset/${props.match.params.id}`
        );

        if (data.error.errorCode === "0x0" && stillHere === true) {
          setDocumentState(documentState => ({
            ...documentState,
            docReady: true
          }));

          setState(state => ({
            ...state,
            userId: data.result.userId
          }));
        } else {
          throw data;
        }
      } catch (error) {
        console.error("System Error", error);
        setDocumentState(documentState => ({
          ...documentState,
          error: true
        }));
      }
    }

    appMount();

    return () => {
      stillHere = false;
    };
  }, [props.match.params.id]);

  const onChange = e => {
    e.preventDefault();
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    if (state.password1 !== state.password2) {
      alert("Passwords must match!");
      return;
    }

    try {
      const { data } = await http.put(
        `/passwordReset/${props.match.params.id}`,
        {
          resetId: props.match.params.id,
          type: "public",
          userId: state.userId,
          password: state.password1,
          storeOwnerId: system.storeOwnerId
        }
      );

      if (data.error.errorCode !== "0x0") {
        throw data.error;
      } else {
        history.push("/account/sign-in");
      }
    } catch (error) {
      alert("There was an error! Please contact the web site administator.");
      return;
    }
  };

  if (documentState.error)
    return (
      <>
        {" "}
        <PageHeader pageName="Password Reset" />{" "}
        <h3>This link is no longer available...</h3>
      </>
    );

  return (
    <>
      {" "}
      <PageHeader pageName="Password Reset" />
      <form className="form-horizontal">
        <FormInputSelect
          type="password"
          name="password1"
          displayName="Password"
          value={state.password1}
          onChange={e => onChange(e)}
        />

        <FormInputSelect
          type="password"
          name="password2"
          displayName="Confirm Password"
          value={state.password2}
          onChange={e => onChange(e)}
        />

        <div className="form-group">
          <div className="col-2 col-sm-12"></div>
          <div className="col-4 col-sm-12">
            <button className="btn btn-primary btn-block" onClick={onSubmit}>
              Reset Password
            </button>
          </div>
        </div>

        <div className="form-group mt-4">
          <div className="col-2 col-sm-12"></div>
          <div className="col-4 col-sm-12">
            <Link to="/account/sign-in">Go to Login</Link>
          </div>
        </div>
      </form>
    </>
  );
};
