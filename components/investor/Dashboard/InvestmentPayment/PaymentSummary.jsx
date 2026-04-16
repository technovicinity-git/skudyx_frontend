import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Label from "@/components/common/Label";
import { useCreateInvestment } from "@/hook/investment";
import { useGetInvestmentPlan } from "@/hook/investmentPlan";
import { useGetMyProfile } from "@/hook/user";
import { useToast } from "@/lib/Provider/toastProvider";
import { formatMoney } from "@/utils/formatMoney";
import { isValidUrl } from "@/utils/isValidUrl";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentSummary = () => {
  const { showToast } = useToast();
  const { id } = useParams();
  const router = useRouter();
  const [slotNumber, setSlotNumber] = useState(0);

  const { investmentPlan } = useGetInvestmentPlan(id);
  const { profile } = useGetMyProfile();

  const minSlot = investmentPlan?.min_slot || 0;
  const maxSlot = investmentPlan?.max_slot || 0;
  const slotPrice = investmentPlan?.slot_price || 0;
  const premium_fees = investmentPlan?.premium_fees || 0;
  const slotsForDiscount = investmentPlan?.slots_for_discount || 0;
  const discountPercent = investmentPlan?.discount_percent || 0;

  // Calculate amount with discount logic
  let amount = slotNumber * slotPrice + slotNumber * premium_fees;

  if (slotNumber >= slotsForDiscount && slotsForDiscount > 0) {
    amount = amount - slotNumber * premium_fees;
    amount =
      amount - (amount * discountPercent) / 100 + slotNumber * premium_fees;
  }

  useEffect(() => {
    if (minSlot) {
      setSlotNumber(minSlot);
    }
  }, [minSlot]);

  const { createInvestment, isLoading, errorMessage } = useCreateInvestment({
    onSuccess: () => {
      showToast("Investment successfull", "success", "Success");
      router.push(`/investor/investment/${investmentPlan?._id}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const units = formData.get("slot-number");
    const amount = formData.get("amount");
    const planId = investmentPlan?._id;
    const endDate = investmentPlan?.endDate;

    createInvestment({
      units,
      amount,
      planId,
      endDate,
    });
  };
  return (
    <>
      {/* Title */}
      <h2 className="text-3xl font-semibold text-[#101828] mb-12">
        Payment Summary
      </h2>

      {/* Body */}
      <div className="w-full bg-white border border-[#D0D5DD] px-[26px] py-6 rounded-lg">
        {/* Image Farm Info */}
        <div className="border border-[#F1F5F9] p-2 rounded-xl flex items-center gap-4">
          <Image
            src={
              isValidUrl(investmentPlan?.propertyImages?.[0])
                ? investmentPlan?.propertyImages?.[0]
                : "/assets/images/default_image.jpg"
            }
            alt="img"
            width={100}
            height={100}
            className="object-cover rounded-lg"
          />

          <div className="space-y-[7px]">
            <p className="text-sm text-[#1B1C1E] font-medium">
              {investmentPlan?.name}
            </p>
            {/* <p className="text-[#45556C] text-xs">
              Start Date:{" "}
              {new Date(investmentPlan?.startDate).toLocaleDateString()}
            </p> */}
            <p className="text-[#45556C] text-xs">
              Available Slots: {investmentPlan?.slotsAvailable}
            </p>
            <div className="text-xs flex items-center gap-2">
              <p className="text-[#45556C]">Returns</p>
              <p className="text-primary-1 bg-[#F3F7F5] font-medium p-1 rounded-full">
                {investmentPlan?.roi}%
              </p>
            </div>
          </div>
        </div>

        {/* Pay Form */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          <div className="p-2 w-full text-center bg-green-100 text-green-800 mb-2">
            {investmentPlan?.discount_percent}% Discount on{" "}
            {investmentPlan?.slots_for_discount} or more slots
          </div>

          {/* Slot Number */}

          <div className="flex flex-col">
            <Label htmlFor="slot-number">Number of slot</Label>
            <Input
              type="number"
              id="slot-number"
              name="slot-number"
              placeholder="0"
              value={slotNumber}
              onChange={(e) => {
                let value = parseInt(e.target.value, 10) || 0;

                // Apply min/max slot limits
                if (value < minSlot) value = minSlot;
                if (maxSlot > 0 && value > maxSlot) value = maxSlot;

                setSlotNumber(value);
              }}
            />
            <p className="text-[#45556C] text-xs mt-1.5">
              1 slot ={" "}
              <span className="text-[#0F172B] font-medium">
                {formatMoney(slotPrice)}
              </span>
            </p>
            <p className="text-[#45556C] text-xs mt-1.5">
              Premium Fee ={" "}
              <span className="text-[#0F172B] font-medium">
                {formatMoney(premium_fees)}
              </span>
            </p>
          </div>

          {/* Amount */}
          <div className="flex flex-col">
            <Label htmlFor="amount">Amount</Label>
            <Input
              type="number"
              id="amount"
              name="amount"
              placeholder="$0"
              value={amount}
              readOnly
            />
            <p className="text-[#45556C] text-xs mt-1.5">
              Available Balance{" "}
              <span className="text-[#007D8B] font-medium">
                {formatMoney(profile?.wallet_balance)}
              </span>
            </p>

            {slotNumber >= slotsForDiscount && slotsForDiscount > 0 && (
              <p className="text-green-600 text-xs mt-1.5 font-medium">
                🎉 Discount Applied! You saved {discountPercent}% on your
                purchase.
              </p>
            )}
          </div>

          {errorMessage && (
            <p className="text-red-500 p-2 bg-red-100 border border-red-400 mt-1">
              {errorMessage}
            </p>
          )}

          {/* Payment Button */}
          <Button
            variant="solid"
            type="submit"
            className="w-max"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Pay from Wallet"}
          </Button>
        </form>

        {/* Other Pay Options */}
        {/* <div className="mt-6">
          <h4 className="text-[#101828] font-semibold mb-5">Pay With</h4>

          <ul className="space-y-5">
            <li
              onClick={() => setCurrentStep("bank")}
              className="hover:bg-gray-50 transition-colors duration-300 flex justify-between items-center gap-3 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#F0FDF4] p-2 rounded-lg">
                  <Image
                    src="/assets/icons/bank.png"
                    alt="i"
                    width={24}
                    height={24}
                    className="size-6 aspect-square object-contain"
                  />
                </div>
                <p className="font-medium">Bank Transfer</p>
              </div>

              <IoIosArrowForward className="text-xl" />
            </li>

            <li
              onClick={() => setCurrentStep("debit-credit")}
              className="hover:bg-gray-50 transition-colors duration-300 flex justify-between items-center gap-3 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#F0FDF4] p-2 rounded-lg">
                  <Image
                    src="/assets/icons/debitCredit-card.png"
                    alt="i"
                    width={24}
                    height={24}
                    className="size-6 aspect-square object-contain"
                  />
                </div>
                <p className="font-medium">Debit/credit cards</p>
              </div>

              <IoIosArrowForward className="text-xl" />
            </li>

            <li
              onClick={() => setCurrentStep("crypto")}
              className="hover:bg-gray-50 transition-colors duration-300 flex justify-between items-center gap-3 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#F0FDF4] p-2 rounded-lg">
                  <Image
                    src="/assets/icons/currency-bitcoin-circle.png"
                    alt="i"
                    width={24}
                    height={24}
                    className="size-6 aspect-square object-contain"
                  />
                </div>
                <p className="font-medium">Cryptocurrency</p>
              </div>

              <IoIosArrowForward className="text-xl" />
            </li>
          </ul>
        </div> */}
      </div>
    </>
  );
};

export default PaymentSummary;
