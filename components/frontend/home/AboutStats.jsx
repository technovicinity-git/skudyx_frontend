"use client";

import Image from "next/image";
import React from "react";
import { useIntersectionObserver, useCounter } from "../language-context";

const AboutStats = () => {
  const { isVisible, elementRef } = useIntersectionObserver();

  const stats = [
    {
      value: "400+",
      title: "Projects completed",
      description: "We've helped build over 400 amazing projects.",
    },
    {
      value: "600%",
      title: "Return on investment",
      description: "Our customers have reported an average of ~600% ROI.",
    },
    {
      value: "10k",
      title: "Global downloads",
      description: "Our free UI kit has been downloaded over 10k times.",
    },
    {
      value: "200+",
      title: "5-star reviews",
      description: "We're proud of our 5-star rating with over 200 reviews.",
    },
  ];

  return (
    <section ref={elementRef} className="mt-8 md:mt-12 lg:mt-16">
      <div className="flex items-center flex-col-reverse md:flex-row gap-10 lg:gap-24">
        {/* Stats Grid */}
        <div
          className="grid grid-cols-2 gap-y-8 md:gap-y-10 lg:gap-y-16 
      gap-x-4 lg:gap-x-8"
        >
          {stats.map((stat, index) => {
            const animatedValue = useCounter(stat.value, 2000, isVisible);

            return (
              <div
                key={stat.title}
                className={`text-center transition-all duration-1000 ease-out delay-${
                  index * 200
                } ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-[-100px] opacity-0"
                }`}
              >
                <h2 className="text-4xl lg:text-5xl xl:text-6xl font-semibold text-primary-1 mb-3 text-center">
                  {animatedValue}
                </h2>
                <p className="text-base lg:text-lg font-semibold text-[#101828] mb-2">
                  {stat.title}
                </p>
                <p className="text-[#475467] text-sm lg:text-base font-normal">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
        {/* Image */}
        <figure
          className={`rounded-[10px] overflow-hidden transition-all duration-1000 ease-out delay-800 ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "translate-x-[-100px] opacity-0"
          }`}
        >
          <Image
            src="/assets/images/vegetables.webp"
            alt="Greenhouse with crops"
            fill
            className="!relative object-cover w-full "
            style={{ boxShadow: "0 4px 24px 0 rgba(44, 62, 80, 0.08)" }}
          />
        </figure>
      </div>
    </section>
  );
};

export default AboutStats;
