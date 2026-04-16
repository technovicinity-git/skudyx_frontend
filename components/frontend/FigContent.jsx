"use client";
import React from "react";
import Subtitle from "./Subtitle";
import Link from "next/link";
import Image from "next/image";
import { useIntersectionObserver } from "./language-context";

const FigContent = ({
  subtitle,
  title,
  description,
  imageUrl,
  alt,
  buttonText,
  buttonLink,
}) => {
  const { isVisible, elementRef } = useIntersectionObserver();
  // Support multi-line titles by splitting on '\n'
  const titleLines = title.split("\n");
  return (
    <section ref={elementRef} className="overflow-hidden relative">
      <div className="container flex flex-col md:flex-row gap-10">
        {/* Left: Text Content */}
        <div className="flex-1 pt-40 lg:pt-[200px] 2xl:pt-[233px] pb-28 lg:pb-[210px] 2xl:pb-[250px]  lg:pl-9">
          {subtitle && (
            <div className={`transition-all duration-1000 ease-out delay-0 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[-100px] opacity-0'}`}>
              <Subtitle text={subtitle} />
            </div>
          )}
          <h2 className={`text-[40px] md:text-5xl lg:text-6xl xl:text-[70px] font-medium mb-6 leading-tight text-black transition-all duration-1000 ease-out delay-200 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[-100px] opacity-0'}`}>
            {titleLines.map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                {idx !== titleLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <p className={`text-lg md:text-xl text-gray-500 max-w-xl transition-all duration-1000 ease-out delay-400 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[-100px] opacity-0'}`}>
            {description}
          </p>
          {buttonText && (
            <div className={`transition-all duration-1000 ease-out delay-600 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[-100px] opacity-0'}`}>
              <Link
                href={buttonLink}
                className="mt-6 inline-block bg-primary-1 text-white px-7 py-3 rounded-lg text-base font-medium shadow-none hover:bg-primary-0 transition-colors"
              >
                {buttonText}
              </Link>
            </div>
          )}
        </div>
        {/* Right: Image */}
        <div className={`absolute h-full md:h-auto top-0 left-0 flex-auto md:flex-1 w-full md:max-w-[562px] md:relative -z-10 md:z-10 transition-all duration-1000 ease-out delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[-100px] opacity-0'}`}>
          <figure className="absolute left-0 top-0 h-full w-[50vw]">
            <Image
              src={imageUrl}
              alt={alt}
              fill
              className="!relative object-cover w-full h-full"
            />
          </figure>
        </div>
      </div>
    </section>
  );
};

export default FigContent;
