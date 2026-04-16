"use client";

import { formatDate } from "@/utils/formatDate";
import { formatMoney } from "@/utils/formatMoney";
import { isValidUrl } from "@/utils/isValidUrl";
import Image from "next/image";
import Link from "next/link";

const MyInvestmentCard = ({ investment }) => {
  return (
    <div className="bg-white border border-[#EAECF0] rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative aspect-[2.41/1] overflow-hidden group block">
        <Image
          src={
            isValidUrl(investment?.planId?.propertyImages?.[0])
              ? investment.planId.propertyImages[0]
              : "/assets/images/default_image.jpg"
          }
          alt={investment?.name || "Property image"}
          fill
          className="object-cover h-full w-full group-hover:scale-105 transition-all duration-300"
        />
      </div>
      <Link
        href={`/investor/portfolio/my-investments/${investment?.planId?._id}`}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {investment?.planId?.name}
          </h3>

          <div className="flex items-center justify-between gap-2 mb-3">
            <p>Returns</p>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
              {investment?.planId?.roi}%
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <p>Maturity Date:</p>
            <p>
              {investment?.planId?.matureDate
                ? formatDate(investment.planId.matureDate)
                : "N/A"}
            </p>
          </div>
          {/* Financial Details */}
          <div className="space-y-3 mb-4 bg-[#F6F7F9] rounded-lg py-2 px-3">
            <div className="flex items-center justify-between gap-4 text-xs text-[#002447]">
              <span className="">Total amount invested</span>
              <span className="font-semibold">
                {formatMoney(investment?.planId?.total_invest_amount)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 text-xs text-[#002447]">
              <span className="">My Asset Value</span>
              <span className="font-semibold">
                {formatMoney(investment?.invested_amount)}
              </span>
            </div>
          </div>
          {/*
        <Link
          href={`/investor/investment/${investment._id}`}
          className="block w-full bg-[#121C30] text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-[#121c30ec] transition-colors"
        >
          View Investment
        </Link> */}
        </div>
      </Link>
    </div>
  );
};

export default MyInvestmentCard;
