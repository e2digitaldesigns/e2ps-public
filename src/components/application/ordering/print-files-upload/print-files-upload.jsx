import React, { useState } from "react";
import { useSelector } from "react-redux";
import PageHeader from "../../../template/main-content/page-header";
import { Link } from "react-router-dom";

import PageEmpty from "../../_page-utils/page-empty";
import PrintFileUploadInfo from "./print-files-upload-info";
import PrintFileDownloadLinks from "./print-files-download-links";
import PrintFileUploadForm from "./print-files-upload-form";

export default props => {
  // const dispatch = useDispatch();
  const shoppingCart = useSelector(state => state.shoppingCart);
  const productState = useSelector(state => state.product);
  // const [documentState, setDocumentState] = useState({ docReady: true });
  const [viewState, setViewState] = useState(1);
  const orderId = props.match.params.id;

  let itemCheck = null;
  if (shoppingCart.dataSet.storeInvoiceItems) {
    itemCheck = shoppingCart.dataSet.storeInvoiceItems.find(
      f => f._id === orderId
    );
  }

  const handleViewChange = (e, type) => {
    e.preventDefault();
    setViewState(type);
  };

  if (productState.error !== null) return <>...error</>;

  // if (!documentState.docReady) return <>...loading</>;

  if (!itemCheck) {
    return (
      <>
        <PageEmpty
          pageName="Upload Print Item Files"
          icon="backup"
          title="Sorry! No order was found!"
          subTitle=""
        />
      </>
    );
  }

  return (
    <>
      <PageHeader pageName="Upload Print Item Files" />

      <ul className="tab tab-bloc mb-6">
        <li className="tab-item active">
          <a href="/#" onClick={e => handleViewChange(e, 1)}>
            Upload Images
          </a>
        </li>
        <li className="tab-item">
          <a href="/#" onClick={e => handleViewChange(e, 2)}>
            Download Links
          </a>
        </li>
      </ul>

      <div className="print-upload-wrapper">
        <div className="print-upload-content">
          {viewState === 1 && <PrintFileUploadInfo orderId={orderId} />}
          {viewState === 2 && <PrintFileDownloadLinks orderId={orderId} />}
        </div>
        <div className="print-upload-form-holder">
          <div>
            <PrintFileUploadForm orderId={orderId} side={1} />
          </div>
          <div>
            <PrintFileUploadForm orderId={orderId} side={2} />
          </div>
        </div>
      </div>

      <div>
        <hr className="my-6" />
        <Link to="/account/shopping-cart" className="btn btn-primary  btn-flex">
          <span className="material-icons btn-icon">shopping_cart</span> Go to
          Shopping Cart
        </Link>
      </div>
    </>
  );
};
