import _ from "lodash";
import * as actions from "../../actions/actionTypes";

const defaultState = {
  pending: false,
  dataSet: [],
  total: 0,
  error: null,
};

const reducer = (state = defaultState, action) => {
  let theState = _.cloneDeep(state);
  const { type, payload } = action;

  switch (type) {
    case actions.GET_INVOICES_ITEMS_PENDING:
      return { ...theState, pending: true, dataSet: [], total: 0, error: null };

    case actions.GET_INVOICES_ITEMS_SUCCESS:
      return {
        ...theState,
        pending: false,
        dataSet: payload.dataSet,
        total: payload.totalResults,
        error: null,
      };

    case action.GET_INVOICES_ITEMS_FAILURE:
      return {
        ...theState,
        pending: false,
        dataSet: [],
        total: 0,
        error: null,
      };

    default:
      return state;
  }
};

export default reducer;
