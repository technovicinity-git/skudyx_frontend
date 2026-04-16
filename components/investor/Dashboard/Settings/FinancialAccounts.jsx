"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, X } from "lucide-react";
import Button from "@/components/common/Button";
import { BankIcon } from "@/public/assets/icons/icons";
import { useCreateBank, useGetMyBanks } from "@/hook/bank";
import { useToast } from "@/lib/Provider/toastProvider";
import { useQueryClient } from "@tanstack/react-query";
import VerifyPinModal from "@/components/modal/VerifyPinModal";

const FinancialAccounts = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bank_name, setBankName] = useState("");
  const [bank_branch_name, setBankBranchName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [showPinVerifyModal, setShowPinVerifyModal] = useState(false);

  const { createBank, isLoading, errorMessage } = useCreateBank();
  const { myBanks, isLoading: isLoadingMyBanks } = useGetMyBanks();

  const handleBack = () => {
    router.back();
  };

  const handleAddNewAccount = () => {
    // setIsModalOpen(true);
    setShowPinVerifyModal(true);
  };

  const handleEditAccount = () => {
    // Navigate to payout settings page
    router.push("/investor/settings/payout");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);

    setAccountNumber("");
    setAccountName("");
  };

  const handlePinVerify = (status) => {
    if (status) {
      setIsModalOpen(true);
    } else {
      // PIN verification failed
      showToast("PIN verification failed", "error", "Error");
    }
  };

  const handleAddBankAccount = () => {
    // Handle form submission

    const data = {
      bank_name,
      bank_branch_name,
      account_number: accountNumber,
      account_name: accountName,
    };

    createBank(data, {
      onSuccess: () => {
        showToast("Bank account added successfully", "success", "Success");
        handleCloseModal();
        queryClient.invalidateQueries(["myBanks"]);
      },
    });
  };

  return (
    <div className="">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mb-6 hover:bg-gray-200 transition-colors"
      >
        <ArrowLeft size={20} className="text-gray-600" />
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#222222] mb-2">
          Payout Settings
        </h1>
        <p className="text-gray-600 text-base">
          Please enter your current password to change your password.
        </p>
      </div>

      {/* Payout Account Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-w-2xl">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-[#222222] mb-6">
            Payout Accounts
          </h2>

          {isLoadingMyBanks ? (
            <div className="flex items-center justify-center py-4">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : (
            <>
              {/* Current Payout Account */}
              {myBanks?.map((account, index) => (
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors border border-slate-100"
                  onClick={handleEditAccount}
                  key={index}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#007D8B] text-white rounded-full flex items-center justify-center">
                      {BankIcon}
                    </div>
                    <div>
                      <h3 className="font-medium text-[#222222] text-base">
                        {account?.account_name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {account?.bank_name} • {account?.account_number}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              ))}
            </>
          )}

          {/* Add New Bank Account */}
          <div className="mt-6 cursor-pointer" onClick={handleAddNewAccount}>
            <div className="flex items-center gap-4">
              <ChevronRight size={20} className="text-gray-400" />
              <div>
                <h3 className="font-medium text-pribg-primary-1 text-base">
                  Add new bank account
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VerifyPinModal
        open={showPinVerifyModal}
        onClose={() => setShowPinVerifyModal(false)}
        onVerified={(status) => handlePinVerify(status)}
      />

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-[620px] w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 ">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#222222]">
                  Link Your Bank Account
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-600 text-base mt-2">
                Add your bank details to receive payments. Make sure the account
                name matches your verified identity.
              </p>
            </div>

            {/* Modal Body */}
            <div className="px-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bank_name}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Bank name"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-1 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch Name
                </label>
                <input
                  type="text"
                  value={bank_branch_name}
                  onChange={(e) => setBankBranchName(e.target.value)}
                  placeholder="Branch name"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-1 focus:border-transparent"
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Account Number"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-1 focus:border-transparent"
                />
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account name
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Account name"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-1 focus:border-transparent"
                />
              </div>
            </div>
            {errorMessage && (
              <p className="px-6 text-red-500 mt-2">{errorMessage}</p>
            )}

            {/* Modal Footer */}
            <div className="p-6  flex justify-between gap-3">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                className=" hover:bg-gray-50 !w-max"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddBankAccount}
                className="text-white !w-max"
                variant="solid"
              >
                {isLoading ? "Adding..." : "Add Bank Account"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialAccounts;
