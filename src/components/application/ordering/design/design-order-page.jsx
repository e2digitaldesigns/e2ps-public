import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../../template/main-content/page-header";
import OrderImage from "./../order-images";
import OrderInformation from "../order-information";
import DesignOrderForm from "./design-order-form";

import { getProduct } from "./../../../../redux/actions/ordering/productActions";

export default props => {
  const dispatch = useDispatch();
  const productState = useSelector(state => state.product);
  const [documentState, setDocumentState] = useState({ docReady: false });

  useEffect(() => {
    let stillHere = true;

    setDocumentState(documentState => ({
      ...documentState,
      docReady: false,
    }));

    const loadProduct = async () => {
      try {
        const result = await dispatch(getProduct(props.match.params.url));

        if (result.error.errorCode === "0x0" && stillHere === true) {
          setDocumentState(documentState => ({
            ...documentState,
            docReady: true,
          }));
        } else {
          throw result;
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadProduct();

    return () => {
      stillHere = false;
    };
  }, [dispatch, props.match.params.url]);

  if (productState.error !== null) return <>...error</>;

  if (!documentState.docReady) return <>...loading</>;

  return (
    <>
      <PageHeader pageName={`Design / ${productState.product.displayName}`} />

      <div className="storefront-order-wrapper">
        <div className="storefront-order-info-wrapper">
          <OrderImage type="design" />
          <OrderInformation type="design" />
        </div>

        <div className="form-holder">
          <DesignOrderForm props={props} />
        </div>
      </div>
    </>
  );
};
