import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserInvoice } from "../../../../redux/actions/invoices/invoiceActions";
import { dateParser, moneyFormatParser } from "../../../../_utils";

import PageHeader from "../../../template/main-content/page-header";
import InvoiceImages from "./order-history-invoice-images";

export default props => {
  const dispatch = useDispatch();
  const invoice = useSelector(state => state.invoice.dataSet);
  const invoiceId = props.match.params.id;

  const [documentState, setDocumentState] = useState({
    docReady: false
  });

  useEffect(() => {
    let stillHere = true;

    async function loadData() {
      try {
        const result = await dispatch(getUserInvoice(invoiceId));

        if (result.error.errorCode === "0x0" && stillHere === true) {
          setDocumentState(documentState => ({
            ...documentState,
            docReady: true
          }));
        }
      } catch (err) {}
    }

    loadData();

    return () => {
      stillHere = false;
    };
  }, [dispatch, invoiceId]);

  if (documentState.docReady === false) return <></>;

  return (
    <>
      <PageHeader pageName="About Your Order" />

      <div className="storefront-invoice-grid storefront-invoice-grid-information">
        <div className="information-left">Company Name</div>

        <div className="information-right">
          Invoice Id: {invoice.invoiceId}
          <br />
          {dateParser(invoice.date, "lg")}
        </div>

        <div className="information-left">
          Express Layouts
          <br />
          8332 W. Outerdrive
          <br />
          Sunnvay, CA, 90210
        </div>

        <div className="information-right">
          {invoice.customers.contact.company && (
            <>
              <span>{invoice.customers.contact.company}</span>
              <br />
            </>
          )}
          {`${invoice.customers.contact.firstName} ${invoice.customers.contact.lastName}`}
          <br />
          {invoice.customers.contact.email}
        </div>
      </div>

      <div className="storefront-invoice-grid storefront-invoice-grid-header">
        <div>Images</div>
        {/* <div>Item Name</div> */}
        <div>Item Details</div>
        <div className="totals">SubTotal</div>
      </div>

      {invoice.storeInvoiceItems.map((m, index) => (
        <div
          key={index}
          className="storefront-invoice-grid storefront-invoice-grid-item"
        >
          <div>
            <InvoiceImages images={m.item.images} />
          </div>

          <div>
            {m.parsedDetails.map((a, i) => (
              <span key={i}>
                <span className="invoice-label">{a.name}:</span> {a.value}
                <br />
              </span>
            ))}

            {m.parsedAttributes.map((a, i) => (
              <span key={i}>
                <span className="invoice-label">{a.name}:</span> {a.value}
                <br />
              </span>
            ))}

            {m.needPayment && (
              <button className="btn btn-primary">
                Pay Now - ${m.paymentDue}
              </button>
            )}
          </div>
          <div className="totals">${moneyFormatParser(m.item.itemPrice)}</div>
        </div>
      ))}

      <div className="storefront-invoice-grid storefront-invoice-grid-totals">
        <div>Subtotal</div>
        <div className="totals">
          $ {moneyFormatParser(invoice.invoicePricing.subTotal)}
        </div>
        <div>Shipping & Handling</div>
        <div className="totals">
          $ {moneyFormatParser(invoice.invoicePricing.shippingPrice)}
        </div>

        <div>Grand Total</div>
        <div className="totals">
          $ {moneyFormatParser(invoice.invoicePricing.grandTotal)}
        </div>

        <div>Balance</div>
        <div className="totals">
          $ {moneyFormatParser(invoice.invoicePricing.paymentDue)}
        </div>

        {invoice.invoicePricing.needPayment && (
          <>
            <div></div>
            <div className="totals">
              <button className="btn btn-primary btn-block">Pay Now</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

//  let pricing = {
//    amountPaid: 0,
//    invoicePrice: 0,
//    shippingPrice: 0,
//    shippingAmountPaid: 0,
//  };
