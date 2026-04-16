"use client";

import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/loader/Loader";
import { useGetUserInvestments } from "@/hook/investment";
import { useGetMyProfile } from "@/hook/user";
import Link from "next/link";
import MyInvestmentCard from "./Portfolio/MyInvestments/MyInvestmentCard";

const OngoingInvestments = () => {
  const { profile } = useGetMyProfile();
  const { myInvestments, isLoading } = useGetUserInvestments(
    profile?._id,
    1,
    "open"
  );
  return (
    <section className="">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6 gap-3 flex-wrap">
        <h2 className="text-lg font-semibold text-[#222222]">
          Ongoing investments
        </h2>
        <Link href="/investor/portfolio/my-investments">
          <button className="px-3 py-1.5 md:px-4 md:py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors cursor-pointer">
            See All
          </button>
        </Link>
      </div>

      {isLoading ? (
        <Loader fullScreen />
      ) : (
        <>
          {myInvestments && myInvestments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myInvestments.map((investment) => (
                <MyInvestmentCard
                  key={investment._id}
                  investment={investment}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No ongoing investments found"
              description="You don't have any active investments at the moment."
            />
          )}
        </>
      )}
    </section>
  );
};

export default OngoingInvestments;
