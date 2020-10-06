import React from "react";
import { useSelector } from "react-redux";

export default ({ type }) => {
  const productState = useSelector(state => state.product.product);
  let imageType;

  switch (type) {
    case "design":
      imageType = "product-image-profile-design";
      break;

    default:
    case "print":
      imageType = "product-image-profile-print";
      break;
  }

  let img = null;
  let index = -2;

  if (productState.images) {
    index = productState.images.findIndex(f => f.imageType === imageType);

    img =
      index > -1
        ? process.env.REACT_APP_CLOUD + productState.images[index].file
        : img;
  }

  return (
    <>
      {img && (
        <div className="x" style={{ width: "100%" }}>
          <img src={img} style={{ width: "100%" }} alt="" />
        </div>
      )}
    </>
  );
};
