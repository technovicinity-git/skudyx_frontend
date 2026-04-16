"use client";

import React from "react";

const FeatureCard = ({
  bg = "bg-white",
  circleBg = "#B6D7B0",
  textColor = "text-black",
  title,
  description,
  customBg,
  circleSize = "w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12",
  circleMarginBottom = "mb-5 md:mb-8",
  isVisible = true,
  delay = "0",
}) => {
  return (
    <div
      className={`rounded-[10px] p-4 md:p-5 ${bg} ${textColor} transition-all duration-1000 ease-out delay-${delay} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      style={customBg ? { background: customBg } : {}}
    >
      <div
        className={`inline-block rounded-full ${circleSize} ${circleMarginBottom}`}
        style={{ background: circleBg }}
      ></div>
      <h4 className="text-lg sm:text-xl font-medium mb-2 sm:mb-2.5">{title}</h4>
      <p className="text-base font-normal opacity-80">{description}</p>
    </div>
  );
};

export default FeatureCard;
