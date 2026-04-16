"use client";
import React from "react";
import Subtitle from "../Subtitle";
import FeatureCard from "../FeatureCard";
import Image from "next/image";
import { useIntersectionObserver } from "../language-context";

const cards = [
  {
    title: "Effective Innovation",
    description:
      "Technology with eco-conscious farming methods to drive growth while protecting natural resources for future generations.",
    customBg: "#FAFAFA",
    textColor: "text-black",
    circleBg: "#9BCDA9",
  },
  {
    title: "Sustainable Practices",
    description:
      "From pesticide-free farming to smart water use, we're committed to methods that respect the planet and future generations.",
    bg: "bg-black",
    textColor: "text-white",
    circleBg: "#9BCDA9",
  },
  {
    title: "Trusted by Thousands",
    description:
      "Farmers, distributors, and partners worldwide rely on us for quality, reliability, and long-term success.",
    customBg: "#035925",
    textColor: "text-white",
    circleBg: "#9BCDA9",
  },
  {
    title: "Global Expertise",
    description:
      "Years of international experience delivering scalable agricultural solutions across diverse climates and regions.",
    customBg: "#FAFAFA",
    textColor: "text-black",
    circleBg: "#9BCDA9",
  },
];

const WhyChooseUs = () => {
  const { isVisible, elementRef } = useIntersectionObserver();
  return (
    <section ref={elementRef} className="py-16 md:py-20 lg:py-24">
      <div className="container">
        {/* Top Row: Subtitle, Heading, Description */}
        <div className={`w-full flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-14 lg:gap-[70px] mb-10 md:mb-14 lg:mb-[70px] transition-all duration-1000 ease-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[-100px] opacity-0'}`}>
          <div className="flex-1 md:max-w-1/2">
            <Subtitle text="Why choose us" />
            <h2 className="flex-1 text-black text-3xl font-medium md:mt-2 lg:mt-4 md:max-w-[480px]">
              We're more than just a farm — we're your trusted partner in
              sustainable agriculture.
            </h2>
          </div>
          <p className="flex-1 md:max-w-1/2 text-base text-[#585858]">
            From using organic methods and precision irrigation to minimizing
            chemical inputs and reducing waste through composting, every
            decision we make is guided by long-term environmental
            responsibility.
          </p>
        </div>
        {/* Bottom Row: Image and Cards */}
        <div className="w-full flex flex-col xl:flex-row gap-4 md:gap-5 items-center xl:items-stretch">
          {/* Image */}
          <figure className={`flex-1 max-w-[635px] xl:max-w-1/2 rounded-[10px] overflow-hidden transition-all duration-1000 ease-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[-100px] opacity-0'}`}>
            <Image
              src="/assets/images/visitor.webp"
              alt="Farmer in field"
              fill
              className="!relative object-cover w-full h-full"
            />
          </figure>
          {/* Cards Grid */}
          <div className="flex-1 xl:max-w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            {cards.map((card, i) => (
              <FeatureCard
                key={i}
                bg={card.bg}
                customBg={card.customBg}
                textColor={card.textColor}
                circleBg={card.circleBg}
                title={card.title}
                description={card.description}
                circleSize="w-14 h-14 md:w-18 md:h-18 lg:w-[90px] lg:h-[90px] "
                circleMarginBottom="mb-6 sm:mb-9 md:mb-12 lg:mb-[72px]"
                isVisible={isVisible}
                delay={`${i * 200}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
