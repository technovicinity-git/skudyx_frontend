"use client";
import React from "react";
import Subtitle from "../Subtitle";
import { Leaf2Icon } from "@/public/assets/icons/icons";
import { useIntersectionObserver } from "../language-context";

const stats = [
  {
    value: "98%",
    title: "On-time delivery rate",
    description:
      "Efficient distribution across regions, supporting supply chains with reliability and precision.",
  },
  {
    value: "15",
    title: "Countries reached",
    description:
      "Our agricultural solutions are trusted by partners and farmers in more than 15 countries worldwide.",
  },
  {
    value: "500k+",
    title: "Acres cultivated sustainably",
    description:
      "We promote responsible land use with eco-friendly practices across half a million acres of farmland.",
  },
];

const Mission = () => {
  const { isVisible, elementRef } = useIntersectionObserver();
  return (
    <section ref={elementRef} className="bg-[#FAFAFA] py-16 md:py-20 lg:py-24">
      <div className="container">
        <div className={`flex items-start justify-between flex-col md:flex-row md:gap-10 lg:gap-16 mb-10 md:mb-12 lg:mb-[60px] transition-all duration-1000 ease-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[-100px] opacity-0'}`}>
          <div className="w-max lg:w-[300px]">
            <Subtitle text="Our mission" />
          </div>
          <h2 className="flex-1 text-black text-3xl md:text-4xl lg:text-[40px] font-medium leading-tight text-left">
            Our numbers reflect more than just growth — they represent our
            commitment to excellence, sustainability, and global collaboration.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`bg-white rounded-[10px] p-5 lg:p-7 xl:p-10 flex flex-col items-start gap-2.5 transition-all duration-1000 ease-out delay-${i * 200} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <span>{Leaf2Icon}</span>
              <h2 className="text-black text-[40px] md:text-5xl lg:text-6xl xl:text-[70px] font-medium max-w-3xl leading-tight">
                {stat.value}
              </h2>
              <h4 className="text-lg md:text-xl font-normal text-black">
                {stat.title}
              </h4>
              <p className="text-base text-[#585858] mt-2.5">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mission;
