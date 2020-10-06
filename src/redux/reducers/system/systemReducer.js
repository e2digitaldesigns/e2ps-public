import * as actions from "./../../actions/actionTypes";

export default (
  state = {
    pending: false,
    systemLoaded: false,
    error: null,
  },
  action
) => {
  const { type, payload } = action;

  switch (type) {
    case actions.GET_SYSTEM_INFORMATION_PENDING:
      return { ...state, pending: true, systemLoaded: false, error: null };

    case actions.GET_SYSTEM_INFORMATION_SUCCESS:
      return {
        ...state,
        pending: false,
        systemLoaded: true,
        ...payload,
        error: null,
      };

    case actions.GET_SYSTEM_INFORMATION_FAILURE:
      return { ...state, pending: false, systemLoaded: false, error: payload };

    default:
      return state;
  }
};
