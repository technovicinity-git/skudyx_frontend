"use client";
import Image from "next/image";
import { useState } from "react";

export default function ProfileAvatar({
  src,
  alt = "Profile picture",
  size = 20,
  hover = false,
  className = "",
}) {
  const [imageError, setImageError] = useState(false);

  const showFallback = !src || imageError;

  return (
    <div
      className={`
        relative flex items-center justify-center overflow-hidden rounded-full
        transition-all duration-200 ease-out
        ${
          hover
            ? `
          ring-2 ring-transparent ring-offset-1 ring-offset-background
          hover:ring-accent/40
          hover:shadow-[0_0_8px_hsl(var(--accent)/0.25)]
          hover:scale-110
          active:scale-100
        `
            : ""
        }
        ${className}
      `}
      style={{ width: size, height: size }}
    >
      {/* {showFallback ? (
        <div className="w-full h-full flex items-center justify-center transition-opacity duration-200 hover:opacity-80">
          {UserIcon}
        </div>
      ) : ( */}
      <Image
        src={src || "/assets/images/default-user.png"}
        alt={alt}
        fill
        // sizes={`${size}px`}
        className="object-cover"
        onError={() => setImageError(true)}
      />
      {/* )} */}
    </div>
  );
}
