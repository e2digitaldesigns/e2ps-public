import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import _ from "lodash";

import { moneyFormatParser } from "../../../../_utils";
import FormInputSelect from "../../../../_utils/forms/form-input-select";

import {
  handleProductSidesOptionParser,
  productPricingCalculate,
  productOneParser,
  filterProductResult
} from "../../../../_project-utils";

import http from "./../../../../utils/httpServices";
import { getUserShoppingCartItems } from "./../../../../redux/actions/shopping-cart/shoppingCartActions";

export default () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const theUser = useSelector(state => state.user);
  const theSystem = useSelector(state => state.system);
  const theProduct = useSelector(state => state.product.product);
  const currentOrderProductState = useRef();

  let product = filterProductResult(theProduct);
  const productParser = productOneParser(product);

  const [orderProductState, setOrderProductState] = useState({
    activeProductSizeId: productParser.activeProductSizeId,
    activeProductSizeIndex: productParser.activeProductSizeIndex,
    activeProductSidesCode: productParser.activeProductSidesCode,
    activeProductSides: productParser.activeProductSides
  });

  const [orderState, setOrderState] = useState({
    jobName: "",
    designTheme: "",
    designInfoSide1: "",
    designInfoSide2: "",
    invoiceNote: "",
    calcPrice: 0
  });

  useEffect(() => {
    console.log(46);
    if (!orderProductState.activeProductSizeId) return;
    if (_.isEqual(currentOrderProductState.current, orderProductState)) return;

    let stillHere = true;

    const obj = {
      itemType: "design",
      activeProductSizeId: orderProductState.activeProductSizeId,
      productSizes: product.productSizes.find(
        f => f._id === orderProductState.activeProductSizeId
      ),

      activeProductSides: orderProductState.activeProductSides
    };

    if (stillHere) {
      const pricing = productPricingCalculate(obj, "edit");
      currentOrderProductState.current = orderProductState;
      setOrderState(orderState => ({
        ...orderState,
        calcPrice: pricing.itemPrice
      }));
    }

    return () => {
      stillHere = false;
    };
  }, [product, currentOrderProductState, orderProductState]);

  const handleOrderStateChange = e => {
    let { name, value } = e.target;
    setOrderState({ ...orderState, [name]: value });
  };

  const handleChangeSize = e => {
    const activeProductSizeId = e.target.value;
    const activeProductSizeIndex = product.productSizes.findIndex(
      f => f._id === activeProductSizeId
    );

    setOrderProductState({
      ...orderProductState,
      activeProductSizeId,
      activeProductSizeIndex: activeProductSizeIndex,
      activeProductSides: 1
    });
  };

  const handleChangeSides = e => {
    setOrderProductState({
      ...orderProductState,
      activeProductSides: e.target.value
    });
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    console.clear();

    const invoiceObj = {
      storeOwnerId: theSystem.storeOwnerId,
      storeFrontId: theSystem.storeFrontId,
      invoiceId: "xxxxx-xxxxx-xxxxx",
      customers: theUser.loggedIn ? theUser.dataSet._id : null
    };

    const itemObj = {
      storeFrontId: theSystem.storeFrontId,
      invoiceId: "xxxxx-xxxxx-xxxxx",
      customerId: theUser.loggedIn ? theUser.dataSet._id : null,
      orderItem: {
        itemType: "design",
        name: orderState.jobName,
        itemPrice: orderState.calcPrice,
        designTheme: orderState.designTheme,
        designInfoSide1: orderState.designInfoSide1,
        designInfoSide2: orderState.designInfoSide2
      },
      theItem: {
        _id: product._id,
        displayName: product.displayName,
        productSizes: product.productSizes,
        attributes: product.attributes,
        selections: { ...orderProductState }
      }
    };

    const obj = { invoiceObj, itemObj };
    // console.log(128, obj);

    try {
      const { data } = await http.post(`invoices/storeFront`, { ...obj });
      console.log(135, data);
      if (data.error.errorCode === "0x0") {
        await dispatch(getUserShoppingCartItems());
        history.push(`/design/upload/${data.dataSet.orderId}`);
      }
    } catch (error) {
      console.log(170, error);
    }
  };

  const labelSize = ["col-5 col-sm-12", "col-7 col-sm-12"];

  return (
    <>
      <div className="card">
        <form className="form-horizontal p-0">
          <FormInputSelect
            labelSize={labelSize}
            name="jobName"
            displayName="Order Name"
            value={orderState.jobName}
            onChange={e => handleOrderStateChange(e)}
          />
          <FormInputSelect
            labelSize={labelSize}
            type="select"
            name="product-size"
            displayName="Size"
            value={orderProductState.activeProductSizeId}
            onChange={e => handleChangeSize(e)}
            theOptions={product.productSizes.map(
              (m, index) =>
                m.isActive && (
                  <option key={index} value={m._id}>
                    {m.size}
                  </option>
                )
            )}
          />

          <FormInputSelect
            labelSize={labelSize}
            type="select"
            name="product-sides"
            displayName="Sides"
            value={orderProductState.activeProductSides}
            onChange={e => handleChangeSides(e)}
            theOptions={handleProductSidesOptionParser(orderProductState)}
          />

          <FormInputSelect
            labelSize={[null, "col-12"]}
            type="textarea"
            name="designTheme"
            displayName="Theme"
            placeholder="Theme: The theme is how you would like the image to look. If needed provide examples to better help describe your theme. Do not blindly use adjectives... ex: do not tell us to make the design"
            value={orderState.designTheme}
            onChange={e => handleOrderStateChange(e)}
          />

          <FormInputSelect
            labelSize={[null, "col-12"]}
            type="textarea"
            rows={10}
            name="designInfoSide1"
            displayName="Side 1"
            placeholder="Information for side one:  Information that is not typed is this section will not be on side one."
            value={orderState.designInfoSide1}
            onChange={e => handleOrderStateChange(e)}
          />

          {orderProductState.activeProductSides === "2" && (
            <FormInputSelect
              labelSize={[null, "col-12"]}
              type="textarea"
              rows={10}
              name="designInfoSide2"
              displayName="Side 2"
              placeholder="Information for side two:  Information that is not typed is this section will not be on side two."
              value={orderState.designInfoSide2}
              onChange={e => handleOrderStateChange(e)}
            />
          )}
          <div className="card print-order-form-pricing-div">
            <div className="price">
              ${moneyFormatParser(orderState.calcPrice)}
            </div>
          </div>
          <button
            className="btn btn-primary btn-block btn-flex"
            onClick={handleFormSubmit}
          >
            <span className="btn-icon material-icons">shopping_cart</span>
            Add to Cart
          </button>
        </form>
      </div>
    </>
  );
};
