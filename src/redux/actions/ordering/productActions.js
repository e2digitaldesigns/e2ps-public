import * as actions from "./../../actions/actionTypes";
import http from "./../../../utils/httpServices";

export const getProduct = url => {
  return async dispatch => {
    dispatch({ type: actions.GET_PRODUCT_PENDING });

    try {
      const { data } = await http.get(`/products/products/storeFront/${url}`);

      if (data.error.errorCode !== "0x0") {
        throw data;
      }

      dispatch({ type: actions.GET_PRODUCT_SUCCESS, payload: data });

      return data;
    } catch (error) {
      console.log(18, error);

      dispatch({
        type: actions.GET_PRODUCT_FAILURE,
        payload: error,
      });

      return error;
    }
  };
};
