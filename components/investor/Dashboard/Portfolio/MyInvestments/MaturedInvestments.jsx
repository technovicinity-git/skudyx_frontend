"use client";

import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/loader/Loader";
import CustomPagination from "@/components/pagination/CustomPagination";
import { useGetUserInvestments } from "@/hook/investment";
import { useGetMyProfile } from "@/hook/user";
import { useState } from "react";
import MyInvestmentCard from "./MyInvestmentCard";

const MaturedInvestments = () => {
  const [page, setPage] = useState(1);
  const { profile } = useGetMyProfile();
  const { myInvestments, meta, isLoading } = useGetUserInvestments(
    profile?._id,
    page,
    "matured"
  );

  if (isLoading) {
    return (
      <div>
        <Loader fullScreen />
      </div>
    );
  }

  return (
    <>
      {myInvestments && myInvestments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {myInvestments.map((investment) => (
            <MyInvestmentCard key={investment._id} investment={investment} />
          ))}
          <CustomPagination
            currentPage={page}
            totalPages={meta?.totalPages}
            onPageChange={setPage}
          />
        </div>
      ) : (
        <EmptyState
          title="No matured investments found"
          description="You don't have any matured investments in your portfolio at the moment."
        />
      )}
    </>
  );
};

export default MaturedInvestments;
