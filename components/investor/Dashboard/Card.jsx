"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { isValidUrl } from "@/utils/isValidUrl";

const Card = ({ investment }) => {
  return (
    <div className="bg-white border border-[#EAECF0] rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative aspect-[2.41/1] overflow-hidden group block">
        <Image
          src={
            isValidUrl(investment?.propertyImages?.[0])
              ? investment.propertyImages[0]
              : "/assets/images/default_image.jpg"
          }
          alt={investment?.name || "Property image"}
          fill
          className="object-cover h-full w-full group-hover:scale-105 transition-all duration-300"
        />
      </div>
      <Link href={`/investor/investment/${investment._id}`}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {investment?.name}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
              {investment?.returns} per annum
            </span>
          </div>
          {/* 
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <p>
            Maturity Date:{" "}
            {investment?.planId?.matureDate
              ? new Date(investment.planId.matureDate).toLocaleString()
              : "N/A"}
          </p>
          <p>
            Total amount invested:{" "}
            <span className="font-semibold text-gray-900">
              {investment?.amount}
            </span>
          </p>
          <p>
            My Asset Value:{" "}
            <span className="font-semibold text-gray-900">
              {investment?.assetValue}
            </span>
          </p> */}
          {/* Financial Details */}
          <div className="space-y-3 mb-4 bg-[#F6F7F9] rounded-lg py-2 px-3">
            <div className="flex items-center justify-between gap-4 text-xs text-[#002447]">
              <span className="">Total amount invested</span>
              <span className="font-semibold">{investment.totalInvested}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-xs text-[#002447]">
              <span className="">My Asset Value</span>
              <span className="font-semibold">{investment.assetValue}</span>
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

export default Card;
