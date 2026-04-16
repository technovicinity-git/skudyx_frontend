"use client";

import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";
import Link from "next/link";
// import { useLanguage } from "./language-context";

// Context for dropdown state
const DropdownContext = createContext(null);

export function Dropdown({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleOpen = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const contextValue = { isOpen, toggleOpen, close };

  return (
    <DropdownContext.Provider value={contextValue}>
      <div ref={dropdownRef} className="relative">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownTrigger({
  children,
  className = "",
  isSticky = false,
  ...props
}) {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("DropdownTrigger must be used within a Dropdown");
  }
  const { toggleOpen } = context;

  // Color: white when not sticky, secondary when sticky
  const triggerColor = isSticky ? "text-secondary" : "text-white";

  return (
    <button
      type="button"
      onClick={toggleOpen}
      className={`flex items-center gap-1 lg:gap-2 font-instrument-sans text-lg font-medium cursor-pointer ${triggerColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownContent({
  children,
  className = "",
  isSticky = false,
  ...props
}) {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("DropdownContent must be used within a Dropdown");
  }
  const { isOpen, close } = context;

  // Glassy bg and white text when not sticky, solid white and secondary text when sticky
  const bgClass = isSticky
    ? "bg-white text-secondary"
    : "bg-white/30 backdrop-blur-md border border-white/30 shadow-lg text-white";

  return (
    <div
      className={`absolute top-full left-0 rtl:right-0 rtl:left-auto z-10 mt-2 py-6 w-56 rounded-lg focus:outline-none transition-all duration-300 ease-in-out ${bgClass} ${
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      } ${className}`}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabIndex="-1"
      style={{ willChange: "transform, opacity" }}
      {...props}
    >
      <div className="space-y-6 text-left rtl:text-right" role="none">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === DropdownMenuItem) {
            // Pass isSticky to DropdownMenuItem
            return React.cloneElement(child, { onClick: close, isSticky });
          }
          return child;
        })}
      </div>
    </div>
  );
}

export function DropdownMenuItem({
  children,
  href,
  onClick,
  className = "",
  isSticky = false,
  ...props
}) {
  const baseClasses =
    (isSticky
      ? "text-secondary hover:text-primary-1"
      : "text-white hover:text-white/80") +
    " block text-lg w-full text-left rtl:text-right pl-4 rtl:pl-0 rtl:pr-4 transition-colors duration-200";

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} ${className}`}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={`${baseClasses} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
