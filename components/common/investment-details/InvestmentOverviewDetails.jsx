import { formatMoney } from "@/utils/formatMoney";

const InvestmentOverviewDetails = ({
  investment,
  investmentId,
  role = "admin",
}) => {
  const handleViewPayouts = () => {
    // Handle view payouts logic
    console.log("Viewing payouts for investment:", investmentId);
  };

  return (
    <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Investment overview
      </h3>

      <div className="space-y-4">
        {role === "admin" && (
          <div className="flex justify-between items-center pb-4 border-b border-b-gray-200">
            <span className="text-gray-600">Total Amount Invested</span>
            <span className="font-semibold text-gray-900">
              {formatMoney(investment?.amountInvested)}
            </span>
          </div>
        )}
        {role === "admin" && (
          <div className="flex justify-between items-center pb-4 border-b border-b-gray-200">
            <span className="text-gray-600">Unit Price</span>
            <span className="font-semibold text-gray-900">
              {formatMoney(investment?.unitPrice)}
            </span>
          </div>
        )}
        {role === "admin" && (
          <div className="flex justify-between items-center pb-4 border-b border-b-gray-200">
            <span className="text-gray-600">ROI</span>
            <span className="font-semibold text-gray-900">
              {investment.roi}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center pb-4 border-b border-b-gray-200">
          <span className="text-gray-600">Duration</span>
          <span className="font-semibold text-gray-900">
            {investment.duration}{" "}
            {investment?.duration_type === "monthly" ? "Months" : "Years"}
          </span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-b-gray-200">
          <span className="text-gray-600">Start Date</span>
          <span className="font-semibold text-gray-900">
            {investment.startDate}
          </span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-b-gray-200">
          <span className="text-gray-600">Maturity Date</span>
          <span className="font-semibold text-gray-900">
            {investment.maturityDate}
          </span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-b-gray-200">
          <span className="text-gray-600">Invest End Date</span>
          <span className="font-semibold text-gray-900">
            {investment.investEndDate}
          </span>
        </div>
        {role === "investor" && (
          <div className="flex justify-between items-center pb-4 border-b border-b-gray-200">
            <span className="text-gray-600">Amount Invested</span>
            <span className="font-semibold text-gray-900">
              {formatMoney(investment.amountInvested)}
            </span>
          </div>
        )}
        {/* {role === "investor" && (
                  <div className="flex justify-between items-center pb-4 border-b border-b-gray-200">
                    <span className="text-gray-600">Expected returns</span>
                    <span className="font-semibold text-gray-900">
                      {investment.expectedReturns}
                    </span>
                  </div>
                )} */}
        {role === "admin" && (
          <div className="flex justify-between items-center pb-4 border-b border-b-gray-200">
            <span className="text-gray-600">Total Investors</span>
            <span className="font-semibold text-gray-900">
              {investment.totalInvestors}
            </span>
          </div>
        )}
        {role === "admin" && (
          <div className="flex justify-between items-center pb-4 border-b border-b-gray-200">
            <span className="text-gray-600">Total Slots</span>
            <span className="font-semibold text-gray-900">
              {investment.number_of_slots}
            </span>
          </div>
        )}
        {role === "admin" && (
          <div className="flex justify-between items-center pb-4 border-b border-b-gray-200">
            <span className="text-gray-600">Invested Slots</span>
            <span className="font-semibold text-gray-900">
              {investment.invested_slots}
            </span>
          </div>
        )}
        {role === "admin" && (
          <div className="flex justify-between items-center pb-4 border-b border-b-gray-200">
            <span className="text-gray-600">Max Slots</span>
            <span className="font-semibold text-gray-900">
              {investment.max_slot}
            </span>
          </div>
        )}
        {role === "admin" && (
          <div className="flex justify-between items-center pb-4 border-b border-b-gray-200">
            <span className="text-gray-600">Min Slots</span>
            <span className="font-semibold text-gray-900">
              {investment.min_slot}
            </span>
          </div>
        )}
        {role === "admin" && (
          <div className="flex justify-between items-center pb-4 border-b border-b-gray-200">
            <span className="text-gray-600">Type</span>
            <span className="font-semibold text-gray-900">
              {investment.type}
            </span>
          </div>
        )}
        {role === "admin" && (
          <div className="flex justify-between items-center pb-4 border-b border-b-gray-200">
            <span className="text-gray-600">Discount</span>
            <span className="font-semibold text-gray-900">
              {investment.discount_percent}%
            </span>
          </div>
        )}
        {role === "admin" && (
          <div className="flex justify-between items-center pb-4 border-b border-b-gray-200">
            <span className="text-gray-600">Discounted slots</span>
            <span className="font-semibold text-gray-900">
              {investment.slots_for_discount}
            </span>
          </div>
        )}
        {role === "admin" && (
          <div className="flex justify-between items-center pb-4 border-b border-b-gray-200">
            <span className="text-gray-600">Total Slots</span>
            <span className="font-semibold text-gray-900">
              {investment.number_of_slots}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center pb-4 border-b border-b-gray-200">
          <span className="text-gray-600">Status</span>
          <span
            className={`font-semibold text-gray-900 ${
              investment.status === "open" ? "bg-green-200" : "bg-red-200"
            } py-1 px-2 rounded-full`}
          >
            {investment.status}
          </span>
        </div>
      </div>

      {/* {role === "admin" && (
        <Button
          variant="outline"
          className="w-full mt-6 text-gray-600"
          onClick={handleViewPayouts}
        >
          View Payouts
        </Button>
      )} */}
    </div>
  );
};

export default InvestmentOverviewDetails;
