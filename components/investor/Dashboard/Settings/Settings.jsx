"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ProfileIcon,
  KYCIcon,
  SettingsIcon,
  UsersIcon,
  NotificationIcon,
  EditIcon,
  UserIcon,
  KYCValidationIcon,
  BankIcon,
  SecurityIcon,
  Users2Icon,
  ChatIcon,
  FeedbackIcon,
} from "@/public/assets/icons/icons";
import { DollarSignIcon } from "lucide-react";
import { useGetPosts } from "@/hook/post";
import Loader from "@/components/loader/Loader";

const Settings = () => {
  const page = 1;
  const limit = 3;
  const { posts, isLoading: isPostsLoading } = useGetPosts(page, limit);

  const settingsCards = [
    {
      id: 1,
      title: "Account information",
      description: "Details about your personal information.",
      icon: UserIcon,
      href: "/investor/settings/account",
    },
    {
      id: 2,
      title: "KYC & Accreditation Verification",
      description:
        "Ensure the security of your account and comply with regulatory requirements.",
      icon: KYCValidationIcon,
      href: "/investor/settings/kyc",
    },
    {
      id: 3,
      title: "Financial Accounts",
      description:
        "Connect a bank account for easy withdrawal and management of your investments.",
      icon: BankIcon,
      href: "/investor/settings/financial",
    },
    {
      id: 4,
      title: "Security",
      description: "Protect your investments with enhanced security.",
      icon: SecurityIcon,
      href: "/investor/settings/security",
    },
    {
      id: 5,
      title: "Refer a friend",
      description: "Your additional earnings as a committed partner.",
      icon: Users2Icon,
      href: "/investor/settings/refer",
    },
    {
      id: 6,
      title: "Settings",
      description: "Customize your preferences.",
      icon: SettingsIcon,
      href: "/investor/settings/preferences",
    },
    {
      id: 7,
      title: "Support",
      description: "Submit a ticket for personalized support.",
      icon: ChatIcon,
      href: "/investor/settings/support",
    },
    {
      id: 8,
      title: "Feedback",
      description: "Share your thoughts and suggestions with us.",
      icon: FeedbackIcon,
      href: "/investor/settings/feedback",
    },
  ];

  return (
    <div className="">
      {/* Profile & Settings Section */}
      <div className="mb-6 md:mb-12">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#222222] mb-6 md:mb-8">
          Profile & Settings
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {settingsCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start flex-col gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="w-6 h-6 text-primary-1">{card.icon}</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#222222] text-base mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Learn Section */}
      <div className="">
        <h2 className="text-xl md:text-2xl font-semibold text-[#222222] mb-4 md:mb-6">
          Learn
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {isPostsLoading ? (
            <Loader fullScreen />
          ) : (
            <>
              {posts?.map((card) => (
                <div
                  key={card?._id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow "
                >
                  <Link
                    href={`/blogs/${card?._id}`}
                    className=" bg-gray-200 relative aspect-[1.84/1] block"
                  >
                    <Image
                      src={card?.image}
                      alt={card?.title}
                      fill
                      className="object-cover h-full w-full"
                    />
                  </Link>
                  <div className="p-4">
                    <h3 className="mb-2">
                      <Link
                        href={`/blogs/${card?._id}`}
                        className="font-semibold text-[#222222] text-base  hover:text-primary-1 transition-colors "
                      >
                        {card?.title}
                      </Link>
                    </h3>
                    {/* <p className="text-gray-600 text-base">2</p> */}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
