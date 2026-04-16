import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const DropdownMenu = ({ item, currentPath, open, onToggle }) => {
  const submenuRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    if (open && submenuRef.current) {
      setMaxHeight(submenuRef.current.scrollHeight);
    } else {
      setMaxHeight(0);
    }
  }, [open]);

  const isActiveParent = item.children.some((child) =>
    currentPath.startsWith(child.href),
  );

  return (
    <div>
      {/* Parent Button */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`flex items-center gap-3 px-3 py-2 rounded-md w-full text-left
          transition-colors duration-200 relative font-medium
          text-[#8A8A8A]
          ${isActiveParent || open ? "bg-[#406DA41A] text-black" : ""}
          hover:bg-[#406DA41A] hover:text-black
        `}
      >
        <span className="w-6 h-6">{item.icon}</span>
        <span>{item.label}</span>

        <ChevronDown
          className={`h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 
            transition-transform duration-200
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Submenu */}
      <ul
        ref={submenuRef}
        className={`pl-9 space-y-2 ${open ? "mt-2" : ""}`}
        style={{
          maxHeight: `${maxHeight}px`,
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {item.children.map((child) => {
          const isActive = currentPath.startsWith(child.href);

          return (
            <li key={child.label}>
              <Link
                href={child.href}
                className={`block px-3 py-2 rounded-md font-medium
                  transition-colors duration-200
                  text-[#8A8A8A]
                  ${
                    isActive
                      ? "bg-[#406DA41A] text-black"
                      : "hover:bg-[#406DA41A] hover:text-black"
                  }
                `}
              >
                {child.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DropdownMenu;
