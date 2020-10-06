import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { emptyUserShoppingCart } from "../../../../../../../redux/actions/shopping-cart/shoppingCartActions";

import http from "./../../../../../../../utils/httpServices";

export default ({ paymentInfoObj }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const shoppingCart = useSelector(state => state.shoppingCart);
  // const [squareState, setSquareState] = useState({ requestCardNonce: false });

  useMemo(async () => {
    window.thePaymentForm = new window.SqPaymentForm({
      applicationId: "sandbox-sq0idb-Q0Pdj_9u1Fa6nYFvxi2p6g",
      inputClass: "sq-input",
      autoBuild: false,

      inputStyles: [
        {
          fontSize: "16px",
          lineHeight: "24px",
          padding: "4px 8px",
          placeholderColor: "#a0a0a0",
          backgroundColor: "#fff"
        }
      ],

      cardNumber: {
        elementId: "sq-card-number",
        placeholder: "Card Number"
      },
      cvv: {
        elementId: "sq-cvv",
        placeholder: "CVV"
      },
      expirationDate: {
        elementId: "sq-expiration-date",
        placeholder: "MM/YY"
      },
      postalCode: {
        elementId: "sq-postal-code",
        placeholder: "Postal"
      },

      callbacks: {
        cardNonceResponseReceived: async function (errors, nonce, cardData) {
          if (errors) {
            console.error("Encountered errors:");
            errors.forEach(function (error) {
              console.error("  " + error.message);
            });
            return;
          }

          const paymentObj = {
            invoiceId: shoppingCart.dataSet._id,
            nonce: nonce,
            paymentInfoObj: {
              paymentAmount: document.querySelector("#coSqaurePaymentAmount")
                .value,
              theShipping: {
                service: document.querySelector("#coSqaureShippingService")
                  .value,
                amount: document.querySelector("#coSqaureShippingAmount").value
              }
            }
          };

          try {
            const { data } = await http.post(
              `paymentProcessing/square/storeFront/capture`,
              paymentObj
            );

            if (data.error.errorCode === "0x0") {
              console.log(64, data.error);
              await dispatch(emptyUserShoppingCart());
              history.push("/account/check-out-4");
            }
          } catch (error) {
            console.log(108, error);
          }
        }
      }
    });

    window.thePaymentForm.build();
  }, [dispatch, history, shoppingCart.dataSet._id]);

  // const requestCardNonce = async e => {
  //   e.preventDefault();
  //   await window.thePaymentForm.requestCardNonce();
  //   setSquareState({ ...squareState, requestCardNonce: true });
  // };

  return (
    <div>
      <input
        type="hidden"
        id="coSqaurePaymentAmount"
        value={paymentInfoObj.paymentAmount}
      ></input>
      <input
        type="hidden"
        id="coSqaureShippingService"
        value={paymentInfoObj.theShipping.service}
      ></input>
      <input
        type="hidden"
        id="coSqaureShippingAmount"
        value={paymentInfoObj.theShipping.amount}
      ></input>

      <div className="form-group mb-4">
        <div className="col-sm-12">
          <div className="sq-form-control" id="sq-card-number"></div>
        </div>
      </div>

      <div className="form-group mb-4">
        <div className="col-sm-12">
          <div className="sq-form-control" id="sq-expiration-date"></div>
        </div>
      </div>

      <div className="form-group mb-4">
        <div className="col-sm-12">
          <div className="sq-form-control" id="sq-cvv"></div>
        </div>
      </div>

      <div className="form-group mb-4">
        <div className="col-sm-12">
          <div className="sq-form-control" id="sq-postal-code"></div>
        </div>
      </div>
    </div>
  );
};
