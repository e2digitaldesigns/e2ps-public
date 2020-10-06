import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../../template/main-content/page-header";
import { Link } from "react-router-dom";
import { moneyFormatParser } from "../../../../_utils";
import { deleteUserShoppingCartItems } from "../../../../redux/actions/shopping-cart/shoppingCartActions";

import PageEmpty from "../../_page-utils/page-empty";
import InvoiceImages from "./../../account/order-history/order-history-invoice-images";

export default () => {
  const dispatch = useDispatch();
  const shoppingCart = useSelector(state => state.shoppingCart.dataSet);

  const handleRemoveItem = async id => {
    try {
      await dispatch(deleteUserShoppingCartItems(id));
    } catch (error) {}
  };

  const count =
    shoppingCart && shoppingCart.storeInvoiceItems
      ? shoppingCart.storeInvoiceItems.length
      : 0;

  if (count === 0) {
    return (
      <>
        <PageEmpty
          pageName="Account / Shopping Cart"
          icon="shopping_cart"
          title="You have no items in your shopping cart!"
          subTitle="Click the button to start shopping!"
        />
      </>
    );
  }

  return (
    <>
      <PageHeader pageName="Account / Shopping Cart" />

      <div className="shopping-cart-wrapper">
        <div className="shopping-cart-item-wrapper">
          <div className="shopping-cart-item-files header">Files</div>
          <div className="shopping-cart-item-information header">
            Item Information
          </div>
          <div className="shopping-cart-item-price header display-lg-only">
            Price
          </div>
          <div className="shopping-cart-item-options header">Options</div>

          {shoppingCart.storeInvoiceItems &&
            shoppingCart.storeInvoiceItems.map((m, index) => (
              <React.Fragment key={index}>
                <div className="shopping-cart-item-files">
                  {m.itemType === "design" && (
                    <Link
                      to={`/design/upload/${m._id}`}
                      className="btn btn-warning btn-block btn-flex mt-5"
                    >
                      <span className="btn-icon material-icons">backup</span>
                      Upload New Files
                    </Link>
                  )}

                  {m.itemType !== "design" && (
                    <>
                      <InvoiceImages images={m.item.images} />
                      <Link
                        to={`/print/upload/${m._id}`}
                        className="btn btn-warning btn-block btn-flex mt-5"
                      >
                        <span className="btn-icon material-icons">backup</span>
                        Upload New Files
                      </Link>{" "}
                    </>
                  )}
                </div>
                <div className="shopping-cart-item-information">
                  <ul>
                    <li className="hidden-lg">
                      Price: ${moneyFormatParser(m.item.itemPrice)}
                    </li>
                    {m.parsedDetails.map((attr, x) => (
                      <li key={x}>
                        {attr.name}: {attr.value}
                      </li>
                    ))}

                    {m.parsedAttributes.map((attr, x) => (
                      <li key={x}>
                        {attr.name}: {attr.value}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="shopping-cart-item-price display-lg-only">
                  ${moneyFormatParser(m.item.itemPrice)}
                </div>
                <div className="shopping-cart-item-options">
                  <button className="btn btn-primary btn-block btn-flex">
                    <span className="btn-icon material-icons">edit</span>
                    Edit Item
                  </button>
                  <button
                    className="btn btn-danger btn-block btn-flex"
                    onClick={() => handleRemoveItem(m._id)}
                  >
                    <span className="btn-icon material-icons">delete</span>
                    Remove Item
                  </button>
                </div>
              </React.Fragment>
            ))}
        </div>

        <div className="shopping-cart-pricing-wrapper">
          <div className="shopping-cart-coupon-holder card">
            <div className="input-group">
              <input
                type="text"
                className="form-input"
                placeholder="coupon code..."
              />
              <button className="btn btn-primary input-group-btn btn-flex">
                <span className="btn-icon material-icons">monetization_on</span>
                Apply Coupon Code
              </button>
            </div>
          </div>
          <div className="shopping-cart-pricing-holder">
            <div className="label">Subtotal:</div>
            <div>
              $
              {shoppingCart.invoicePricing &&
                moneyFormatParser(shoppingCart.invoicePricing.subTotal)}
            </div>
            <div className="label">Shipping:</div>
            <div>
              $
              {shoppingCart.invoicePricing &&
                moneyFormatParser(shoppingCart.invoicePricing.shippingPrice)}
            </div>
            <div className="label">Total:</div>
            <div>
              $
              {shoppingCart.invoicePricing &&
                moneyFormatParser(shoppingCart.invoicePricing.grandTotal)}
            </div>
          </div>
        </div>

        <div className="shopping-cart-button-wrapper">
          <div className="btn-group">
            <button className="btn btn-secondary btn-lg btn-flex">
              <span className="btn-icon material-icons">arrow_back_ios</span>
              Continue Shopping
            </button>
            <Link
              to="/account/check-out-1"
              className="btn btn-success btn-lg btn-flex"
            >
              <span className="btn-icon material-icons">shopping_basket</span>
              Secure Checkout
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
