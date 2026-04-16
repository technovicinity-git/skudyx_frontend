"use client";

import React from "react";
import { Info, TrendingUp } from "lucide-react";
import { BalanceIcon } from "@/public/assets/icons/icons";
import { useGetMyProfile } from "@/hook/user";
import { useGetInvestmentStats } from "@/hook/investment";
import { formatMoney } from "@/utils/formatMoney";

const FinancialSummary = () => {
  const { profile } = useGetMyProfile();
  const { investmentStats } = useGetInvestmentStats();

  const cards = [
    {
      id: 1,
      title: "Total Balance",
      value: formatMoney(profile?.wallet_balance),
      icon: BalanceIcon,
      showInfo: true,
    },
    {
      id: 2,
      title: "Total Amount Invested",
      value: formatMoney(investmentStats?.totalInvestmentAmount),
      icon: BalanceIcon,
      showInfo: true,
      // subtitle: "3 Investment",
      // growth: 40,
    },
  ];
  return (
    <section className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="">{card.icon}</div>
            <h3 className="text-[#222222] font-medium flex items-center gap-2 mt-4 md:mt-6 lg:mt-8">
              {card.title}
              {card.showInfo && (
                <span>
                  <Info
                    size={24}
                    className="text-[#4f4f4f] h-5 w-5 md:h-6 md:w-6"
                  />
                </span>
              )}
            </h3>
            <div className="flex items-end gap-3 mt-4">
              <h3 className="text-xl md:text-2xl font-bold text-[#222222]">
                {card.value}
              </h3>
              {card.subtitle && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#067647]">
                    {card.subtitle}
                  </span>
                  {card.growth && (
                    <div className="flex items-center p-1 gap-1 text-[#067647] bg-[#34C759]/10 rounded-full">
                      <TrendingUp size={16} />
                      <span className="text-sm font-medium">
                        {card.growth}%
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FinancialSummary;
