import React, { useEffect, useState } from "react";

import SquarePaymentForm from "./square-payment-form";

export default ({ paymentForm, paymentInfoObj }) => {
  const [isSquareLoaded, setIsSquareLoaded] = useState(false);

  useEffect(() => {
    let sqPaymentScript = document.createElement("script");
    sqPaymentScript.src = process.env.REACT_APP_SQUARE_PAYMENT_SCRIPT;
    sqPaymentScript.crossOrigin = "anonymous";
    sqPaymentScript.type = "text/javascript";
    sqPaymentScript.async = false;
    sqPaymentScript.onload = () => {
      setIsSquareLoaded(true);
    };

    document.getElementsByTagName("head")[0].appendChild(sqPaymentScript);
  }, []);

  useEffect(() => {}, []);

  const squarePayment = isSquareLoaded ? (
    <SquarePaymentForm
      paymentForm={window.SqPaymentForm}
      paymentInfoObj={paymentInfoObj}
    />
  ) : null;

  return <>{<div>{squarePayment}</div>}</>;
};
