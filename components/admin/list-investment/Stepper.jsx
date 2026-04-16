const steps = [
  { stepNum: 1, title: "Overview", subtitle: "Enter overview details" },
  { stepNum: 2, title: "Invest details", subtitle: "Enter investment details" },
  {
    stepNum: 3,
    title: "Add Cycles",
    subtitle: "Enter cycle details",
  },
  {
    stepNum: 4,
    title: "Add documents",
    subtitle: "Upload Investment documents",
  },
];

export default function Stepper({ currentStep = 1 }) {
  return (
    <aside className="px-10 py-16 hidden lg:block">
      <ul className="flex flex-col gap-1">
        {steps.map((step) => {
          const { stepNum, title, subtitle } = step;

          return (
            <li
              key={stepNum}
              className={`flex gap-4 ${
                currentStep >= stepNum ? "text-primary-1" : "text-[#828282]"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`font-semibold size-8 box-border rounded-full border-[1.5px] flex justify-center items-center ${
                    currentStep > stepNum
                      ? "text-white border-primary-1 bg-primary-1"
                      : currentStep === stepNum
                      ? "text-primary-1 border-primary-1"
                      : "border-[#EAECF0]"
                  }`}
                >
                  {stepNum}
                </div>
                <div
                  className={`w-0.5 h-[46px] rounded-full ${
                    steps.length === stepNum && "hidden"
                  } ${
                    currentStep >= stepNum ? "bg-primary-1" : "bg-[#EAECF0]"
                  }`}
                ></div>
              </div>
              <div>
                <p className="font-semibold">{title}</p>
                <p>{subtitle}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
