import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateShoppingCartPartial } from "./../../../../redux/actions/shopping-cart/shoppingCartActions";

export default ({ orderId }) => {
  const dispatch = useDispatch();
  const shoppingCart = useSelector(state => state.shoppingCart);
  const [linkState, setLinkState] = useState({ links: [] });
  const linkLimit = 10;

  useEffect(() => {
    let stillHere = true;

    if (!shoppingCart.dataSet) return;

    const item = shoppingCart.dataSet.storeInvoiceItems.find(
      f => f._id === orderId
    );

    if (stillHere) {
      setLinkState(linkState => ({
        ...linkState,
        links: item.item.imageLinks
      }));
    }

    return () => {
      stillHere = false;
    };
  }, [shoppingCart, orderId]);

  const handleLinks = (action, index = null) => {
    const links = [...linkState.links];

    if (action === 1) {
      links.push({ link: "" });
    } else {
      links.splice(index, 1);
    }

    if (links.length <= linkLimit) {
      setLinkState({ ...linkState, links });
    }
  };

  const handleLinkChange = (e, index) => {
    const links = [...linkState.links];
    links[index].link = e.target.value;
    setLinkState({ ...linkState, links });
  };

  const handleUpdateLinks = async () => {
    const obj = {
      type: "imageLinks",
      imageLinks: linkState.links
    };

    try {
      await dispatch(updateShoppingCartPartial(orderId, obj));
    } catch (error) {
      console.error(error);
    }
  };

  const imgCount = linkState.links.length;

  return (
    <>
      <div className="inner-page-header">Provide Download Links</div>

      <div className="alert alert-success my-5">
        Provide up to {linkLimit} links. (Dropbox, Google DriveTM, WeTransfer,
        Hightail, etc)
      </div>

      <div className="link-holders">
        {linkState.links.map((m, index) => (
          <div key={index} className="input-group py-4">
            <input
              type="text"
              className="form-input"
              placeholder="http://www.cloudSerivce.com/yourFile"
              value={m.link}
              onChange={e => handleLinkChange(e, index)}
            />
            <button
              className="btn btn-danger input-group-btn"
              onClick={() => handleLinks(0, index)}
            >
              <span className="material-icons">delete</span>
            </button>
          </div>
        ))}
      </div>

      <button
        className="btn btn-default-light mt-2 mr-3 btn-flex"
        onClick={() => handleLinks(1)}
      >
        <span className="material-icons btn-icon">add</span>Add New Image Link (
        {imgCount})
      </button>

      <button
        className="btn btn-default-light mt-2 mx-3 btn-flex"
        onClick={handleUpdateLinks}
      >
        <span className="material-icons btn-icon">save</span>Save Changes
      </button>
    </>
  );
};
