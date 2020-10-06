import * as actions from "../actionTypes";
import http from "../../../utils/httpServices";

export const getUserShoppingCartItems = () => {
  return async dispatch => {
    dispatch({ type: actions.GET_SHOPPING_CART_ITEM_PENDING });

    try {
      const { data } = await http.get(`/shoppingCart/`);

      if (data.error.errorCode !== "0x0") {
        throw data;
      }

      dispatch({
        type: actions.GET_SHOPPING_CART_ITEM_SUCCESS,
        payload: data.dataSet
      });

      return data;
    } catch (error) {
      dispatch({
        type: actions.GET_SHOPPING_CART_ITEM_FAILURE,
        payload: error
      });

      return error;
    }
  };
};

export const updateShoppingCartPartial = (id, obj) => {
  return async dispatch => {
    dispatch({ type: actions.UPDATE_SHOPPING_CART_PARTIAL_PENDING });

    try {
      const { data } = await http.put(`/shoppingCart/partial/${id}`, { obj });

      if (data.error.errorCode !== "0x0") {
        throw data;
      }

      dispatch({
        type: actions.UPDATE_SHOPPING_CART_PARTIAL_SUCCESS,
        payload: { id, obj, dataSet: data.dataSet }
      });

      return data;
    } catch (error) {
      dispatch({
        type: actions.UPDATE_SHOPPING_CART_PARTIAL_FAILURE,
        payload: error
      });

      return error;
    }
  };
};

export const deleteUserShoppingCartItems = id => {
  return async dispatch => {
    dispatch({ type: actions.DELETE_SHOPPING_CART_ITEM_PENDING });

    try {
      const { data } = await http.delete(`/shoppingCart/${id}`);

      if (data.error.errorCode !== "0x0") {
        throw data;
      }

      dispatch({
        type: actions.DELETE_SHOPPING_CART_ITEM_SUCCESS,
        payload: { id, result: data.result }
      });

      return data;
    } catch (error) {
      dispatch({
        type: actions.DELETE_SHOPPING_CART_ITEM_FAILURE,
        payload: error
      });

      return error;
    }
  };
};

export const emptyUserShoppingCart = () => {
  return async dispatch => {
    dispatch({ type: actions.EMPTY_SHOPPING_CART_PENDING });

    try {
      dispatch({
        type: actions.EMPTY_SHOPPING_CART_SUCCESS,
        payload: {}
      });
    } catch (error) {
      dispatch({
        type: actions.EMPTY_SHOPPING_CART_FAILURE,
        payload: error
      });

      return error;
    }
  };
};
