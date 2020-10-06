import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import http from "./../../../../utils/httpServices";

export default ({ orderId, side = 1 }) => {
  const dispatch = useDispatch();
  const shoppingCart = useSelector(state => state.shoppingCart);
  const [loaderState, setLoaderState] = useState(0);
  const [imageState, setImageState] = useState({});

  let showImage = `${process.env.REACT_APP_CLOUD}_default-thumb.jpg`;
  let showImageRemove = false;

  if (imageState.thumb) {
    showImage = `${process.env.REACT_APP_CLOUD}${imageState.thumb}`;
    showImageRemove = true;
  }

  useEffect(() => {
    let stillHere = true;

    if (!shoppingCart.dataSet) return;

    const item = shoppingCart.dataSet.storeInvoiceItems.find(
      f => f._id === orderId
    );

    // if (!item.item.images.side) return;
    let displayImage = item.item.images.find(f => f.side === side);

    displayImage = displayImage ? displayImage : {};

    if (stillHere) {
      setImageState(imageState => ({
        ...displayImage
      }));
    }

    return () => {
      stillHere = false;
    };
  }, [side, shoppingCart, orderId]);

  const handleFileUploads = async (acceptedFiles, side) => {
    setLoaderState(0);
    dispatch({ type: "UPDATE_SHOPPING_CART_PARTIAL_PENDING" });

    var formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    formData.append("imageType", "printFiles");
    formData.append("side", side);
    formData.append("orderId", orderId);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", process.env.REACT_APP_REST_API + "fileUpload");

    xhr.upload.addEventListener("progress", e => {
      const percent = e.lengthComputable ? (e.loaded / e.total) * 100 : 0;
      setLoaderState(percent);
    });

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        setLoaderState(0);
        const data = JSON.parse(xhr.response);

        if (data.error.errorCode === "0x0") {
          const payload = {
            id: orderId,
            obj: { type: "printImageUpload" },
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

  const handleFileRemove = async () => {
    dispatch({ type: "UPDATE_SHOPPING_CART_PARTIAL_PENDING" });

    try {
      const { data } = await http.delete(
        `fileUpload/${orderId}/${imageState._id}`
      );

      if (data.error.errorCode === "0x0") {
        const payload = {
          id: orderId,
          obj: { type: "printImageDelete" },
          dataSet: { ...data.dataSet, imageId: imageState._id }
        };

        dispatch({ type: "UPDATE_SHOPPING_CART_PARTIAL_SUCCESS", payload });
      } else {
        dispatch({ type: "UPDATE_SHOPPING_CART_PARTIAL_FAILURE" });
      }
    } catch (error) {
      console.log(95, error);
    }
  };

  return (
    <>
      <div className="upload-thumb-holder">
        <div className="upload-thumb-remove-button">
          {showImageRemove && (
            <span className="material-icons md-3" onClick={handleFileRemove}>
              highlight_off
            </span>
          )}
        </div>
        <img src={showImage} className="upload-thumb" alt="9" />
        <div className="bar bar">
          <div
            className="bar-item"
            role="progressbar"
            style={{ width: `${loaderState}%` }}
            aria-valuenow={loaderState}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>

      <div className="">
        <Dropzone
          onDrop={acceptedFiles => handleFileUploads(acceptedFiles, side)}
          multiple={false}
          accept="image/jpeg, application/pdf"
          minSize={0}
          maxSize={5242880}
        >
          {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
            <div
              className="dropzone-pad btn btn-default-light"
              {...getRootProps()}
            >
              <input {...getInputProps()} />

              <span className="text">
                {!isDragActive && "Click here or drop a file to upload!"}
                {isDragActive && !isDragReject && "Drop it like it's hot!"}
                {isDragReject && "File type not accepted, sorry!"}
              </span>
            </div>
          )}
        </Dropzone>
      </div>
    </>
  );
};
