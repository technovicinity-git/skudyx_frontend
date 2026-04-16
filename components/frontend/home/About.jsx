"use client";

import Button from "../../common/Button";
import { useIntersectionObserver } from "../language-context";
import Subtitle from "../Subtitle";
import AboutStats from "./AboutStats";

const About = () => {
  const { isVisible, elementRef } = useIntersectionObserver();

  return (
    <section ref={elementRef} className="w-full py-16 md:py-20 lg:py-24">
      <div className="container">
        <header className="relative max-w-3xl">
          {/* Badge */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-[-100px] opacity-0"
            }`}
          >
            <Subtitle text="About Us" />
          </div>
          {/* Heading */}
          <h2
            className={`text-black text-3xl md:text-4xl lg:text-[40px] font-medium leading-tight text-left mb-3 md:mb-4 lg:mb-5 transition-all duration-1000 ease-out delay-200 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-[-100px] opacity-0"
            }`}
          >
            We are committed to
            <br className="hidden md:block" />
            advancing agriculture.
          </h2>
          {/* Description */}
          <p
            className={`text-[#475467] text-base md:text-lg lg:text-xl font-normal mb-5 md:mb-6 lg:mb-8 leading-relaxed transition-all duration-1000 ease-out delay-400 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-[-100px] opacity-0"
            }`}
          >
            We&apos;re a fast-growing agri-tech company empowering smallholder
            farmers with technology to access finance, boost productivity, and
            drive food security.
          </p>

          {/* Button */}
          <div
            className={`transition-all duration-1000 ease-out delay-600 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-[-100px] opacity-0"
            }`}
          >
            <Button
              variant="solid"
              href={`/about`}
              className="
            xl:!py-3.5 xl:!px-5"
            >
              Learn More
            </Button>
          </div>
        </header>

        <AboutStats />
      </div>
    </section>
  );
};

export default About;
