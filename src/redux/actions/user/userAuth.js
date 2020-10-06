import * as actions from "../actionTypes";
import http from "../../../utils/httpServices";

export const userLogin = userData => {
  return async dispatch => {
    dispatch({ type: actions.USER_LOGIN_PENDING });

    try {
      const { data } = await http.post(`/auth/storeFront`, { userData });

      if (data.error.errorCode !== "0x0") {
        throw data;
      }

      await localStorage.setItem(process.env.REACT_APP_JWT_TOKEN, data.token);

      dispatch({ type: actions.USER_LOGIN_SUCCESS, payload: data.dataSet });

      return data;
    } catch (error) {
      dispatch({
        type: actions.USER_LOGIN_FAILURE,
        payload: error,
      });

      return error;
    }
  };
};

export const userStatusCheck = payload => {
  return async dispatch => {
    try {
      if (payload.status === true) {
        dispatch({ type: actions.USER_STATUS_TRUE, payload });
      } else {
        dispatch({ type: actions.USER_STATUS_FALSE, payload });
      }
    } catch (err) {
      console.log(41, err);
    }
  };
};

export const userLogout = () => {
  return async dispatch => {
    try {
      await localStorage.removeItem(process.env.REACT_APP_JWT_TOKEN);
      await localStorage.removeItem(process.env.REACT_APP_SESSION_TOKEN);
      dispatch({ type: actions.USER_LOGOUT });
    } catch (err) {
      console.log(52, err);
    }
  };
};
