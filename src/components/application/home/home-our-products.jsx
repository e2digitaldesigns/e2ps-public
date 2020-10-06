import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import PageHeader from "../../template/main-content/page-header";

export default () => {
  const products = useSelector(state => state.system.products);
  return (
    <>
      <PageHeader pageName="Our Products" />
      <div className="our-products-holder">
        {products.print.map((m, i) => (
          <div key={i} className="card our-products-card">
            <div className="card-image">
              <img
                className="img-responsive"
                src={imageParser(m.images, "product-image-homepage")}
                alt={m.displayName}
              />
            </div>
            <div className="card-footer">
              <Link to={`/print/${m.url}`}>{m.displayName}</Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const imageParser = (data, type) => {
  let img = process.env.REACT_APP_CLOUD + process.env.REACT_APP_DEFAULT_IMAGE;
  if (data) {
    const index = data.findIndex(f => f.imageType === type);
    img = index > -1 ? process.env.REACT_APP_CLOUD + data[index].file : img;
  }

  return img;
};
