"use client";
import Image from "next/image";
import Button from "../common/Button";
import { useIntersectionObserver } from "./language-context";

const Banner = ({
  bg = "/assets/images/banner-bg.webp",
  title = "Grow something great together.",
  dsc = "",
  buttonText = "Get started",
}) => {
  const { isVisible, elementRef } = useIntersectionObserver();
  return (
    <section ref={elementRef} className="my-16 md:my-20 lg:my-24">
      <div className="container ">
        <div className="relative w-full rounded-2xl overflow-hidden pt-[70px] pb-[60px] flex items-center justify-center group">
          <Image
            src={bg}
            fill
            alt="Banner background"
            className="absolute inset-0 w-full h-full object-cover object-center scale-100 group-hover:scale-105  transition-transform duration-700"
          />
          {/* <div className="absolute inset-0 bg-black/40" /> */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
            <h2
              className={`text-white text-3xl md:text-4xl lg:text-[44px] font-medium text-center mb-5 md:mb-7 lg:mb-[34px] max-w-[425px] transition-all duration-1000 ease-out ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-[50px] opacity-0"
              }`}
            >
              {title}
            </h2>
            {dsc && (
              <p
                className={`text-white text-lg md:text-xl mb-4 max-w-2xl transition-all duration-1000 ease-out delay-200 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-[50px] opacity-0"
                }`}
              >
                {dsc}
              </p>
            )}

            {/* Button */}
            <div
              className={`transition-all duration-1000 ease-out delay-400 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-[50px] opacity-0"
              }`}
            >
              <Button
                variant="solid"
                href={`/${
                  buttonText === "Get started" ? "investor" : "farmer"
                }/signup`}
                className="xl:!py-4 xl:!px-5 bg-white !text-black hover:!bg-[#e1e1e1]"
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
