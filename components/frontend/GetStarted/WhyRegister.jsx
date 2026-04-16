"use client";
import React from "react";
import FeatureCard from "../FeatureCard";
import { useIntersectionObserver } from "../language-context";

const features = [
  {
    title: "Access Capital",
    description:
      "Tap into a pool of investors eager to support farms like yours.",
  },
  {
    title: "Transparent Payments",
    description: "Receive funds directly to your bank account—no hidden fees.",
  },
  {
    title: "Professional Support",
    description:
      "Get land-preparation guidance, insurance options, and market insights.",
  },
  {
    title: "Scale Your Operations",
    description:
      "Use investor funds to expand, upgrade equipment, or increase herd size.",
  },
];

const WhyRegister = () => {
  const { isVisible, elementRef } = useIntersectionObserver();
  return (
    <section ref={elementRef} className="relative py-16 md:py-20 lg:py-24 w-full">
      <div className="container">
        <h2
          className="text-black text-3xl md:text-4xl lg:text-[40px] font-medium leading-tight text-center mb-10 md:mb-12 lg:mb-16"
          style={{ color: "#19202C" }}
        >
          Why Register?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {features.map((feature, idx) => (
            <FeatureCard
              bg="bg-[#FAFAFA]"
              key={feature.title}
              title={feature.title}
              description={feature.description}
              circleBg="#A0D6B4"
              circleSize="w-14 h-14 md:w-18 md:h-18 lg:w-[90px] lg:h-[90px]"
              isVisible={isVisible}
              delay={`${idx * 200}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyRegister;
