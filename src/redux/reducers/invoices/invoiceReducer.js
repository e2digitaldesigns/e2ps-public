import _ from "lodash";
import * as actions from "../../actions/actionTypes";

const defaultState = {
  pending: false,
  dataSet: [],
  error: null,
};

const reducer = (state = defaultState, action) => {
  let theState = _.cloneDeep(state);
  const { type, payload } = action;

  switch (type) {
    case actions.GET_INVOICE_PENDING:
      return { ...theState, pending: true, dataSet: [], error: null };

    case actions.GET_INVOICE_SUCCESS:
      return {
        ...theState,
        pending: false,
        dataSet: payload.invoice,
        error: null,
      };

    case action.GET_INVOICE_FAILURE:
      return {
        ...theState,
        pending: false,
        dataSet: [],
        error: null,
      };

    default:
      return theState;
  }
};

export default reducer;
