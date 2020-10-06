import React from "react";

import SecondaryFooter from "./secondary-footer";
import PrimaryFooter from "./primary-footer";

export default () => {
  return (
    <>
      <div className="storefront-footer-wrapper">
        <PrimaryFooter />
        <SecondaryFooter />
      </div>
    </>
  );
};
