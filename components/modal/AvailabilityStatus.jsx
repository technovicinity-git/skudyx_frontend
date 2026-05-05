import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useUpdateAgentAvailability } from "@/hook/user";
import { useToast } from "@/lib/Provider/toastProvider";

const STATUS_CONFIG = {
  Available: { color: "#22c55e" },
  Unavailable: { color: "#F5D0FE" },
  Away: { color: "#f59e0b" },
};

export default function AvailabilityStatus({
  account_status,
  availability_status,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(availability_status);
  const ref = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    setCurrent(availability_status);
  }, [availability_status]);

  const { updateAgentAvailability, isLoading, errorMessage } =
    useUpdateAgentAvailability();

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleSelect = async (status) => {
    if (status === current || !isActive) return;
    setCurrent(status);
    updateAgentAvailability(
      { status },
      {
        onSuccess: () => {
          showToast(
            "Availability status updated successfully!",
            "success",
            "Success",
          );
        },
        onError: () => {
          showToast(errorMessage, "error", "Error");
        },
      },
    );
    setTimeout(() => setIsOpen(false), 180);
  };

  const isActive = account_status === "Active";

  return (
    <div ref={ref} className="relative inline-block">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg
          border border-gray-200 bg-white hover:border-gray-300 transition-all"
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: STATUS_CONFIG[current]?.color ?? "#215fbb" }}
        />
        {current}
        <ChevronDown
          size={13}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Sticky Dropdown Modal */}
      {isOpen && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white border border-gray-200
          rounded-xl overflow-hidden z-50 shadow-sm"
        >
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-[11px] text-gray-400">Set your availability</p>
          </div>

          <div className="p-1.5 flex flex-col gap-0.5">
            {Object.entries(STATUS_CONFIG).map(([status, { color }]) => (
              <button
                key={status}
                onClick={() => handleSelect(status)}
                disabled={!isActive || isLoading}
                className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-left
                  transition-colors text-sm text-gray-800
                  ${!isActive ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}
                `}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: color ?? "#215fbb" }}
                />
                <span className="flex-1">{status}</span>

                {/* Radio */}
                <span
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 border"
                  style={{
                    borderColor: current === status ? color : "#d1d5db",
                  }}
                >
                  {current === status && (
                    <span
                      className="w-1.5 h-1.5 rounded-full block"
                      style={{ background: color }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>

          {!isActive && (
            <div className="px-3 py-2 border-t border-gray-100 text-[11px] text-amber-500">
              Account inactive — changes disabled
            </div>
          )}
        </div>
      )}
    </div>
  );
}
