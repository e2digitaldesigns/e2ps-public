import React from "react";
import Carousel from "./home-carousel";
import FeaturedProducts from "./home-featured-products";
import OurProducts from "./home-our-products";

export default () => {
  return (
    <>
      <div className="home-container">
        <div className="carousel-holder-wrapper">
          <Carousel />
        </div>

        <div className="featured-products-holder-wrapper">
          <FeaturedProducts />
        </div>

        <div className="our-products-holder-wrapper">
          <OurProducts />
        </div>
      </div>
    </>
  );
};
