"use client";

import Image from "next/image";
import Link from "next/link";
import { useIntersectionObserver } from "../language-context";

const Hero = () => {
  const { isVisible, elementRef } = useIntersectionObserver();

  return (
    <section
      ref={elementRef}
      className="relative w-full pt-40 md:pt-44 lg:pt-[265px] pb-28 md:pb-40 lg:pb-[205px] flex items-center justify-start overflow-hidden"
    >
      {/* Background image placeholder */}
      <figure className="absolute inset-0 w-full h-full object-cover -z-10">
        <Image
          src="/assets/images/home_hero-bg.webp"
          fill
          alt="Hero background"
          className="!relative h-full w-full object-cover"
        />
      </figure>
      <div className="container">
        <div className="ml-0 md:ml-6 lg:ml-[45px] space-y-4 md:space-y-[22px] max-w-lg">
          <h1
            className={`text-white text-[40px] md:text-5xl lg:text-6xl xl:text-[70px] font-medium mb-6 max-w-3xl leading-tight text-left transition-all duration-1000 ease-out ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-[-100px] opacity-0"
            }`}
          >
            Redefining {/* <br className="hidden md:block" /> */}
            agriculture at
            <br />a global scale
          </h1>
          <p
            className={`text-white text-lg md:text-xl text-left transition-all duration-1000 ease-out delay-300 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-[-100px] opacity-0"
            }`}
          >
            Through sustainable farming and smart collaboration, we grow more
            than crops — we grow impact.
          </p>
          <div
            className={`flex gap-4 transition-all duration-1000 ease-out delay-500 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-[-100px] opacity-0"
            }`}
          >
            {/* App Store and Google Play badges as images */}
            <Link href="" className="w-[135px]">
              <Image
                src="/assets/images/app-store.webp"
                fill
                alt="App Store"
                className="!relative h-12 w-auto bg-white/20 rounded shadow"
              />
            </Link>
            <Link href="" className="w-[135px]">
              <Image
                src="/assets/images/play-store.webp"
                fill
                alt="Google Play"
                className="!relative h-12 w-auto bg-white/20 rounded shadow"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
