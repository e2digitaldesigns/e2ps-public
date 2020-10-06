import _ from "lodash";
import * as actions from "./../../actions/actionTypes";

export default (
  state = {
    pending: false,
    dataSet: false,
    error: null
  },
  action
) => {
  const { type, payload } = action;
  let index,
    theState = _.cloneDeep(state);

  switch (type) {
    case actions.GET_SHOPPING_CART_ITEM_PENDING:
      return { ...state, pending: true, dataSet: false, error: null };

    case actions.GET_SHOPPING_CART_ITEM_SUCCESS:
      return {
        ...state,
        pending: false,
        dataSet: payload,
        error: null
      };

    case actions.GET_SHOPPING_CART_ITEM_FAILURE:
      return { ...state, pending: false, dataSet: false, error: payload };

    case actions.UPDATE_SHOPPING_CART_PARTIAL_PENDING:
      return { ...state };

    case actions.UPDATE_SHOPPING_CART_PARTIAL_SUCCESS:
      index = theState.dataSet.storeInvoiceItems.findIndex(
        f => f._id === payload.id
      );

      switch (payload.obj.type) {
        case "imageLinks":
          theState.dataSet.storeInvoiceItems[index].item.imageLinks =
            payload.dataSet.item.imageLinks;
          return { ...theState };

        case "designImageUpload":
        case "printImageUpload":
          theState.dataSet.storeInvoiceItems[index].item.images =
            payload.dataSet;
          return { ...theState };

        default:
        case "designImageDelete":
        case "printImageDelete":
          // const filter = theState.dataSet.storeInvoiceItems[
          //   index
          // ].item.images.filter(f => String(f._id) !== payload.dataSet.imageId);

          if (payload.dataSet.nModified === 1) {
            theState.dataSet.storeInvoiceItems[
              index
            ].item.images = theState.dataSet.storeInvoiceItems[
              index
            ].item.images.filter(
              f => String(f._id) !== payload.dataSet.imageId
            );
          }

          return { ...theState };
      }

    case actions.UPDATE_SHOPPING_CART_PARTIAL_FAILURE:
      return { ...state };

    case actions.DELETE_SHOPPING_CART_ITEM_PENDING:
      return { ...state, pending: true, error: null };

    case actions.DELETE_SHOPPING_CART_ITEM_SUCCESS:
      index = theState.dataSet.storeInvoiceItems.findIndex(
        f => f._id === payload.id
      );

      if (payload.result.deletedCount === 1) {
        theState.dataSet.invoicePricing.subTotal -=
          theState.dataSet.storeInvoiceItems[index].item.itemPrice;

        theState.dataSet.invoicePricing.shippingPrice -=
          theState.dataSet.storeInvoiceItems[index].item.shipping.price;

        theState.dataSet.invoicePricing.grandTotal -=
          theState.dataSet.storeInvoiceItems[index].item.itemPrice +
          theState.dataSet.storeInvoiceItems[index].item.shipping.price;

        theState.dataSet.storeInvoiceItems = theState.dataSet.storeInvoiceItems.filter(
          f => f._id !== payload.id
        );
      }

      return {
        ...theState,
        pending: false,
        error: null
      };

    case actions.DELETE_SHOPPING_CART_ITEM_FAILURE:
      return { ...state, pending: false, error: payload };

    case actions.EMPTY_SHOPPING_CART_PENDING:
      return { ...state, pending: true, error: null };

    case actions.EMPTY_SHOPPING_CART_SUCCESS:
      return {
        ...theState,
        pending: false,
        dataSet: false,
        error: null
      };

    case actions.EMPTY_SHOPPING_CART_FAILURE:
      return { ...state, pending: false, error: payload };

    default:
      return state;
  }
};
