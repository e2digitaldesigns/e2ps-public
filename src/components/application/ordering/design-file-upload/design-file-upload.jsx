import React from "react";
// import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import http from "./../../../../utils/httpServices";
import PageHeader from "../../../template/main-content/page-header";
import { Link } from "react-router-dom";

import PageEmpty from "../../_page-utils/page-empty";

export default props => {
  const dispatch = useDispatch();
  const shoppingCart = useSelector(state => state.shoppingCart);
  // const [loaderState, setLoaderState] = useState(0);
  const orderId = props.match.params.id;

  let item = null;
  if (shoppingCart.dataSet.storeInvoiceItems) {
    item = shoppingCart.dataSet.storeInvoiceItems.find(f => f._id === orderId);
  }

  const handleFileUploads = async acceptedFiles => {
    // setLoaderState(0);
    dispatch({ type: "UPDATE_SHOPPING_CART_PARTIAL_PENDING" });

    var formData = new FormData();
    for (let i = 0; i < acceptedFiles.length; i++) {
      formData.append("file", acceptedFiles[i]);
    }

    formData.append("imageType", "designFiles");
    formData.append("orderId", orderId);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", process.env.REACT_APP_REST_API + "fileUpload");

    xhr.upload.addEventListener("progress", e => {
      // const percent = e.lengthComputable ? (e.loaded / e.total) * 100 : 0;
      // setLoaderState(percent);
    });

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        // setLoaderState(0);
        const data = JSON.parse(xhr.response);

        if (data.error.errorCode === "0x0") {
          const payload = {
            id: orderId,
            obj: { type: "designImageUpload" },
            dataSet: data.dataSet.item.images
          };
          dispatch({ type: "UPDATE_SHOPPING_CART_PARTIAL_SUCCESS", payload });
        } else {
          dispatch({ type: "UPDATE_SHOPPING_CART_PARTIAL_FAILURE" });
        }
      }
    };

    xhr.send(formData);
  };

  const handleFileRemove = async imageId => {
    dispatch({ type: "UPDATE_SHOPPING_CART_PARTIAL_PENDING" });

    try {
      const { data } = await http.delete(`fileUpload/${orderId}/${imageId}`);

      if (data.error.errorCode === "0x0") {
        const payload = {
          id: orderId,
          obj: { type: "designImageDelete" },
          dataSet: { ...data.dataSet, imageId }
        };

        dispatch({ type: "UPDATE_SHOPPING_CART_PARTIAL_SUCCESS", payload });
      } else {
        dispatch({ type: "UPDATE_SHOPPING_CART_PARTIAL_FAILURE" });
      }
    } catch (error) {
      console.error(95, error);
    }
  };

  if (!item) {
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
      <PageHeader pageName="Upload Design Item Files" />

      <Dropzone
        onDrop={acceptedFiles => handleFileUploads(acceptedFiles)}
        multiple
        accept="image/png, image/gif, image/jpeg"
        minSize={0}
        maxSize={5242880}
      >
        {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
          <div className="design-upload-dropzone-pad" {...getRootProps()}>
            <input {...getInputProps()} />

            {!isDragActive && "Click here or drop a file to upload!"}
            {isDragActive && !isDragReject && "Drop it like it's hot!"}
            {isDragReject && "File type not accepted, sorry!"}
          </div>
        )}
      </Dropzone>

      <div className="design-upload-wrapper">
        {item.item.images.map((m, i) => (
          <div key={i} className="design-image-holder">
            <div className="image">
              <img
                className="img-responsive"
                src={process.env.REACT_APP_CLOUD + m.thumb}
                alt={i}
              />
            </div>
            <div className="info">ImageId: {m.imageId}</div>
            <button
              className="btn btn-sm btn-primary btn-flex"
              onClick={() => handleFileRemove(m._id)}
            >
              <span className="btn-icon material-icons">delete</span>
              Remove
            </button>
          </div>
        ))}
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
