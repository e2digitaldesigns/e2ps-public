import React from "react";
import { useSelector } from "react-redux";

export default ({ type }) => {
  const productState = useSelector(state => state.product.product);
  let productInformation;

  switch (type) {
    case "design":
      productInformation = productState.designDesc;
      break;

    default:
    case "print":
      productInformation = productState.printDesc;
      break;
  }

  return (
    <>
      <div className="information-holder">
        {productInformation.split("\n").map((item, key) => {
          return (
            <React.Fragment key={key}>
              {item}
              <br />
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};
