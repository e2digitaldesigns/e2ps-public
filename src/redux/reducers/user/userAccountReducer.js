import _ from "lodash";
import * as actions from "../../actions/actionTypes";

const defaultState = {
  pending: false,
  dataSet: {},
  error: null,
};

const reducer = (state = defaultState, action) => {
  let theState = _.cloneDeep(state);
  const { type, payload } = action;

  switch (type) {
    case actions.GET_USER_ACCOUNT_PENDING:
      return { ...state, pending: true, dataSet: {}, error: null };

    case actions.GET_USER_ACCOUNT_SUCCESS:
      return {
        ...state,
        pending: false,
        dataSet: payload.dataSet,
        error: null,
      };

    case action.GET_USER_ACCOUNT_FAILURE:
      return {
        ...state,
        pending: false,
        dataSet: {},
        error: null,
      };

    case actions.UPDATE_USER_ACCOUNT_PENDING:
      return { ...state, pending: true, error: null };

    case actions.UPDATE_USER_ACCOUNT_SUCCESS:
      switch (payload.formData.updateType) {
        case "storeFrontShippingProfiles":
          theState.dataSet.shippingProfiles = _.cloneDeep(
            payload.formData.dataSet
          );
          break;

        default:
        case "storeFrontContact":
          theState.dataSet.contact = {
            ...payload.formData.dataSet,
          };
          break;
      }

      return theState;

    case actions.UPDATE_USER_ACCOUNT_FAILURE:
      return {
        ...state,
        pending: false,
        error: null,
      };

    default:
      return state;
  }
};

export default reducer;
