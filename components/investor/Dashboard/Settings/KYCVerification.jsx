"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import {
  ColoredHouseIcon,
  ColoredIDIcon,
  ColoredUserIcon,
} from "@/public/assets/icons/icons";
import { useGetMyProfile } from "@/hook/user";
import { useGetKYCById, useGetKYCHistory } from "@/hook/kyc";
import CustomPagination from "@/components/pagination/CustomPagination";
const KYCVerification = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { profile } = useGetMyProfile();
  const { kycData } = useGetKYCById(profile?._id);
  const {
    kycHistory,
    isLoading: historyLoading,
    meta,
  } = useGetKYCHistory(page);

  const handleBack = () => {
    router.back();
  };

  const verificationSteps = [
    {
      id: 0,
      title: "Account created",
      status: profile?.account_created ? "Completed" : "Pending",
      icon: ColoredUserIcon,
      completed: profile?.account_created,
    },
    {
      id: 1,
      title: "Document",
      status:
        kycData?.docImage_verified === "pending"
          ? "Pending"
          : kycData?.docImage_verified === "approved"
          ? "Completed"
          : kycData?.docImage_verified === "rejected"
          ? "Rejected"
          : "Not Uploaded",

      icon: ColoredIDIcon,
      completed: kycData?.docImage_verified === "approved",
    },
    {
      id: 2,
      title: "Photo",
      status:
        kycData?.frontImage_verified === "pending"
          ? "Pending"
          : kycData?.frontImage_verified === "approved"
          ? "Completed"
          : kycData?.frontImage_verified === "rejected"
          ? "Rejected"
          : "Not Uploaded",
      icon: ColoredIDIcon,
      completed: kycData?.frontImage_verified === "approved",
    },
    {
      id: 3,
      title: "Address",
      status: profile?.address_created ? "Completed" : "Submit your info",
      icon: ColoredHouseIcon,
      completed: profile?.address_created,
    },
  ];

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
          KYC & Accreditation Verification
        </h1>
        <p className="text-gray-600 text-base">
          Ensure the security of your account and comply with regulatory
          requirements
        </p>
      </div>

      {/* Verification Steps Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-w-2xl">
        <div className="p-6">
          <div className="space-y-6">
            {verificationSteps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center justify-between p-3 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 ${
                  step.completed
                    ? "bg-green-50 pointer-events-none"
                    : "bg-white"
                }`}
                onClick={() => {
                  router.push(
                    `/investor/identity-verification?step=${step.id}`
                  );
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <div className="text-white">{step.icon}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#222222] text-base">
                      {step.title}
                    </h3>
                    <span
                      className={` ${
                        step.status === "Completed"
                          ? "text-green-500"
                          : step.status === "Pending"
                          ? "text-yellow-500"
                          : "text-red-500"
                      } font-medium text-xs`}
                    >
                      {step.status !== "Unknown"
                        ? step.status
                        : "Submit Your info"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {step.completed && (
                    <div className="w-6 h-6 bg-primary-1 rounded-full flex items-center justify-center">
                      <Check size={16} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KYC History */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-[#222222] mb-4">
          KYC History
        </h2>
        <div className="p-6">
          {historyLoading ? (
            <div>Loading...</div>
          ) : (
            <div>
              {kycHistory.map((item) => (
                <div key={item._id} className="py-2 border-b border-gray-200">
                  {item.doc_note && (
                    <p className="text-gray-600">
                      <span className="font-medium">
                        Document&#39;s note from Admin:
                      </span>{" "}
                      {item.doc_note}
                      <span className="ml-2 text-sm text-gray-500">
                        ({new Date(item.createdAt).toLocaleDateString()})
                      </span>
                    </p>
                  )}

                  {item.photo_note && (
                    <p className="text-gray-600">
                      <span className="font-medium">
                        Photo&#39;s note from Admin:
                      </span>{" "}
                      {item.photo_note}
                      <span className="ml-2 text-sm text-gray-500">
                        ({new Date(item.createdAt).toLocaleDateString()})
                      </span>
                    </p>
                  )}

                  {item.frontImage && (
                    <>
                      <div className="mt-2">
                        <span className="font-medium">Photo:</span>
                        <img
                          src={item.frontImage}
                          alt="Front"
                          className="w-40 h-auto mt-1 rounded border"
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        ({new Date(item.createdAt).toLocaleDateString()})
                      </span>
                    </>
                  )}

                  {item.docImage && (
                    <>
                      <div className="mt-2">
                        <span className="font-medium">Document:</span>
                        <img
                          src={item.docImage}
                          alt="Document"
                          className="w-40 h-auto mt-1 rounded border"
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        ({new Date(item.createdAt).toLocaleDateString()})
                      </span>
                    </>
                  )}

                  {item.frontImage_verified && (
                    <p>
                      Photo verify status:{" "}
                      {item.frontImage_verified === "approved" ? (
                        <span className="text-green-600">
                          ✅ {item.frontImage_verified}
                        </span>
                      ) : item.frontImage_verified === "rejected" ? (
                        <span className="text-red-600">
                          ❌ {item.frontImage_verified}
                        </span>
                      ) : (
                        <span className="text-yellow-600">
                          ⏳ {item.frontImage_verified}
                        </span>
                      )}
                      <span className="ml-2 text-sm text-gray-500">
                        ({new Date(item.createdAt).toLocaleDateString()})
                      </span>
                    </p>
                  )}

                  {item.docImage_verified && (
                    <>
                      <p>
                        Document verify status:{" "}
                        {item.docImage_verified === "approved" ? (
                          <span className="text-green-600">
                            ✅ {item.docImage_verified}
                          </span>
                        ) : item.docImage_verified === "rejected" ? (
                          <span className="text-red-600">
                            ❌ {item.docImage_verified}
                          </span>
                        ) : (
                          <span className="text-yellow-600">
                            ⏳ {item.docImage_verified}
                          </span>
                        )}
                        <span className="ml-2 text-sm text-gray-500">
                          ({new Date(item.createdAt).toLocaleDateString()})
                        </span>
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <CustomPagination
          page={page}
          totalPages={meta?.totalPages}
          onPageChange={(p) => setPage(p)}
          showPagination={!historyLoading || meta?.totalPages > 1}
        />
      </div>
    </div>
  );
};

export default KYCVerification;
