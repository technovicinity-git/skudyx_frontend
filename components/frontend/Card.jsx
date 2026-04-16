"use client";

import { LocationIcon } from "@/public/assets/icons/icons";
import { isValidUrl } from "@/utils/isValidUrl";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const Card = ({
  image,
  tags = [],
  title,
  location,
  status = "Open",
  minInvestment,
  maturity,
  returns,
  riskLevel,
  images = [], // Array of images for slider
  url = "",
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  // Use provided images array or fallback to single image
  const cardImages = images.length > 0 ? images : [image];

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden flex flex-col border border-[#EAECF0] relative transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-2 group">
      <div className="relative h-full w-full aspect-[2.11/1] overflow-hidden">
        <Slider
          {...sliderSettings}
          className="h-full card-thumb-slider"
          // ref={sliderRef}
        >
          {cardImages.map((img, index) => (
            <figure key={index} className="relative h-full w-full">
              <Image
                src={isValidUrl(img) ? img : "/assets/images/default_image.jpg"}
                fill
                alt={`${title} - Image ${index + 1}`}
                className="!relative object-cover w-full aspect-[2.11/1] transition-transform duration-300 ease-out cursor-grab"
              />
            </figure>
          ))}
        </Slider>
        {/* Status Badge */}
        <span className="absolute top-[15px] right-[17px] bg-[#DCFCE7] text-[#00A63E] text-xs px-2 py-1 rounded-full font-normal z-10">
          {status}
        </span>
        {/* Thumbnail Indicators */}
        {cardImages.length > 0 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
            {cardImages.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  sliderRef.current?.slickGoTo(index);
                }}
                className={`h-1 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                  index === currentSlide
                    ? "w-9 bg-white opacity-100"
                    : "w-6 bg-[#B2B0B0]/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <Link
        href={url}
        className={`p-3 md:p-4 flex flex-col flex-1 cursor-pointer ${
          url ? "" : "pointer-events-none"
        }`}
      >
        {!url && (
          <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            Login to see details
          </span>
        )}
        <div className="flex gap-2 mb-3 md:mb-4">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-[#F0FDF4] text-primary-1 text-[10px] px-2 py-1 leading-tight rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium text-base text-black mb-1">{title}</h3>
            <div className="flex items-center text-[#45556C] text-xs gap-1">
              <span>{LocationIcon}</span>
              {location}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#45556C] mb-1">Min. Investment:</div>
            <div className="text-primary-1 font-semibold text-base">
              {minInvestment}
            </div>
          </div>
        </div>
        <div className="bg-[#F6F7F9] rounded-lg py-4 px-3 space-y-5 text-sm text-[#4A5565] font-normal border border-transparent">
          <div className="flex items-center justify-between gap-3">
            <p className="">Maturity</p>
            <p className="font-medium">{maturity}</p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="">Returns</p>
            <p className="font-medium">{returns}</p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="">Risk Level</p>
            <p className="font-medium">{riskLevel}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
