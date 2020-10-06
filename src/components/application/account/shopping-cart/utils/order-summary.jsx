import React from "react";
import { useSelector } from "react-redux";
import moneyFormatParser from "../../../../../_utils/numbers/moneyFormatParser";

export default ({ shipping = null }) => {
  const shoppingCart = useSelector(state => state.shoppingCart.dataSet);
  const shippingPrice = shipping ? moneyFormatParser(shipping.amount) : "0.00";

  let total = "0.00";

  if (shoppingCart.invoicePricing) {
    total = shipping
      ? moneyFormatParser(
          parseFloat(shoppingCart.invoicePricing.grandTotal) +
            parseFloat(shipping.amount)
        )
      : moneyFormatParser(shoppingCart.invoicePricing.grandTotal);
  }
  return (
    <div className="card processing-card">
      <h3 className="custom-header">Order Summary</h3>

      <table className="table order-summary-table">
        <thead>
          <tr>
            <th>
              {" "}
              <span className="hidden-sm">Order</span> Id
            </th>
            <th>Item Name</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {shoppingCart.storeInvoiceItems &&
            shoppingCart.storeInvoiceItems.map((m, index) => (
              <tr key={index}>
                <td>{m.orderId}</td>
                <td>{m.displayName}</td>
                <td>{moneyFormatParser(m.item.itemPrice)}</td>
              </tr>
            ))}

          <tr>
            <td colSpan="2" className="table-pricing">
              Subtotal
            </td>
            <td>
              {shoppingCart.invoicePricing &&
                moneyFormatParser(shoppingCart.invoicePricing.subTotal)}
            </td>
          </tr>

          <tr>
            <td colSpan="2" className="table-pricing">
              Shipping
            </td>
            <td>
              {shippingPrice}
              {/* {shoppingCart.invoicePricing &&
                moneyFormatParser(shoppingCart.invoicePricing.shippingPrice)} */}
            </td>
          </tr>

          <tr>
            <td colSpan="2" className="table-pricing">
              Total
            </td>
            <td>{total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
