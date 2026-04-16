"use client";
import React from "react";
import FeatureCard from "../FeatureCard";
import { useIntersectionObserver } from "../language-context";

const WhyPartnerWithUs = () => {
  const { isVisible, elementRef } = useIntersectionObserver();
  return (
    <section ref={elementRef} className="py-16 px-4 md:px-12 lg:px-24">
      <div className="container">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{
            fontFamily: "var(--font-roobert, sans-serif)",
            color: "#19202C",
          }}
        >
          Why Partner with Green Wealth?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "No Middlemen", description: "We contract directly with farmers, ensuring efficiency and trust." },
            { title: "Guaranteed Volumes", description: "Aggregated supply from multiple farms under our coordination." },
            { title: "Quality Assurance", description: "Field monitoring, standardization, and post-harvest handling." },
            { title: "Sustainable Sourcing", description: "Empower rural farmers while meeting your ESG goals." },
          ].map((card, idx) => (
            <FeatureCard
              key={idx}
              circleSize="w-[90px] h-[90px]"
              title={card.title}
              description={card.description}
              isVisible={isVisible}
              delay={`${idx * 200}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyPartnerWithUs;
