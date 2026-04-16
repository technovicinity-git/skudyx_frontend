"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Building2 } from "lucide-react";
import Button from "@/components/common/Button";
import { BankIcon } from "@/public/assets/icons/icons";
import { useDeleteBank, useGetMyBanks } from "@/hook/bank";
import CustomAlert from "@/components/alert/CustomAlert";
import { useToast } from "@/lib/Provider/toastProvider";
import { useQueryClient } from "@tanstack/react-query";

const PayoutSettings = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAccount, setSelectedAccount] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);

  const { myBanks, isLoading: isLoadingMyBanks } = useGetMyBanks();
  const { deleteBank, isLoading: isLoadingDeleteBank } = useDeleteBank();

  const handleBack = () => {
    router.back();
  };

  const handleAddNewAccount = () => {
    // Navigate to add new bank account page or open modal
    router.push("/investor/settings/financial");
  };

  const handleRemoveAccount = () => {
    // Handle account removal
    deleteBank(selectedAccount._id, {
      onSuccess: () => {
        showToast("Bank account removed successfully", "success", "Success");
        queryClient.invalidateQueries("myBanks");
        setAlertOpen(false);
        setSelectedAccount(null);
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
        <h1 className="text-2xl lg:text-3xl font-semibold text-[#222222] mb-2">
          Payout Settings
        </h1>
        <p className="text-gray-600 text-base">
          Please enter your current password to change your password.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Payout Accounts List */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-[#222222] mb-6">
              Payout account
            </h2>

            {isLoadingMyBanks ? (
              <div className="flex items-center justify-center py-4">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : (
              <>
                {/* Account List */}
                <div className="space-y-4">
                  {myBanks?.map((account, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between py-4 px-4 rounded-lg cursor-pointer transition-colors ${
                        selectedAccount._id === account._id
                          ? "bg-gray-50 border border-gray-200"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedAccount(account)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#007D8B] text-white rounded-full flex items-center justify-center">
                          {BankIcon}
                        </div>
                        <div>
                          <h3 className="font-medium text-[#222222] text-base">
                            {account.account_name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {account.bank_name} • {account.account_number}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  ))}
                </div>
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

        {/* Right Column - Selected Account Details */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              {/* Bank Icon */}
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mb-4">
                <Building2 size={32} className="text-white" />
              </div>

              {/* Account Details */}
              {!selectedAccount ? (
                <p className="p-2 mb-2 text-gray-500 bg-gray-100 rounded-md">
                  Select an account
                </p>
              ) : (
                <>
                  <h3 className="font-semibold text-[#222222] text-lg mb-2">
                    {selectedAccount.account_name}
                  </h3>
                  <p className="text-gray-600 text-base mb-8">
                    {selectedAccount.bank_name} •{" "}
                    {selectedAccount.account_number}
                  </p>
                </>
              )}

              {/* Remove Button */}
              <Button
                onClick={() => setAlertOpen(true)}
                className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-600"
                disabled={isLoadingDeleteBank}
              >
                Remove bank account
              </Button>
              <CustomAlert
                open={alertOpen}
                title="Remove Bank Account?"
                message="Are you sure you want to delete this bank account? This action cannot be undone."
                confirmText={isLoadingDeleteBank ? "Deleting..." : "Delete"}
                cancelText="Cancel"
                onConfirm={handleRemoveAccount}
                onCancel={() => setAlertOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutSettings;
