"use client";

import { useGettestimonials } from "@/hook/testimonial";
import { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Subtitle from "./Subtitle";
import Testimonial from "./Testimonial";
import { useIntersectionObserver } from "./language-context";

const ArrowButton = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className={`transition-all duration-150 border border-[#EBEBEB] bg-transparent hover:bg-primary-1/5 rounded-full w-8 sm:w-10 md:w-[50px] h-8 sm:h-10 md:h-[50px] flex items-center justify-center text-[#585858] hover:text-black focus:outline-none cursor-pointer`}
    aria-label={direction === "next" ? "Next" : "Previous"}
    type="button"
  >
    {direction === "next" ? (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <path
          d="M7 5l5 5-5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <path
          d="M13 5l-5 5 5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  </button>
);

const settings = {
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: false,
  swipeToSlide: true,
  touchThreshold: 30,
  responsive: [
    {
      breakpoint: 1280,
      settings: { slidesToShow: 3 },
    },
    {
      breakpoint: 991,
      settings: { slidesToShow: 2 },
    },
    {
      breakpoint: 575,
      settings: { slidesToShow: 1 },
    },
  ],
};

const Testimonials = () => {
  const sliderRef = useRef();
  const { isVisible, elementRef } = useIntersectionObserver();

  const { testimonials } = useGettestimonials(1, 100000);

  return (
    <section ref={elementRef} className="bg-[#FAFAFA] py-16 md:py-20 lg:py-24">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-end justify-between gap-4">
          <div>
            <div
              className={`transition-all duration-1000 ease-out ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-[-100px] opacity-0"
              }`}
            >
              <Subtitle text="What our partners say" />
            </div>
            <h2
              className={`text-black text-3xl md:text-4xl lg:text-[40px] font-medium transition-all duration-1000 ease-out delay-200 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-[-100px] opacity-0"
              }`}
            >
              Trusted by farmers & <br className="hidden md:block" /> businesses
              worldwide.
            </h2>
          </div>
          {/* Arrows */}
          <div
            className={`flex items-center gap-1 transition-all duration-1000 ease-out delay-400 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-[-100px] opacity-0"
            }`}
          >
            <ArrowButton
              direction="prev"
              onClick={() => sliderRef.current?.slickPrev()}
            />
            <ArrowButton
              direction="next"
              onClick={() => sliderRef.current?.slickNext()}
            />
          </div>
        </div>

        <div
          className={`transition-all duration-1000 ease-out delay-600 ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "translate-x-[-100px] opacity-0"
          }`}
        >
          <Slider
            {...settings}
            ref={sliderRef}
            className="mt-10 equal-height-slider -mx-2.5 overflow-hidden"
          >
            {testimonials.map((t, idx) => (
              <div key={idx} className="px-2.5 flex h-full">
                <Testimonial {...t} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
