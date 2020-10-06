import * as actions from "../actionTypes";
import http from "../../../utils/httpServices";
import jwtDecode from "jwt-decode";

export const getUserSettings = userData => {
  return async dispatch => {
    dispatch({ type: actions.GET_USER_ACCOUNT_PENDING });

    const token = jwtDecode(
      localStorage.getItem(process.env.REACT_APP_JWT_TOKEN)
    );

    try {
      const { data } = await http.get(`/customers/${token._id}`, { userData });

      if (data.error.errorCode !== "0x0") {
        throw data;
      }

      dispatch({ type: actions.GET_USER_ACCOUNT_SUCCESS, payload: data });

      return data;
    } catch (error) {
      dispatch({
        type: actions.GET_USER_ACCOUNT_FAILURE,
        payload: error,
      });

      return error;
    }
  };
};

export const updateUserSettings = formData => {
  let url;
  return async dispatch => {
    dispatch({ type: actions.UPDATE_USER_ACCOUNT_PENDING });

    const token = jwtDecode(
      localStorage.getItem(process.env.REACT_APP_JWT_TOKEN)
    );

    switch (formData.updateType) {
      case "storeFrontShippingProfiles":
        url = "/customers/shippingProfiles/";
        break;

      default:
        url = "/customers/";
    }

    try {
      const { data } = await http.put(`${url}${token._id}`, { formData });

      if (data.error.errorCode !== "0x0") {
        throw data;
      }

      dispatch({
        type: actions.UPDATE_USER_ACCOUNT_SUCCESS,
        payload: { data, formData },
      });

      return data;
    } catch (error) {
      dispatch({
        type: actions.UPDATE_USER_ACCOUNT_FAILURE,
        payload: error,
      });

      return error;
    }
  };
};
