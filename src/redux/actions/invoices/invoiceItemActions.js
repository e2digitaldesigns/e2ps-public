import * as actions from "../actionTypes";
import http from "../../../utils/httpServices";
import jwtDecode from "jwt-decode";

export const getUserInvoiceItems = (type, pagination) => {
  return async dispatch => {
    dispatch({ type: actions.GET_INVOICES_ITEMS_PENDING });

    const token = jwtDecode(
      localStorage.getItem(process.env.REACT_APP_JWT_TOKEN)
    );

    try {
      const { data } = await http.get(
        `/invoices/user/${token._id}/${type}?page=${pagination.page}&mr=${pagination.results}&st=${pagination.st}`
      );

      if (data.error.errorCode !== "0x0") {
        throw data;
      }

      dispatch({ type: actions.GET_INVOICES_ITEMS_SUCCESS, payload: data });

      return data;
    } catch (error) {
      dispatch({
        type: actions.GET_INVOICES_ITEMS_FAILURE,
        payload: error,
      });

      return error;
    }
  };
};
