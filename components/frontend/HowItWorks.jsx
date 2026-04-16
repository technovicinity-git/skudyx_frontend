"use client";

import Image from "next/image";
import React from "react";
import { useIntersectionObserver } from "./language-context";

const HowItWorks = ({ title, description, items, imageSrc, imageAlt }) => {
  const { isVisible, elementRef } = useIntersectionObserver();

  return (
    <section
      ref={elementRef}
      className="w-full bg-[#fafafa] py-16 md:py-20 lg:py-24"
    >
      <div className="container  flex items-center justify-center gap-8 md:gap-10 lg:gap-14 xl:gap-24 flex-col-reverse md:flex-row">
        {/* Left: Text Content */}
        <div className="flex-1 md:max-w-1/2 ">
          <h2
            className={`text-black text-3xl md:text-4xl lg:text-[40px] font-medium leading-tight text-left mb-3 md:mb-4 lg:mb-5 transition-all duration-1000 ease-out ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-[-100px] opacity-0"
            }`}
          >
            {title}
          </h2>
          <p
            className={`text-base text-[#585858] transition-all duration-1000 ease-out delay-200 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-[-100px] opacity-0"
            }`}
          >
            {description}
          </p>
          <ul className="space-y-5 md:space-y-6 lg:space-y-8 mt-6 md:mt-8 lg:mt-10">
            {items.map((item, idx) => (
              <li
                key={idx}
                className={`transition-all duration-1000 ease-out delay-${
                  400 + idx * 100
                } ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-[-100px] opacity-0"
                }`}
              >
                <h3
                  className={`text-lg lg:text-xl font-medium mb-2 lg:mb-4 ${
                    idx < 2 ? " flex items-center" : ""
                  }`}
                >
                  {items.length > 1 && (
                    <span className="mr-1 md:mr-2">{idx + 1}.</span>
                  )}
                  {item.title}
                </h3>
                <p
                  className={`text-[#585858] text-sm lg:text-base font-medium ${
                    idx < items.length - 1 ? "mb-2 md:mb-3 lg:mb-4 " : ""
                  }`}
                >
                  {item.description}
                </p>
                {idx < items.length - 1 && <hr className="border-black/20" />}
              </li>
            ))}
          </ul>
        </div>
        {/* Right: Image */}
        <div
          className={`flex-1 md:max-w-1/2 rounded-[10px] overflow-hidden transition-all duration-1000 ease-out delay-600 ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "translate-x-[-100px] opacity-0"
          }`}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="!relative object-cover w-full "
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
