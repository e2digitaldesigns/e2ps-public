import * as actions from "../actionTypes";
import http from "../../../utils/httpServices";
import jwtDecode from "jwt-decode";

export const getUserInvoice = id => {
  return async dispatch => {
    dispatch({ type: actions.GET_INVOICE_PENDING });

    try {
      const token = jwtDecode(
        localStorage.getItem(process.env.REACT_APP_JWT_TOKEN)
      );

      if (!token) {
        const help = "xxx";
        throw help;
      }

      const { data } = await http.get(`/invoices/${id}`);

      if (data.error.errorCode !== "0x0") {
        throw data;
      }

      dispatch({ type: actions.GET_INVOICE_SUCCESS, payload: data });

      return data;
    } catch (error) {
      dispatch({
        type: actions.GET_INVOICE_FAILURE,
        payload: error
      });

      return error;
    }
  };
};
