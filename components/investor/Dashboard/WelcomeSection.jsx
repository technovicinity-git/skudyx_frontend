"use client";

import { useGetMyProfile } from "@/hook/user";
import {
  InvestmentIcon,
  KYCIcon,
  ProfileIcon,
  TopRightArrowIcon,
} from "@/public/assets/icons/icons";
import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const WelcomeSection = () => {
  const { profile, isLoading } = useGetMyProfile();
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({
    profile: true,
    kyc: profile?.kyc_verified,
    investment: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      setShowWelcomePopup(!profile?.kyc_verified);
    }
  }, [profile?.kyc_verified]);

  // useEffect(() => {
  //   // Check if this is the first time the user is visiting the investor dashboard
  //   const hasSeenWelcome = localStorage.getItem("hasSeenWelcomePopup");

  //   if (!hasSeenWelcome) {
  //     // Show the welcome popup for first-time users
  //     setShowWelcomePopup(true);
  //     // Mark that the user has seen the welcome popup
  //     localStorage.setItem("hasSeenWelcomePopup", "true");
  //   }
  // }, []);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (showWelcomePopup) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Prevent scrolling
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      // Cleanup function to restore scrolling
      return () => {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [showWelcomePopup]);

  // const handleCloseWelcomePopup = () => {
  //   setShowWelcomePopup(false);
  // };

  const tasks = [
    {
      id: "profile",
      title: "Complete your profile",
      description: "Configure your personal data and notification preference",
      icon: ProfileIcon,
      completed: completedTasks.profile,
      action: () => setCompletedTasks((prev) => ({ ...prev, profile: true })),
    },
    {
      id: "kyc",
      title: "Set up KYC",
      description: "Set and complete your KYC",
      icon: KYCIcon,
      completed: completedTasks.kyc,
      action: () => {
        router.push("/investor/identity-verification");
      },
    },
    {
      id: "investment",
      title: "Make Your First Investment",
      description: "Proceed to make your first investment",
      icon: InvestmentIcon,
      completed: completedTasks.investment,
      action: () => {
        setCompletedTasks((prev) => ({ ...prev, investment: true }));
        router.push("/investor/investment");
      },
    },
  ];

  const resources = [
    {
      id: 1,
      title: "Investment Guide",
      description:
        "Learn how to make smart investment decisions and understand our platform features.",
      image: "/assets/images/green-trees.webp",
    },
    {
      id: 2,
      title: "Platform Tutorial",
      description:
        "Get familiar with our dashboard, portfolio tracking, and investment management tools.",
      image: "/assets/images/vegetables.webp",
    },
    {
      id: 3,
      title: "Best Practices",
      description:
        "Discover proven strategies for successful agricultural investments and risk management.",
      image: "/assets/images/vegetables-2.webp",
    },
  ];

  return (
    <>
      <section className="mb-4 md:mb-6 lg:mb-10">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#222222]">
          Welcome back, {profile?.first_name || ""}!
        </h1>

        {/* Welcome Popup */}
        {showWelcomePopup && (
          <div className="fixed  top-[10px] lg:left-[150px]  w-[calc(100%-30px)]  h-[calc(100%-10px)]  bg-black/40 flex items-center justify-center z-21 p-4">
            <div className="bg-white rounded-xl max-w-[1170px] w-full max-h-[80vh] overflow-hidden">
              <div className="max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-start justify-between py-4 md:py-6 px-5 md:px-10 border-b border-gray-200 sticky top-0 bg-white z-10">
                  <h3 className="text-sm sm:text-base font-semibold text-[#222222]">
                    GETTING STARTED
                  </h3>
                  {/* <button
                  onClick={handleCloseWelcomePopup}
                  className="text-[#222222]/70 hover:text-[#222222] transition-colors p-1 sm:p-2 rounded-lg bg-black/5 hover:bg-black/10 cursor-pointer"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button> */}
                </div>

                {/* Welcome Section */}
                <div className="pt-4 md:pt-6 xl:pt-10 px-5 md:px-10 pb-4 md:pb-6 border-b border-b-gray-200">
                  <h2 className="text-xl md:text-2xl lg:text-[32px] font-semibold text-[#222222] mb-3">
                    Welcome to Green Wealth! 🎉
                  </h2>
                  <p className="text-[#717171] text-xs sm:text-sm md:text-base">
                    Getting started on our platform as a fund manager made easy
                    with these few exercises.
                  </p>
                </div>

                <div className="pt-4 md:pt-8 px-5 md:px-10 pb-4 md:pb-12">
                  {/* Task Cards */}
                  <div className="flex items-stretch justify-between gap-4 md:gap-5 flex-wrap mb-4 md:mb-8">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white border border-[#E0E0E0] rounded-md py-4 md:py-6 px-4 md:px-5 hover:shadow-md transition-shadow flex-1 min-w-[250px] sm:min-w-[300px]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex flex-col sm:flex-row items-start gap-3">
                            <div className="w-12 h-12 bg-[#F0FDF4] rounded-sm flex items-center justify-center ">
                              {task.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-semibold text-[#222222] mb-2">
                                {task.title}
                              </h3>
                              <p className="text-sm text-[#4F4F4F]">
                                {task.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex p-2 items-center cursor-pointer hover:bg-gray-100">
                            {task.completed ? (
                              <div className="sm:w-5 sm:h-5 bg-primary-1 rounded-full flex items-center justify-center">
                                <Check
                                  size={12}
                                  className="text-white h-3 w-3"
                                />
                              </div>
                            ) : (
                              <span
                                onClick={task.action}
                                className="text-[#222222] transition-colors"
                              >
                                <ArrowRight
                                  size={24}
                                  className="h-5 sm:h-6 w-5 sm:w-6"
                                />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Resources Section */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#222222] mb-6">
                      Resources for Getting Started
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {resources.map((resource) => (
                        <div key={resource.id} className="bg-white">
                          <div className="relative aspect-[2.16/1] overflow-hidden rounded-lg md:rounded-2xl">
                            <Image
                              src={resource.image}
                              alt={resource.title}
                              fill
                              className="object-cover h-full w-full"
                            />
                          </div>
                          <div className="pt-6">
                            <Link
                              href={""}
                              className="flex justify-between font-semibold text-base md:text-xl text-gray-900 hover:text-primary-1"
                            >
                              <span className="mb-2">{resource.title}</span>
                              <span className="h-4 w-4">
                                {TopRightArrowIcon}
                              </span>
                            </Link>
                            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                              {resource.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default WelcomeSection;
