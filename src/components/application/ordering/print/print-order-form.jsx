import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import _ from "lodash";

import {
  turnTimeParser,
  dateParser,
  moneyFormatParser
} from "../../../../_utils";
import FormInputSelect from "../../../../_utils/forms/form-input-select";

import {
  handleProductSidesOptionParser,
  handleAttributeOptionParser,
  attributeOptionValueParser,
  productPricingCalculate,
  productOneParser,
  filterProductResult
} from "../../../../_project-utils";

import PrintOrderShipping from "./print-order-shipping";
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

    activeProductQuantityId: productParser.activeProductQuantityId,
    activeProductQuantityIndex: productParser.activeProductQuantityIndex,

    activeProductSidesCode: productParser.activeProductSidesCode,
    activeProductSides: productParser.activeProductSides,
    selectedAttributes: productParser.selectedAttributes
  });

  const [orderState, setOrderState] = useState({
    jobName: "",
    invoiceNote: "",
    calcDays: 0,
    calcWeight: 0,
    calcPrice: 0
  });

  const handleChangeSize = e => {
    const activeProductSizeId = e.target.value;

    const activeProductQuantity = product.productSizes.find(
      f => f._id === activeProductSizeId
    ).quantities[0];

    const activeProductSizeIndex = product.productSizes.findIndex(
      f => f._id === activeProductSizeId
    );

    setOrderProductState({
      ...orderProductState,
      activeProductSizeId,
      activeProductSizeIndex: activeProductSizeIndex,
      activeProductQuantityId: activeProductQuantity._id,
      activeProductQuantityIndex: 0,
      activeProductSidesCode: activeProductQuantity.sides,
      activeProductSides: activeProductQuantity.sides === "_2" ? 2 : 1
    });
  };

  const handleChangeQuantity = e => {
    const activeProductQuantity = product.productSizes
      .find(f => f._id === orderProductState.activeProductSizeId)
      .quantities.find(q => q._id === e.target.value);

    const activeProductQuantityIndex = product.productSizes
      .find(f => f._id === orderProductState.activeProductSizeId)
      .quantities.findIndex(q => q._id === e.target.value);

    setOrderProductState({
      ...orderProductState,
      activeProductQuantityId: activeProductQuantity._id,
      activeProductQuantityIndex: activeProductQuantityIndex,
      activeProductSidesCode: activeProductQuantity.sides,
      activeProductSides: activeProductQuantity.sides === "_2" ? 2 : 1,
      activeProductSizeIndex: 0
    });
  };

  const handleChangeSides = e => {
    setOrderProductState({
      ...orderProductState,
      activeProductSides: e.target.value
    });
  };

  const handleAttributeOptionChange = (e, attributeIndex) => {
    const optionId = e.target.value;
    const tempState = _.cloneDeep(orderProductState);

    const optionIndex =
      e.target.name === "1"
        ? e.target.value
        : product.attributes[attributeIndex].options.findIndex(
            f => f._id === optionId
          );

    tempState.selectedAttributes[attributeIndex].optionIndex = optionIndex;
    tempState.selectedAttributes[attributeIndex].optionId = optionId;
    setOrderProductState({ ...tempState });
  };

  const setThePricing = useCallback(
    orderProductState => {
      const productSizes = product.productSizes.find(
        f => f._id === orderProductState.activeProductSizeId
      );

      const obj = {
        itemType: "print",
        activeProductSizeId: orderProductState.activeProductSizeId,
        productSizes,
        activeProductQuantityId: orderProductState.activeProductQuantityId,
        activeProductSides: orderProductState.activeProductSides,
        attributes: product.attributes,
        selectedAttributes: orderProductState.selectedAttributes
      };

      const pricing = productPricingCalculate(obj, "edit");
      return pricing;
    },
    [product.productSizes, product.attributes]
  );

  useEffect(() => {
    console.clear();
    if (!orderProductState.activeProductSizeId) return;
    if (_.isEqual(currentOrderProductState.current, orderProductState)) return;
    const pricing = setThePricing(orderProductState);
    currentOrderProductState.current = orderProductState;

    setOrderState(orderState => ({
      ...orderState,
      calcPrice: pricing.itemPrice,
      calcDays: pricing.turnTime,
      calcWeight: pricing.shipping.weight
    }));
  }, [currentOrderProductState, orderProductState, setThePricing]);

  // useEffect(() => {
  //   let stillHere = true;
  //   if (!orderProductState.activeProductSizeId) return;

  //   const obj = {
  //     itemType: "print",
  //     activeProductSizeId: orderProductState.activeProductSizeId,
  //     productSizes: product.productSizes.find(
  //       f => f._id === orderProductState.activeProductSizeId
  //     ),
  //     activeProductQuantityId: orderProductState.activeProductQuantityId,
  //     activeProductSides: orderProductState.activeProductSides,
  //     attributes: product.attributes,
  //     selectedAttributes: orderProductState.selectedAttributes
  //   };

  //   if (stillHere === true) {
  //     const pricing = productPricingCalculate(obj, "edit");
  //     setOrderState(orderState => ({
  //       ...orderState,
  //       calcPrice: pricing.itemPrice,
  //       calcDays: pricing.turnTime,
  //       calcWeight: pricing.shipping.weight
  //     }));
  //   }

  //   return () => {
  //     stillHere = false;
  //   };
  // }, [orderProductState]);

  const handleFormSubmit = async e => {
    e.preventDefault();

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
        itemType: "print",
        name: orderState.jobName,
        itemPrice: orderState.calcPrice,
        shipping: { price: 0, weight: orderState.calcWeight },
        turnTime: orderState.calcDays,
        weight: orderState.calcWeight
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

    try {
      const { data } = await http.post(`invoices/storeFront`, { ...obj });
      if (data.error.errorCode === "0x0") {
        await dispatch(getUserShoppingCartItems());
        history.push(`/print/upload/${data.dataSet.orderId}`);
      }
    } catch (error) {
      console.log(170, error);
    }
  };

  const productSize = product.productSizes.find(
    f => f._id === orderProductState.activeProductSizeId
  );

  const formQuantities = productSize ? productSize.quantities : [];

  const quantity = product.productSizes
    .find(f => f._id === orderProductState.activeProductSizeId)
    .quantities.find(q => q._id === orderProductState.activeProductQuantityId)
    .quantity;

  const lableSize = ["col-5 col-sm-12", "col-7 col-sm-12"];

  const stockCheck = product.attributes.find(f => f.systemType === "stock");
  const turnTimeCheck = product.attributes.find(
    f => f.systemType === "turnTime"
  );

  return (
    <>
      <div className="card">
        <form className="form-horizontal p-0">
          <FormInputSelect
            labelSize={lableSize}
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
            labelSize={lableSize}
            type="select"
            name="product-quantity"
            displayName="Qty"
            value={orderProductState.activeProductQuantityId}
            onChange={e => handleChangeQuantity(e)}
            theOptions={formQuantities.map((m, index) => (
              <option key={index} value={m._id}>
                {m.quantity}
              </option>
            ))}
          />

          <FormInputSelect
            labelSize={lableSize}
            type="select"
            name="product-sides"
            displayName="Sides"
            value={orderProductState.activeProductSides}
            onChange={e => handleChangeSides(e)}
            theOptions={handleProductSidesOptionParser(orderProductState)}
          />

          {product.attributes.map((m, index) => (
            <FormInputSelect
              key={index}
              labelSize={lableSize}
              type="select"
              name={m.type}
              displayName={m.name}
              value={attributeOptionValueParser(orderProductState, m._id)}
              onChange={e => handleAttributeOptionChange(e, index)}
              theOptions={handleAttributeOptionParser(m, index)}
            />
          ))}

          <div className="card print-order-form-pricing-div">
            <div className="price">
              ${moneyFormatParser(orderState.calcPrice)}
            </div>

            <div>
              Price per piece: {(orderState.calcPrice / quantity).toFixed(2)}
              <br />
              {turnTimeCheck && (
                <>
                  Your order will print within {orderState.calcDays} business
                  day(s). <br />
                  Latest ship date:{" "}
                  {dateParser(
                    turnTimeParser(Date.now(), orderState.calcDays),
                    "md"
                  )}{" "}
                </>
              )}
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

      {orderState.calcWeight > 0 &&
        stockCheck &&
        theSystem.shippingModules.isActive && (
          <PrintOrderShipping
            weight={orderState.calcWeight}
            lableSize={lableSize}
          />
        )}
    </>
  );
};
