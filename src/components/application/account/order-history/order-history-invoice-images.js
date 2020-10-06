import React, { useEffect, useState } from "react";

export default ({ images }) => {
  const [imageState, setImageState] = useState([true, false]);

  const changeImg = img => {
    if (img === 0) {
      setImageState([true, false]);
    } else {
      setImageState([false, true]);
    }
  };

  useEffect(() => {
    let stillHere = true;

    if (stillHere && !images[0]) {
      setImageState(imageState => imageState => [false, true]);
    }

    return () => {
      stillHere = false;
    };
  }, [images]);

  return (
    <>
      <div className="invoice-images-holder">
        {images.map(
          (m, i) =>
            m &&
            m.thumb && (
              <img
                key={i}
                className={`invoice-images ${!imageState[i] && "image-hide"}`}
                src={`${process.env.REACT_APP_CLOUD}${m.thumb}`}
                alt=""
              />
            )
        )}
      </div>

      <div className="btn-group btn-group-block">
        {images.map(
          (m, i) =>
            m &&
            m.thumb && (
              <button
                key={i}
                className="btn btn-primary"
                onClick={() => changeImg(i)}
              >
                {i ? (
                  <span>
                    <span className="invoice-img-btn-txt sm">2</span>
                    <span className="invoice-img-btn-txt nm">2</span>
                  </span>
                ) : (
                  <span>
                    <span className="invoice-img-btn-txt sm">1</span>
                    <span className="invoice-img-btn-txt nm">1</span>
                  </span>
                )}
              </button>
            )
        )}
      </div>
    </>
  );
};
