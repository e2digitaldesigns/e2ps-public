import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default ({ orderId }) => {
  const shoppingCart = useSelector(state => state.shoppingCart);
  const [itemState, setItemState] = useState({
    displayName: "",
    dpi: "300",
    margin: "0.125",
    size: "",
  });

  useEffect(() => {
    let stillHere = true;

    if (!shoppingCart.dataSet) return;

    const item = shoppingCart.dataSet.storeInvoiceItems.find(
      f => f._id === orderId
    );

    const size = item.parsedAttributes.find(f => f.name === "Size").value;
    if (!size) return;

    const product = item.theItem.productSizes.find(f => f.size === size);
    if (!product) return;

    if (stillHere) {
      setItemState(itemState => ({
        displayName: item.displayName,
        dpi: product.dpi,
        margin: product.margin,
        size: size,
      }));
    }

    return () => {
      stillHere = false;
    };
  }, [shoppingCart, orderId]);

  return (
    <>
      <div className="inner-page-header">Upload Images</div>

      <div className="my-5">
        Guidelines & File Format Specifications <br />
        {itemState.displayName}
        <br />
        File Types: PDF, JPG <br />
        Max Upload Size: 85MB <br />
        Resolution: {itemState.dpi} dpi <br />
        Image Size: {itemState.size} <br />
        Bleed Size: {itemState.margin} inch
      </div>

      <div className="alert alert-warning my-5">
        <span className="material-icons">warning</span> Files over 25MB will not
        generate a preview image.
        <br /> <span className="material-icons">warning</span> For files over
        85MB please provide download links
        <hr className="my-5" />
        <span>
          Files must be less than 85MB to upload. For files that are over 85MB,
          try uploading your file to a file transfer/cloud storage service.
          <br />
          Click the Download Links link and paste the links in the fields
          provided. We have accepted files from Dropbox, Google DriveTM,
          WeTransfer, Hightail, etc.
          <br /> We will download your file & contact you with any questions.
        </span>
      </div>
    </>
  );
};
