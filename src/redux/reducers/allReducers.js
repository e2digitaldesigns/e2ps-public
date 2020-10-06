import { combineReducers } from "redux";

import systemReducer from "./system/systemReducer";
import userReducer from "./user/userAuthReducer";
import userAccountReducer from "./user/userAccountReducer";
import invoiceItemReducer from "./invoices/invoiceItemReducer";
import invoiceReducer from "./invoices/invoiceReducer";
import productReducer from "./ordering/productReducer";
import shoppingCartReducer from "./shopping-cart/shoppingCartReducer";

const allReducers = combineReducers({
  system: systemReducer,
  user: userReducer,
  userAccount: userAccountReducer,
  shoppingCart: shoppingCartReducer,
  invoiceItems: invoiceItemReducer,
  invoice: invoiceReducer,
  product: productReducer,
});

export default allReducers;
