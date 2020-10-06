import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { moneyFormatParser } from "../../../_utils";

export default () => {
  const shoppingCart = useSelector(state => state.shoppingCart.dataSet);

  const count = shoppingCart.storeInvoiceItems
    ? shoppingCart.storeInvoiceItems.length
    : 0;

  const subTotal = shoppingCart.invoicePricing
    ? shoppingCart.invoicePricing.subTotal
    : 0.0;

  return (
    <>
      <div className="dropdown header-shopping-cart-dropdown">
        <button
          href="#"
          className="btn btn-primary btn-flex header-shopping-cart-dropdown-btn dropdown-toggle"
          tabIndex="0"
        >
          Shopping Cart: {count} {count !== 1 ? "items" : "item"} - $
          {moneyFormatParser(subTotal)}
          <span className="material-icons md-18">arrow_drop_down</span>
        </button>

        <ul className="menu header-shopping-cart">
          {shoppingCart.storeInvoiceItems &&
            shoppingCart.storeInvoiceItems.map((m, index) => (
              <li key={index}>
                <span className="itemName">{m.displayName}</span>
                <span className="itemPrice">
                  ${moneyFormatParser(m.item.itemPrice)}
                </span>
              </li>
            ))}

          {count > 0 && (
            <li className="header-shopping-cart-actions">
              <div className="btn-group btn-group-block">
                <Link
                  to="/account/shopping-cart"
                  className="btn btn-sm btn-secondary"
                >
                  Go To Cart
                </Link>

                <Link
                  to="/account/check-out-1"
                  className="btn btn-sm btn-secondary"
                >
                  Check Out
                </Link>
              </div>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};
