"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  closeOnBackdrop = true,
  size = "lg",
  initialFocusRef,
  className = "",
}) {
  const dialogRef = useRef(null);
  const titleIdRef = useRef(
    `modal-title-${Math.random().toString(36).slice(2)}`
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      const el = initialFocusRef?.current ?? dialogRef.current;
      el?.focus?.();
    }
  }, [open, initialFocusRef]);

  if (!open) return null;

  const handleBackdrop = (e) => {
    if (!closeOnBackdrop) return;
    if (e.target === e.currentTarget) onClose?.();
  };

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleIdRef.current : undefined}
      onMouseDown={handleBackdrop}
      className="fixed inset-0 z-[1000] bg-black/40 flex items-center justify-center p-4"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`w-full ${
          sizeMap[size] || sizeMap.lg
        } rounded-2xl bg-white shadow-xl border border-[#EAECF0] focus:outline-none ${className}`}
      >
        <div className="px-6 py-4 border-b border-[#EAECF0] flex items-center justify-between">
          <h3
            id={titleIdRef.current}
            className="text-lg font-semibold text-[#101828]"
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-[#667085] hover:text-[#101828]"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer && (
          <div className="px-6 py-4 border-t border-[#EAECF0]">{footer}</div>
        )}
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(content, document.body)
    : content;
}

/* ---- SSR-safe PropTypes ----
   Element is undefined on the server, so avoid instanceOf(Element)
*/
Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node,
  footer: PropTypes.node,
  closeOnBackdrop: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  // Use any, or conditionally gate instanceOf if you really want to:
  // initialFocusRef: typeof Element !== "undefined"
  //   ? PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  //   : PropTypes.shape({ current: PropTypes.any }),
  initialFocusRef: PropTypes.shape({ current: PropTypes.any }),
  className: PropTypes.string,
};
