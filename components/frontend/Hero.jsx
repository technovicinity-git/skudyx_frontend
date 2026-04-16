"use client";
import React from "react";
import Image from "next/image";
import Subtitle from "./Subtitle";
import { useIntersectionObserver } from "./language-context";
import Button from "../common/Button";

const Hero = ({
  subtitle,
  title,
  description,
  bgImage,
  className = "",
  overlay = "dark",
  buttonText,
  buttonLink,
}) => {
  const { isVisible, elementRef } = useIntersectionObserver();
  return (
    <div
      ref={elementRef}
      className={`relative w-full pt-[120px] md:pt-[180px] lg:pt-[233px] pb-[70px] md:pb-[100px] lg:pb-[150px] flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Background Image */}
      {bgImage && (
        <Image
          src={bgImage}
          fill
          alt="Hero background"
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
          className="absolute inset-0 z-0"
        />
      )}
      {/* Overlay */}
      <div
        className={`absolute inset-0 z-10 ${
          overlay === "dark"
            ? "bg-black/50"
            : overlay === "light"
            ? "bg-white/40"
            : ""
        }`}
      />
      {/* Content */}
      <div className="container flex items-center justify-center text-center">
        <div className="relative z-20 max-w-[710px]">
          {subtitle && (
            <div
              className={`transition-all duration-1000 ease-out delay-0 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <Subtitle text={subtitle} />
            </div>
          )}
          {title && (
            <h1
              className={`text-white text-[40px] md:text-5xl lg:text-6xl xl:text-[70px] font-medium leading-tight md:mt-2 transition-all duration-1000 ease-out delay-200 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              {title}
            </h1>
          )}
          {description && (
            <p
              className={`text-white text-lg md:text-xl font-normal mt-4 md:mt-6 transition-all duration-1000 ease-out delay-400 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              {description}
            </p>
          )}
          {buttonText && buttonLink && (
            <Button href={buttonLink} variant="solid" className="mt-8">
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
