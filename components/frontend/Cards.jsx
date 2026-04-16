"use client";

import { useGetInvestmentPlans } from "@/hook/investmentPlan";
import { formatDate } from "@/utils/formatDate";
import Button from "../common/Button";
import Card from "./Card";
import { useIntersectionObserver } from "./language-context";

const Cards = () => {
  const { isVisible, elementRef } = useIntersectionObserver();

  const { investmentPlans, isLoading } = useGetInvestmentPlans(1, 3);

  return (
    <section ref={elementRef} className="relative py-16 md:py-20 lg:py-24">
      <div className="container">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row gap-3 items-start md:justify-between mb-8 md:mb-10 lg:mb-12">
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-[-100px] opacity-0"
            }`}
          >
            <h2 className="text-black text-3xl md:text-4xl lg:text-[40px] font-medium leading-tight text-left mb-3 md:mb-4 lg:mb-5">
              Investments
            </h2>
            <p className="text-base text-[#585858] max-w-[440px]">
              Diversify with an asset class that has the potential to create
              wealth opportunities over time.
            </p>
          </div>

          {/* Button */}
          <div
            className={`transition-all duration-1000 ease-out delay-200 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-[-100px] opacity-0"
            }`}
          >
            <Button
              variant="solid"
              href={`/available-investment`}
              className="xl:!py-3.5 xl:!px-5"
            >
              View Investments
            </Button>
          </div>
        </div>
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
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
                  maturity={formatDate(plan?.matureDate)}
                  status={plan?.status}
                  location={plan?.location}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cards;
