"use client";
import Table from "@/components/admin/dashboard/Table";
import Button from "@/components/common/Button";
import Loader from "@/components/loader/Loader";
import SearchInput from "@/components/search/SearchInput";
import { useDebounce } from "@/hook/debounce";
import { useGetUserInvestments } from "@/hook/investment";
import { formatMoney } from "@/utils/formatMoney";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ReportsBody = () => {
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();

  const debouncedSearch = useDebounce(search, 500);

  // const { investmentPlans, meta, isLoading } = useGetInvestmentPlans(page);
  const { myInvestments, meta, isLoading } = useGetUserInvestments(
    page,
    "",
    debouncedSearch
  );

  const handleViewDetails = (plan) => {
    // Encode the investment name for URL safety
    router.push(`/investor/reports/${plan?.planId?._id}`);
  };

  const columns = [
    {
      label: "Investment Name",
      accessor: "name",
      render: (plan) => (
        <span className="text-[#0F172B] font-medium">{plan?.planId?.name}</span>
      ),
    },
    {
      label: "Type",
      accessor: "type",
      render: (plan) => (
        <span className="text-[#0F172B] font-medium">{plan?.planId?.type}</span>
      ),
    },
    {
      label: "Amount paid",
      accessor: "total_invest_amount",
      render: (plan) => (
        <span className="text-[#0F172B] font-medium">
          {formatMoney(plan?.planId?.total_invest_amount)}
        </span>
      ),
    },
    {
      label: "Action",
      accessor: "action",
      render: (plan) => (
        <Button
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
          onClick={() => handleViewDetails(plan)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by name..."
        wrapperClassName="max-w-lg my-4"
      />
      {isLoading ? (
        <Loader fullScreen />
      ) : (
        <Table
          columns={columns}
          data={myInvestments}
          showFilter={false}
          filterValue={filter}
          onFilterChange={(val) => {
            setFilter(val);
            setPage(1);
          }}
          showPagination={true}
          pagination={{
            page,
            totalPages: meta?.totalPages,
            onPageChange: (p) => setPage(p),
          }}
        />
      )}
    </div>
  );
};

export default ReportsBody;
