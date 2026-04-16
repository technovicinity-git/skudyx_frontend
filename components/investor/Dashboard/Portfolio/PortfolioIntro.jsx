"use client";

import React from "react";
// import { Eye, EyeOff } from "lucide-react";
// import { ArrowUpIcon } from "@/public/assets/icons/icons";
import Button from "@/components/common/Button";
import { useGetMyProfile } from "@/hook/user";
import Link from "next/link";
import { formatMoney } from "@/utils/formatMoney";

const PortfolioIntro = () => {
  // const [isValueHidden, setIsValueHidden] = React.useState(true);
  const { profile } = useGetMyProfile();

  return (
    <>
      {/* Onboarding Banner */}
      {profile?.kyc_verified === false && (
        <div className="bg-green-50 py-[18px] px-8 lg:px-10 -mx-8 -mt-6 md:-mt-10 mb-10">
          <div className="flex items-center justify-between gap-3 sm:flex-nowrap flex-wrap">
            <p className="text-[#222222] text-sm md:text-base lg:text-lg ">
              Local regulations require all investors to complete onboarding
              before they can invest.
            </p>
            <Button
              href="/investor/identity-verification"
              variant="solid"
              className="!bg-[#121C30] hover:!bg-[#121c30ea]"
            >
              Complete Onboarding
            </Button>
          </div>
        </div>
      )}

      {/* My Portfolio Section */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#222222] mb-4 sm:mb-6 md:mb-10">
          My Portfolio
        </h1>

        {/* Portfolio Value Card */}
        <div className="bg-[#121C30] rounded-md p-6 text-white text-center">
          {/* Portfolio Value Label - Centered */}
          <p className="mb-2 text-sm">Portfolio Value</p>

          {/* Main Value and Eye Icon */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="text-3xl md:text-[40px] font-semibold">
              {formatMoney(profile?.portfolio_balance)}
            </div>
            {/* <button
              onClick={() => setIsValueHidden(!isValueHidden)}
              className="text-white hover:text-primary-1 transition-colors p-1 cursor-pointer"
            >
              {isValueHidden ? <EyeOff size={20} /> : <Eye size={20} />}
            </button> */}
          </div>

          {/* Daily Change - Centered */}
          {/* <p className="flex text-xs items-center justify-center gap-2 mb-5">
            <span className="">{ArrowUpIcon} </span>
            <span className=""></span>
          </p> */}

          {/* Invest Button - Centered */}
          <div className="mx-auto flex justify-center items-center gap-4">
            <div className="text-center">
              <Link href="/investor/investment">
                <Button variant="solid" className="min-w-[130px] ">
                  Invest
                </Button>
              </Link>
            </div>
            <div className="text-center">
              <Link href="/investor/portfolio/my-investments">
                <Button
                  variant="outlined"
                  className="min-w-[130px] border-2 border-white"
                >
                  My Investment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PortfolioIntro;
