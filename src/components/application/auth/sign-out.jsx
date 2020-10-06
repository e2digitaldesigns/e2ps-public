import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { randomIds } from "./../../../_utils";
import { userLogout } from "../../../redux/actions/user/userAuth";
import { emptyUserShoppingCart } from "../../../redux/actions/shopping-cart/shoppingCartActions";

const Logout = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    async function logOut() {
      await dispatch(userLogout());
      await dispatch(emptyUserShoppingCart());
      localStorage.removeItem(process.env.REACT_APP_JWT_TOKEN);
      localStorage.setItem(process.env.REACT_APP_SESSION_TOKEN, randomIds());
      history.push("/home");
    }

    logOut();
  }, [dispatch, history]);

  try {
  } catch (error) {}

  return <div />;
};

export default Logout;
