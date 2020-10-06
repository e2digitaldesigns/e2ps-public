import http from "../../../utils/httpServices";
import * as actions from "../actionTypes";

export const fetchSystemInformation = () => {
  return async dispatch => {
    dispatch({ type: actions.GET_SYSTEM_INFORMATION_PENDING });
    try {
      const { data } = await http.get("/system/storeFront");

      if (data.error.errorCode !== "0x0") {
        throw data;
      }

      dispatch({
        type: actions.GET_SYSTEM_INFORMATION_SUCCESS,
        payload: data,
      });

      return data;
    } catch (error) {
      console.log(18, error);

      dispatch({
        type: actions.GET_SYSTEM_INFORMATION_FAILURE,
        payload: error,
      });

      return error;
    }
  };
};
