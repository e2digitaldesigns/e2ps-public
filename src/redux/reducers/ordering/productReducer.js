// import * as actions from "../../actions/actionTypes";

const defaultState = {
  pending: false,
  product: {},
  error: null,
};

const reducer = (state = defaultState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "GET_PRODUCT_PENDING":
      return { ...state, pending: true, product: {}, error: null };

    case "GET_PRODUCT_SUCCESS":
      return {
        ...state,
        pending: false,
        product: payload.product,
        error: null,
      };

    case "GET_PRODUCT_FAILURE":
      return { ...state, pending: false, product: {}, error: null };

    default:
      return state;
  }
};

export default reducer;
