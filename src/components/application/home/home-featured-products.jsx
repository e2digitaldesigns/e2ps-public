import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import PageHeader from "../../template/main-content/page-header";

export default () => {
  const products = useSelector(state => state.system.products);
  return (
    <>
      <PageHeader pageName="Featured Products" />
      <div className="featured-products-holder">
        {products.print
          .filter(f => f.isFeatured === true)
          .map((m, i) => (
            <div key={i} className="card featured-products-card">
              <div className="card-image">
                <Link to={`/print/${m.url}`}>
                  <img
                    className="img-responsive"
                    src={imageParser(
                      m.images,
                      "product-image-homepage-featured"
                    )}
                    alt={m.displayName}
                  />
                </Link>
              </div>

              <div className="card-header">
                {/* <div className="card-title h5 mb-2">{m.displayName}</div> */}

                <Link
                  to={`/print/${m.url}`}
                  className="btn btn-primary btn-block"
                >
                  ORDER NOW!
                  {/* <span className="material-icons">add_shopping_cart</span> */}
                </Link>

                {/* <div className="card-subtitle text-gray">Software and hardware</div> */}
              </div>
              {/* <div className="card-body">
                Print postcards wholesale with custom sizes, unique stocks,
                premium finishes and more.
              </div> */}
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
