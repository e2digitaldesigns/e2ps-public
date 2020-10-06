import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import Glide from "@glidejs/glide";

export default () => {
  const storeFrontSettings = useSelector(
    state => state.system.storeFrontSettings
  );

  const images = storeFrontSettings.template.images.homeCarousel
    ? storeFrontSettings.template.images.homeCarousel
    : [];

  useEffect(() => {
    new Glide(".glide", {
      type: "slider",
      startAt: 0,
      perView: 1,
      gap: 0,
      autoplay: 5000,
      animationDuration: 800,
      animationTimingFunc: "ease-in-out"
    }).mount();
  }, []);

  return (
    <>
      <div className="carousel-holder glide">
        <div data-glide-el="track" className="glide__track">
          <ul className="glide__slides">
            {images.map((m, i) => (
              <li key={i} className="glide__slide">
                <img
                  className="img-responsive"
                  src={process.env.REACT_APP_CLOUD + m.file}
                  alt=""
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="glide__arrows" data-glide-el="controls">
          <button
            className="glide__arrow glide__arrow--left"
            data-glide-dir="<"
          >
            prev
          </button>
          <button
            className="glide__arrow glide__arrow--right"
            data-glide-dir=">"
          >
            next
          </button>
        </div>

        {/* <div className="glide__bullets" data-glide-el="controls[nav]">
          {images.map((m, i) => (
            <button
              key={i}
              className="glide__bullet"
              data-glide-dir={`=${i}`}
            ></button>
          ))}
        </div> */}
      </div>
    </>
  );
};
