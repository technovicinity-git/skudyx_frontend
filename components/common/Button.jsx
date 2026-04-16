"use client";

import Link from "next/link";

export default function Button({
  children,
  className = "",
  variant = "default", // 'default', 'outline'
  size = "default", // 'default', 'sm', 'lg'
  href, // If provided, renders a Link
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-3 lg:px-[18px] py-2 lg:py-2 cursor-pointer transition";
  const variantClasses = {
    solid:
      "bg-[#061640] border border-[#061640] text-white hover:bg-[#0A1F5C] hover:border-[#0A1F5C]",
    outline:
      "bg-[#FAFAFA] border border-gray-300 text-[#475467] shadow-sm hover:bg-gray-100 ",
    danger:
      "bg-red-600 border border-red-600 text-white hover:bg-red-500 hover:border-red-500",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
