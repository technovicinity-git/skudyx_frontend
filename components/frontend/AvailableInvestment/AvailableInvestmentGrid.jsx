"use client";
import { useIntersectionObserver } from "@/components/frontend/language-context";
import { useGetInvestmentPlans } from "@/hook/investmentPlan";
import { TopRightArrowIcon } from "@/public/assets/icons/icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Card from "../Card";

const AvailableInvestmentGrid = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [activeCategory, setActiveCategory] = useState(type || "Crops");
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const { isVisible, elementRef } = useIntersectionObserver();

  const { investmentPlans, isLoading } = useGetInvestmentPlans(
    1,
    12,
    activeCategory === "Crops" ? "crop" : "livestock"
  );

  const cropsRef = useRef(null);
  const livestocksRef = useRef(null);

  useEffect(() => {
    if (type === "Crops" || type === "Livestocks") {
      setActiveCategory(type);
    }
  }, [type]);

  useEffect(() => {
    const updateIndicatorPosition = () => {
      if (cropsRef.current && livestocksRef.current) {
        const container = cropsRef.current.parentElement;
        const containerRect = container.getBoundingClientRect();

        if (activeCategory === "Crops") {
          const cropsRect = cropsRef.current.getBoundingClientRect();
          const left = cropsRect.left - containerRect.left;
          const width = cropsRect.width;

          setIndicatorStyle({
            left: `${left - 1}px`,
            width: `${width}px`,
          });
        } else {
          const livestocksRect = livestocksRef.current.getBoundingClientRect();
          const left = livestocksRect.left - containerRect.left;
          const width = livestocksRect.width;

          setIndicatorStyle({
            left: `${left}px`,
            width: `${width}px`,
          });
        }
      }
    };

    updateIndicatorPosition();
    window.addEventListener("resize", updateIndicatorPosition);

    return () => window.removeEventListener("resize", updateIndicatorPosition);
  }, [activeCategory]);

  return (
    <section ref={elementRef} className="py-16 md:py-20 lg:py-24">
      <div className="container">
        <h2 className="text-lg font-semibold mb-4">
          Available Investment Plans
        </h2>
        <div className="flex items-center justify-between mb-8">
          {/* Category Tabs */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex bg-white border border-[#EAECF0] rounded-lg relative overflow-hidden">
              {/* Animated Sliding Indicator */}
              <div
                className="absolute top-0 bottom-0 bg-primary-1/10 transition-all duration-300 ease-in-out"
                style={indicatorStyle}
              />

              <button
                ref={cropsRef}
                onClick={() => setActiveCategory("Crops")}
                className={`relative px-4 py-2 rounded-md text-sm transition-all duration-200 z-10 cursor-pointer ${
                  activeCategory === "Crops"
                    ? "text-primary-1 text-shadow-sm"
                    : "text-gray-700"
                }`}
              >
                Crops
              </button>
              <button
                ref={livestocksRef}
                onClick={() => setActiveCategory("Livestocks")}
                className={`relative px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 z-10 cursor-pointer ${
                  activeCategory === "Livestocks"
                    ? "text-primary-1 text-shadow-sm"
                    : "text-gray-700"
                }`}
              >
                Livestocks
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {investmentPlans?.map((plan, idx) => (
            <div
              key={idx}
              className={`transition-all duration-1000 ease-out`}
              style={{
                transitionDelay: `${400 + idx * 200}ms`,
                transform: isVisible ? "translateY(0)" : "translateY(50px)",
                opacity: isVisible ? 1 : 0,
              }}
            >
              {isLoading ? (
                <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
              ) : (
                <Card
                  title={plan?.name}
                  images={plan?.propertyImages}
                  minInvestment={plan?.slotsAvailable}
                  riskLevel={plan?.riskLevel}
                  returns={plan?.roi}
                  maturity={new Date(plan?.matureDate).toLocaleDateString()}
                  status={plan?.status}
                  location={plan?.location}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link
            href="/investor/signup"
            className="flex items-center gap-2 px-5 py-[14px] border border-[#006045] bg-[#ECFDF3] rounded-xl text-primary-1 font-medium text-base transition hover:bg-[#d1fae5]"
          >
            Register to view more
            <span>{TopRightArrowIcon}</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AvailableInvestmentGrid;
