import * as actions from "../../actions/actionTypes";

const defaultState = {
  pending: false,
  loggedIn: false,
  dataSet: {},
  error: null
};

const reducer = (state = defaultState, action) => {
  let theState = { ...state };
  const { type, payload } = action;

  switch (type) {
    case actions.USER_LOGIN_PENDING:
      return { ...theState, pending: true, dataSet: {}, error: null };

    case actions.USER_LOGIN_SUCCESS:
      return {
        ...theState,
        pending: false,
        loggedIn: true,
        dataSet: {
          ...payload
        },
        error: null
      };

    case action.USER_LOGIN_FAILURE:
      return {
        ...theState,
        pending: false,
        loggedIn: false,
        dataSet: {},
        error: null
      };

    case actions.USER_STATUS_TRUE:
      return {
        ...theState,
        pending: false,
        loggedIn: true,
        dataSet: {
          _id: payload._id,
          email: payload.email,
          name: payload.name,
          storeFrontId: payload.storeFrontId
        },
        error: null
      };

    case actions.USER_STATUS_FALSE:
      return defaultState;

    case actions.USER_LOGOUT:
      return defaultState;

    default:
      return state;
  }
};

export default reducer;
