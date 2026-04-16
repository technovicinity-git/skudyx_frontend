"use client";
import GalleryPopup from "@/components/admin/dashboard/FarmDetails/GalleryPopup";
import Button from "@/components/common/Button";
import Activities from "@/components/common/investment-details/Activities";
import InvestmentPlanAbout from "@/components/common/investment-details/InvestmentPlanAbout";
import Loader from "@/components/loader/Loader";
import { useGetActivityById } from "@/hook/activities";
import { useGetInvestmentPlan } from "@/hook/investmentPlan";
import {
  CoinStackIcon,
  HectaresIcon,
  ImgIcon,
  LeftArrowAltIcon,
  RightArrowIcon,
} from "@/public/assets/icons/icons";
import { formatDate } from "@/utils/formatDate";
import { formatMoney } from "@/utils/formatMoney";
import { isValidUrl } from "@/utils/isValidUrl";
import { Heart, Users2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Cycles from "./Cycles";

const InvestmentDetailsBody = () => {
  // const investmentData = mockInvestment;
  const [activeTab, setActiveTab] = useState("Overview");
  const [currentSlide, setCurrentSlide] = useState(0);
  const mainSliderRef = useRef(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(100);
  const router = useRouter();

  const { id } = useParams();

  const { investmentPlan, isLoading } = useGetInvestmentPlan(id);
  const { activityData } = useGetActivityById(id);

  const mainSliderSettings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (oldIndex, newIndex) => {
      setCurrentSlide(newIndex);
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // const calculateReturn = (amount) => {
  //   return (amount * 0.15).toFixed(0);
  // };

  const totalInvestableAmount =
    investmentPlan?.number_of_slots * investmentPlan?.slot_price;

  const tabs = [
    { id: "Overview", label: "Overview" },
    // { id: "InvestmentData", label: "InvestmentData" },
    { id: "Performance", label: "Performance" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-full">
        <Loader />
      </div>
    );
  }

  return (
    <section className="space-y-6 md:space-y-8">
      {/* Back Button */}
      <div className="mb-5">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-[#42526E] font-medium text-base underline cursor-pointer hover:text-green-800"
        >
          {LeftArrowAltIcon}
          <span>Back</span>
        </button>
      </div>
      <>
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[32px] font-bold text-[#222222] mb-3">
              {investmentPlan.name}
            </h1>
            <p className="text-[#222222] text-base underline cursor-pointer">
              {investmentPlan.location}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-[#667085] hover:text-[#222222] transition-colors cursor-pointer">
              <Heart size={20} />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Main Image Gallery - Grid Layout */}
        <div className="">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:grid-rows-2 auto-rows-auto">
            {/* Main Large Image */}
            <div className="col-span-2 md:row-span-2 relative aspect-[1.95/1] rounded-lg overflow-hidden">
              <Slider
                {...mainSliderSettings}
                ref={mainSliderRef}
                className="h-full equal-height-slider"
              >
                {investmentPlan?.propertyImages?.map((image, index) => (
                  <div key={index} className="relative h-full">
                    <Image
                      src={
                        isValidUrl(image)
                          ? image
                          : "/assets/images/default_image.jpg"
                      }
                      fill
                      alt={`${investmentPlan.name} - Image ${index + 1}`}
                      className="object-cover cursor-grab"
                    />
                  </div>
                ))}
              </Slider>

              {/* Prev Button */}
              <button
                onClick={() => mainSliderRef.current?.slickPrev()}
                className={`absolute left-4 top-1/2 -translate-y-1/2  w-8 md:w-12 h-8 md:h-12 bg-white/60 hover:bg-white rounded-lg flex items-center justify-center transition-all duration-300 rotate-180 text-secondary cursor-pointer
                ${
                  currentSlide === 0
                    ? "opacity-0 pointer-events-none"
                    : "opacity-100 pointer-events-auto"
                }`}
                aria-label="Previous slide"
              >
                {RightArrowIcon}
              </button>
              {/* Next Button */}
              <button
                onClick={() => mainSliderRef.current?.slickNext()}
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-8 md:w-12 h-8 md:h-12 bg-white/60 hover:bg-white rounded-lg flex items-center justify-center transition-all duration-300 text-secondary cursor-pointer
                ${
                  currentSlide === investmentPlan.propertyImages.length - 1
                    ? "opacity-0 pointer-events-none"
                    : "opacity-100 pointer-events-auto"
                }`}
                aria-label="Next slide"
              >
                {RightArrowIcon}
              </button>
            </div>
            <div className="relative rounded-lg overflow-hidden aspect-[1.74/1]">
              <Image
                src={
                  isValidUrl(investmentPlan.propertyImages[1])
                    ? investmentPlan.propertyImages[1]
                    : "/assets/images/default_image.jpg"
                }
                fill
                alt="Investment detail 1"
                className="object-cover h-full w-full"
              />
            </div>
            {/* Bottom Small Image with Button */}
            <div className="relative rounded-lg overflow-hidden aspect-[1.74/1]">
              <Image
                src={
                  isValidUrl(investmentPlan.propertyImages[2])
                    ? investmentPlan.propertyImages[2]
                    : "/assets/images/default_image.jpg"
                }
                fill
                alt="Investment detail 2"
                className="object-cover h-full w-full"
              />
              {/* See all photos button */}
              <button
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-medium shadow-sm flex items-center gap-1 cursor-pointer whitespace-nowrap"
                onClick={() => setIsGalleryOpen(true)}
              >
                <span>{ImgIcon}</span>
                See all photos
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 xl:gap-8">
          {/* Left Column - Main Content */}
          <div className="md:col-span-2 space-y-5 xl:space-y-6">
            <>
              {/* Navigation Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex items-center justify-around">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2.5 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                        activeTab === tab.id
                          ? "border-primary-1 text-primary-1"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === "Overview" && (
                <>
                  {/* Overview Section */}
                  {/* <div className="bg-white rounded-xl shadow-sm p-4 xl:p-6 border border-[#D0D5DD]">
                  <h3 className="text-base font-semibold text-secondary mb-4">
                    Overview
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 mb-2">
                        Location
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {investmentData.locationDescription}
                      </p>
                      <button className="text-[#222222] text-sm font-medium flex items-center gap-1 hover:underline underline cursor-pointer">
                        Show more
                        {RightArrowIcon}
                      </button>
                    </div>
                  </div>
                </div> */}

                  {/* Overview Section */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-[#D0D5DD]">
                    <h3 className="text-base lg:text-[22px] font-semibold text-secondary mb-4">
                      Overview
                    </h3>

                    <div className="space-y-4">
                      {/* Funding Progress */}
                      <div className="space-y-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-1 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                (investmentPlan?.total_invest_amount /
                                  totalInvestableAmount) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5">{CoinStackIcon}</div>
                          <span className="text-sm font-medium text-gray-900">
                            {formatMoney(investmentPlan?.total_invest_amount)}{" "}
                            Funded
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-1.5 flex-wrap">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 ">
                              <Users2 size={18} />
                            </div>
                            <span className="text-sm text-gray-600">
                              {investmentPlan?.total_investor} Investors
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5">{HectaresIcon}</div>
                            <span className="text-sm text-gray-600">
                              {investmentPlan?.farm_id?.size} Hectares
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex gap-2">
                        {investmentPlan?.crop_types.map((cropType, index) => (
                          <span
                            key={index}
                            className="bg-[#F0FDF4] text-primary-1 text-xs px-3 py-1 rounded-full font-medium border border-primary-1"
                          >
                            {cropType}
                          </span>
                        ))}
                        <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium border border-gray-300">
                          {investmentPlan?.type}
                        </span>
                      </div>

                      {/* Description */}
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          {investmentPlan?.description}
                        </p>
                        {/* <p className="text-sm text-gray-600 mb-2">
                            {investmentData.locationDescription}
                          </p> */}
                        {/* <button className="text-[#222222] text-sm font-medium flex items-center gap-1 hover:underline underline cursor-pointer">
                            Show more
                            {RightArrowIcon}
                          </button> */}
                      </div>
                    </div>
                  </div>

                  {/* Why Invest Section */}
                  <InvestmentPlanAbout role={"investor"} />
                  {/* <div className="bg-white rounded-xl shadow-sm p-4 xl:p-6 border border-[#D0D5DD]">
                    <h3 className="text-base font-semibold text-secondary mb-4">
                      Why Invest
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-primary-1 rounded flex items-center justify-center mt-0.5">
                          <Check size={14} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-800">
                            Proven Track Record: Averaged 3.5 tons/ha in the
                            past two years
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-primary-1 rounded flex items-center justify-center mt-0.5">
                          <Check size={14} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-800">
                            High-Demand Crop: Maize is a staple food in Nigeria
                            with strong market demand
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-primary-1 rounded flex items-center justify-center mt-0.5">
                          <Check size={14} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-800">
                            Expert Management: Led by a team with over 15 years
                            of agri-investment experience
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-primary-1 rounded flex items-center justify-center mt-0.5">
                          <Check size={14} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-800">
                            Fully Insured: Weather and pest risk coverage
                            included in your investment
                          </p>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  {/* Investment Details Section */}
                  <div className="bg-white rounded-xl shadow-sm p-4 xl:p-6 border border-[#D0D5DD]">
                    <h3 className="text-base font-semibold text-secondary mb-4">
                      Investment Details
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex justify-between gap-4">
                        <span className="text-sm text-gray-600">
                          Minimum Investment:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          $
                          {investmentPlan
                            ? (
                                Number(investmentPlan.slot_price) *
                                Number(investmentPlan.min_slot)
                              ).toLocaleString()
                            : 0}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-sm text-gray-600">Duration:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {investmentPlan?.duration}{" "}
                          {investmentPlan?.duration_type === "monthly"
                            ? "months"
                            : "years"}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-sm text-gray-600">
                          Start Date:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(investmentPlan.startDate)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-sm text-gray-600">
                          Maturity Date:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(investmentPlan.matureDate)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-sm text-gray-600">
                          Return on Investment:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {investmentPlan.roi}
                        </span>
                      </div>
                      {/* <div className="flex justify-between gap-4">
                          <span className="text-sm text-gray-600">
                            Soil Quality:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            Satic data
                          </span>
                        </div> */}
                      <div className="flex justify-between gap-4">
                        <span className="text-sm text-gray-600">
                          Risk Assessment:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {investmentPlan.riskLevel}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-sm text-gray-600">
                          Payment Frequency:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {investmentPlan?.duration_type}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-sm text-gray-600">
                          Current Status:
                        </span>
                        <span className="px-3 py-1 bg-primary-1 text-white text-xs rounded-full">
                          {investmentPlan?.status}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-sm text-gray-600">
                          Slot Price:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatMoney(investmentPlan?.slot_price)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-sm text-gray-600">
                          Total slots:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {investmentPlan?.number_of_slots}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-sm text-gray-600">
                          Available slots:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {investmentPlan?.slotsAvailable}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-sm text-gray-600">
                          Maximum slots:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {investmentPlan?.max_slot}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-sm text-gray-600">
                          Minimum slots:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {investmentPlan?.min_slot}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-sm text-gray-600">Discount:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {investmentPlan?.discount_percent}%
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-sm text-gray-600">
                          Discount on slots:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {investmentPlan?.slots_for_discount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Cycles cyclesData={investmentPlan?.cycles} />
                  <Activities
                    activities={activityData?.[0]?.activities}
                    role={"investor"}
                  />

                  {/* Past Yield Performance */}
                  {/* <PastYieldPerformance /> */}

                  {/* Investment Calculator */}
                  <div className="bg-white rounded-xl shadow-sm p-4 xl:p-6 border border-[#D0D5DD]">
                    <h3 className="text-base font-semibold text-secondary mb-4">
                      Investment Calculator
                    </h3>
                    <div className="border border-gray-200 max-w-[380px] mx-auto rounded-lg px-4 py-[28px] text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        Return on investment
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          $
                          {investmentAmount * (investmentPlan?.roi / 100) +
                            investmentAmount}
                        </span>
                        <span className="text-sm text-primary-1 font-medium">
                          ROI: {investmentPlan?.roi}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-4 p-2 bg-slate-100 rounded">
                        <button
                          onClick={() =>
                            setInvestmentAmount(
                              Math.max(100, investmentAmount - 100)
                            )
                          }
                          className="w-10 h-10 bg-gray-800 text-white rounded flex items-center justify-center hover:bg-gray-700 transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={investmentAmount}
                          onChange={(e) =>
                            setInvestmentAmount(parseInt(e.target.value) || 0)
                          }
                          className="flex-1 text-center px-3 py-2 focus:outline-none appearance-none w-full"
                        />
                        <button
                          onClick={() =>
                            setInvestmentAmount(investmentAmount + 100)
                          }
                          className="w-10 h-10 bg-gray-800 text-white rounded flex items-center justify-center hover:bg-gray-700 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Investment Calculator Steps */}
                  <div className="bg-white rounded-xl shadow-sm p-4 xl:p-6 border border-[#D0D5DD]">
                    <h3 className="text-base font-semibold text-secondary mb-4">
                      Investment Calculator
                    </h3>
                    <div className="space-y-4">
                      {[1, 2, 3].map((step) => (
                        <div key={step} className="bg-green-50 rounded-lg p-3">
                          <p className="text-xs text-accent mb-2">
                            Step {step}:
                          </p>
                          <h4 className="text-base font-medium mb-2 text-black">
                            Invest in a farm
                          </h4>
                          <p className="text-sm text-slate-800">
                            Our dedicated team of agronomists and farm managers
                            ensure best-in-class farming techniques, from seed
                            selection to post-harvest handling, with a strong
                            focus on consistency, efficiency, and profitability.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === "Investment" && (
                <div className="bg-white rounded-xl shadow-sm p-4 xl:p-6 border border-[#D0D5DD]">
                  <h3 className="text-base font-semibold text-secondary mb-4">
                    Investment Information
                  </h3>
                  <p className="text-gray-600">
                    Detailed investment information and terms will be displayed
                    here.
                  </p>
                </div>
              )}

              {activeTab === "Performance" && (
                <div className="bg-white rounded-xl shadow-sm p-4 xl:p-6 border border-[#D0D5DD]">
                  <h3 className="text-base font-semibold text-secondary mb-4">
                    Performance Metrics
                  </h3>
                  <p className="text-gray-600">
                    Detailed performance metrics and analytics will be displayed
                    here. This section will show historical data, yield
                    comparisons, and investment performance over time.
                  </p>
                </div>
              )}
            </>
          </div>

          {/* Right Column - Investment Summary & Contact */}
          <div className="md:col-span-1 space-y-6 md:mt-16">
            {/* Investment Summary Card */}
            <div className="bg-gray-50 rounded-xl p-4 xl:p-6 border border-[#D0D5DD]">
              <h3 className="text-base font-semibold text-secondary mb-4">
                Investment Summary
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-gray-600">Maturity:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(investmentPlan.matureDate)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-gray-600">Returns:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {investmentPlan.roi}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-gray-600">Risk Level:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {investmentPlan.riskLevel}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-gray-600">
                    Investment Start Date:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(investmentPlan?.startDate)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-gray-600">
                    Last Date of Investment:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(investmentPlan?.investEndDate)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="px-3 py-1 bg-primary-1 text-white text-xs rounded-full font-medium ">
                    {investmentPlan?.status}
                  </span>
                </div>
              </div>

              <Button
                variant="solid"
                className="w-full"
                disabled={
                  investmentPlan?.status !== "open" ||
                  new Date(investmentPlan?.investEndDate) < new Date() ||
                  new Date(investmentPlan?.startDate) > new Date()
                }
                onClick={() =>
                  router.push(`/investor/investment-payment/${id}`)
                }
              >
                INVEST NOW
              </Button>
            </div>

            {/* Contact Card */}
            {/* <div className="bg-blue-900 rounded-xl p-4 xl:p-6 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src={investmentData.owner.avatar}
                    alt={investmentData.owner.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">
                    {investmentPlan?.manager_name}
                  </h4>
                  <p className="text-sm text-blue-200">
                    {investmentData.owner.role}
                  </p>
                </div>
              </div>
              <p className="text-sm text-blue-200 mb-4">
                {investmentData.owner.description}
              </p>
              <Button
                variant="outline"
                className="w-full border-white text-[#002447] hover:bg-white hover:text-blue-900 max-[1200]:!py-2"
              >
                GET IN TOUCH
                {RightArrowIcon}
              </Button>
            </div> */}
          </div>
        </div>

        {/* Gallery Popup */}
        <GalleryPopup
          images={investmentPlan.propertyImages}
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
        />
      </>
    </section>
  );
};

export default InvestmentDetailsBody;
