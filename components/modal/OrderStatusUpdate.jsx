import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

import { updateOrderStatus } from "@/hook/order";
import { useToast } from "@/lib/Provider/toastProvider";
import OrderStatus from "../common/status/OrderStatus";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Cancelled",
  "Failed",
];

export default function UpdateOrderStatus({ id, currentStatus, queryClient }) {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(currentStatus);

  const ref = useRef(null);

  const { showToast } = useToast();

  const { updateStatus, isLoading: isUpdating } = updateOrderStatus();

  useEffect(() => {
    setCurrent(currentStatus);
  }, [currentStatus]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  const handleStatusUpdate = (newStatus) => {
    if (newStatus === current) return;

    setCurrent(newStatus);

    updateStatus(
      { id, status: newStatus },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["order", id]);

          showToast("Order status updated successfully.", "success", "Updated");

          setTimeout(() => {
            setIsOpen(false);
          }, 180);
        },

        onError: () => {
          setCurrent(currentStatus);

          showToast("Failed to update order status.", "error", "Error");
        },
      },
    );
  };

  return (
    <div ref={ref} className="relative inline-block">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="
          flex items-center gap-2
          px-3 py-1.5
          rounded-lg
          border border-gray-200
          bg-white
          hover:border-gray-300
          transition-all
        "
      >
        <OrderStatus status={current} />

        <ChevronDown
          size={13}
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="
            absolute right-0 top-[calc(100%+8px)]
            w-56
            bg-white
            border border-gray-200
            rounded-xl
            overflow-hidden
            z-50
            shadow-sm
          "
        >
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-[11px] text-gray-400">Update order status</p>
          </div>

          <div className="p-1.5 flex flex-col gap-0.5">
            {ORDER_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusUpdate(status)}
                disabled={isUpdating}
                className="
                  flex items-center justify-between
                  w-full
                  px-2.5 py-2
                  rounded-lg
                  text-left
                  transition-colors
                  hover:bg-gray-50
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                <OrderStatus status={status} />

                {/* Radio */}
                <span
                  className={`
                    w-3.5 h-3.5
                    rounded-full
                    border
                    flex items-center justify-center
                    flex-shrink-0
                    ${current === status ? "border-red-900" : "border-blue-950"}
                  `}
                >
                  {current === status && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-950" />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
