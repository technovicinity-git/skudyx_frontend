"use client";
import Table from "@/components/admin/dashboard/Table";
import Button from "@/components/common/Button";
import { useGetMyProfile, useGetRefferedList } from "@/hook/user";
import { formatDate } from "@/utils/formatDate";
import { ArrowLeft, Copy, TrendingUp, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ReferFriend = () => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [page, setPage] = useState(1);

  const { profile } = useGetMyProfile();
  const { referredList, isLoading, meta } = useGetRefferedList(
    profile?._id,
    page
  );

  const handleBack = () => {
    router.back();
  };
  // eslint-disable-next-line no-undef
  const referralLink = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/investor/signup?ref=${profile?.referral_code}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(profile?.referral_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const referralSteps = [
    {
      id: 1,
      icon: <Copy size={20} />,
      text: "Copy or share your referral link",
    },
    {
      id: 2,
      icon: <Users size={20} />,
      text: "Your friends get $100 when they join and complete onboarding",
    },
    {
      id: 3,
      icon: <TrendingUp size={20} />,
      text: "You get $1000 when they invest $10,000 or more",
    },
  ];

  const columns = [
    {
      label: "Name",
      accessor: "name",
      render: (row) => (
        <span className="capitalize">
          {row.first_name} {row.last_name}
        </span>
      ),
    },
    {
      label: "Joined Date",
      accessor: "created_at",
      render: (row) => <span>{formatDate(row.createdAt)}</span>,
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
        <h1 className="text-2xl font-semibold text-[#222222] mb-2">
          Refer A Friend
        </h1>
      </div>

      {/* Referral and Reward Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 ">
          <div className="text-3xl font-bold text-[#222222] mb-2">
            {profile?.referral_number || 0}
          </div>
          <div className="text-gray-600 text-sm">Referral</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 ">
          <div className="text-3xl font-bold text-[#222222] mb-2">
            {profile?.referral_reward}
          </div>
          <div className="text-gray-600 text-sm">Reward</div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white border border-gray-200 max-w-[670px] rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[#222222] mb-6">
          How It Works
        </h2>

        <div className="space-y-6 mb-6">
          {referralSteps.map((step) => (
            <div key={step.id} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="text-green-600">{step.icon}</div>
              </div>
              <div className="flex-1">
                <p className="text-[#222222] text-base leading-relaxed">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bonus Note */}
        <p className="text-gray-500 text-sm mb-6">
          Bonus is paid into your account after your friends investments are
          fully funded and closed
        </p>
        <div className="flex my-2 items-center gap-4">
          <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
            {profile?.referral_code}
          </div>

          {/* Copy Link Button */}
          <Button
            onClick={handleCopyCode}
            // className="bg-primary-1 hover:bg-green-700 text-white flex items-center justify-center gap-2 w-max"
            variant="solid"
          >
            <Copy size={16} />
            {copiedCode ? "Copied!" : "Copy"}
          </Button>
        </div>
        <div className="flex my-2 items-center gap-4">
          <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
            {referralLink}
          </div>

          {/* Copy Link Button */}
          <Button
            onClick={handleCopyLink}
            // className="bg-primary-1 hover:bg-green-700 text-white flex items-center justify-center gap-2 w-max"
            variant="solid"
          >
            <Copy size={16} />
            {copied ? "Link Copied!" : "Copy Link"}
          </Button>
        </div>
      </div>
      <div className="mt-10">
        <h1 className="my-4 text-2xl">Referred Users</h1>
        <Table
          columns={columns}
          data={referredList}
          showFilter={false}
          showPagination={true}
          pagination={{
            page,
            totalPages: meta.totalPages,
            onPageChange: (p) => setPage(p),
          }}
          wrapperText={"Referred Users"}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ReferFriend;
