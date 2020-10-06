import React from "react";
// import PageHeader from "../../../template/main-content/page-header";
import PageEmpty from "../../_page-utils/page-empty";

export default () => {
  return (
    <>
      {/* <PageHeader pageName="Thank you for ordering" /> */}

      <PageEmpty
        pageName="Thank you for ordering!"
        icon="shopping_cart"
        title="Thank you, your order has been placed!"
        // subTitle="Click the button to start shopping!"
      />
    </>
  );
};
