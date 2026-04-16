"use client";
import React from "react";
import Subtitle from "../Subtitle";
import { useIntersectionObserver, useCounter } from "../language-context";

const stats = [
  {
    value: "5,000+",
    description: "Farmers Engaged across maize, soy, and rice value chains",
  },
  {
    value: "1,200",
    description:
      "Tons Delivered to FMCG and agro-processing companies in 12 months",
  },
  {
    value: "100%",
    description: "Traceability from farm to warehouse",
  },
];

const Impact = () => {
  const { isVisible, elementRef } = useIntersectionObserver();
  const animatedValues = stats.map((stat) => useCounter(stat.value, 2000, isVisible));
  return (
    <section ref={elementRef} className="w-full py-16 ">
      <div className="container">
        <div className="flex flex-col items-center">
          {/* <Subtitle text="Proven Impact" /> */}
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-4 mt-2 transition-all duration-1000 ease-out delay-0 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[-100px] opacity-0'}`}>Proven Impact</h2>
          <p className={`text-[#475467] text-lg md:text-xl text-center mb-12 max-w-2xl transition-all duration-1000 ease-out delay-200 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[-100px] opacity-0'}`}>Everything you need to build modern UI and great products.</p>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10">
            {stats.map((stat, idx) => (
              <div key={idx} className={`flex flex-col items-center text-center transition-all duration-1000 ease-out delay-${400 + idx * 200} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <span className="text-5xl md:text-6xl font-bold text-[#236647] mb-2">
                  {animatedValues[idx]}
                </span>
                <span className="text-base md:text-lg text-[#475467] max-w-xs">
                  {stat.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;
