"use client";

import Table from "@/components/admin/dashboard/Table";
import Button from "@/components/common/Button";
import FilterDropdown from "@/components/filter/FilterDropdown";
import AddMoneyOptions from "@/components/investor/Wallet/AddMoneyOptions";
import VerifyPinModal from "@/components/modal/VerifyPinModal";
import { useGetTransactions } from "@/hook/transaction";
import { useGetMyProfile } from "@/hook/user";
import { useToast } from "@/lib/Provider/toastProvider";
import { formatDate } from "@/utils/formatDate";
import { formatMoney } from "@/utils/formatMoney";
import { ArrowDownLeft, ArrowUpRight, Plus } from "lucide-react";
import { useState } from "react";
import WithdrawMoneyModal from "./WithdrawMoneyModal";

const WalletBody = () => {
  const { showToast } = useToast();
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [addMoneyOptionsOpen, setAddMoneyOptionsOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [showPinVerifyModal, setShowPinVerifyModal] = useState(false);

  const { profile } = useGetMyProfile();
  const limit = 20;

  const { transactions, meta, isLoading } = useGetTransactions(
    page,
    limit,
    "",
    filter
  );

  const taskFilters = [
    { label: "All", value: "" },
    { label: "Deposit", value: "deposit" },
    { label: "Investment", value: "investment" },
    { label: "Withdraw", value: "withdraw" },
    { label: "Referral Reward", value: "referral_reward" },
  ];

  const handlePinVerify = (status) => {
    if (status) {
      setWithdrawModalOpen(true);
    } else {
      showToast("PIN verification failed", "error", "Error");
    }
  };

  const columns = [
    {
      label: "Transaction Id / Account Number",
      accessor: "bank_transaction_id",
      render: (row) => (
        <span className="uppercase">
          {row?.bank_transaction_id ||
            row?.stripe_transaction_id ||
            row?.account_number ||
            "N/A"}
        </span>
      ),
    },
    {
      label: "Currency",
      accessor: "currency",
      render: (row) => <span className="uppercase">{row.currency}</span>,
    },
    {
      label: "Amount",
      accessor: "amount",
      render: (row) => <span>{formatMoney(row.amount)}</span>,
    },
    {
      label: "Premium Fee",
      accessor: "premium_fees",
      render: (row) => <span>{formatMoney(row.premium_fees)}</span>,
    },
    {
      label: "Date",
      accessor: "payment_date",
      render: (row) => <span>{formatDate(row.payment_date)}</span>,
    },
    {
      label: "Type",
      accessor: "transaction_type",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div
            className={`px-2 py-1 rounded-lg ${
              row.transaction_type === "withdraw"
                ? " border border-green-500 text-green-500"
                : row.transaction_type === "investment"
                ? " border border-blue-500 text-blue-500"
                : row.transaction_type === "deposit"
                ? "bg-green-800 text-white"
                : " border border-gray-500 text-gray-500"
            }`}
          >
            {row.transaction_type === "withdraw" ? (
              <div className="flex items-center gap-1">
                <ArrowUpRight size={16} />
                Withdraw
              </div>
            ) : row.transaction_type === "deposit" ? (
              <div className="flex items-center gap-1">
                <Plus size={16} />
                Deposit
              </div>
            ) : row.transaction_type === "investment" ? (
              <div className="flex items-center gap-1">
                <ArrowDownLeft size={16} />
                Investment
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <ArrowDownLeft size={16} />
                {row.transaction_type}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      label: "Status",
      accessor: "status",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div
            className={`px-2 py-1 rounded-full ${
              row.status === "successed"
                ? "bg-green-100 border border-green-500 text-green-500"
                : row.status === "pending"
                ? "bg-gray-100 border border-gray-500 text-gray-500"
                : "bg-red-100 border border-red-500 text-red-500"
            }`}
          >
            {row.status}
          </div>
        </div>
      ),
    },
    // {
    //   label: "",
    //   accessor: "action",
    //   render: (row) => (
    //     <button className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 inline-block">
    //       View Details
    //     </button>
    //   ),
    // },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
        Wallet
      </h1>

      {/* Wallet Balance Section */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
        <h2 className="text-sm text-slate-700 mb-4">Wallet Balance</h2>
        <div className="text-4xl font-bold text-gray-900 mb-6">
          {formatMoney(profile?.wallet_balance, "en-IN")}
        </div>

        <div className="flex gap-4">
          <Button
            // onClick={() => setShowModal(true)}
            variant="solid"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            onClick={() => setAddMoneyOptionsOpen((prev) => !prev)}
          >
            <Plus size={16} />
            {addMoneyOptionsOpen ? "Close" : "Add Money"}
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
            onClick={() => setShowPinVerifyModal(true)}
          >
            <ArrowUpRight size={16} />
            Withdraw
          </Button>
        </div>
      </div>

      {addMoneyOptionsOpen && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 z-50">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
            Add Money Options
          </h2>

          <AddMoneyOptions />
        </div>
      )}
      <VerifyPinModal
        open={showPinVerifyModal}
        onClose={() => setShowPinVerifyModal(false)}
        onVerified={(status) => handlePinVerify(status)}
      />

      <WithdrawMoneyModal
        open={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
      />

      {/* Transaction History Section */}
      <div className="flex justify-end">
        <FilterDropdown
          options={taskFilters}
          defaultValue=""
          onChange={setFilter}
        />
      </div>

      <Table
        columns={columns}
        data={transactions}
        showFilter={false}
        filterValue={filter}
        showPagination={true}
        pagination={{
          page,
          totalPages: meta.totalPages,
          onPageChange: (p) => setPage(p),
        }}
        wrapperText={" Transaction History"}
        isLoading={isLoading}
      />

      {/* {<ModalContainer showModal={showModal} setShowModal={setShowModal} />} */}
    </div>
  );
};

export default WalletBody;
