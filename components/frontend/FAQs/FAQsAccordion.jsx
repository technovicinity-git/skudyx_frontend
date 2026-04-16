"use client";
import { PlusIcon } from "@/public/assets/icons/icons";
import React, { useState } from "react";
import { useIntersectionObserver } from "../language-context";
// import { FiPlus, FiX } from "react-icons/fi";

const faqs = [
  {
    question: "On-time delivery rate",
    answer:
      "We offer a full range of solutions to support sustainable and tech-driven agriculture — including precision farming, sustainable irrigation systems, organic certification assistance, supply chain support, agri-tech consulting, and climate-resilient programs.",
  },
  {
    question: "Countries reached",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    question: "Countries reached",
    answer:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    question: "Countries reached",
    answer:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    question: "Countries reached",
    answer:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    question: "Countries reached",
    answer:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    question: "Countries reached",
    answer:
      "Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.",
  },
  {
    question: "Countries reached",
    answer:
      "Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.",
  },
];

const FAQsAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { isVisible, elementRef } = useIntersectionObserver();

  return (
    <section ref={elementRef} className="relative w-full bg-[#fafafa] py-16 md:py-20 lg:py-24">
      <div className="container">
        {(() => {
          const mid = Math.ceil(faqs.length / 2);
          const leftFaqs = faqs.slice(0, mid);
          const rightFaqs = faqs.slice(mid);
          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
              {[leftFaqs, rightFaqs].map((columnFaqs, colIdx) => (
                <div
                  key={colIdx}
                  className="space-y-4 md:space-y-5 lg:space-y-6"
                >
                  {columnFaqs.map((faq, idx) => {
                    // Calculate the global index for open/close logic
                    const globalIdx = colIdx === 0 ? idx : idx + mid;
                    const isOpen = openIndex === globalIdx;
                    return (
                      <div
                        key={globalIdx}
                        className={`break-inside-avoid transition-all duration-1000 ease-out delay-${globalIdx * 200} rounded-[10px] cursor-pointer ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${isOpen
                          ? "bg-[#121C30] text-white py-2 relative"
                          : "bg-white text-black "
                          }`}
                        style={{ minHeight: isOpen ? 0 : "auto" }}
                      >
                        <div
                          className="flex items-center justify-between select-none p-4 md:p-6"
                          onClick={() => {
                            setOpenIndex(isOpen ? null : globalIdx);
                          }}
                        >
                          <span className="text-lg md:text-xl font-medium ">
                            {faq.question}
                          </span>
                          {/* {isOpen ? ( */}
                          <button
                            className="p-0 pointer-events-none"
                          // onClick={(e) => {
                          //   e.stopPropagation();
                          //   setOpenIndex(null);
                          // }}
                          // aria-label="Close"
                          >
                            <span
                              className={`inline-block transition duration-300 ${isOpen
                                ? "rotate-45 text-white"
                                : "rotate-0 text-black"
                                }`}
                            >
                              {PlusIcon}
                            </span>
                          </button>
                          {/* ) : (
                            <span
                              className={`text-2xl inline-block transition-transform transition-colors duration-300 ${
                                isOpen
                                  ? "rotate-45 text-white"
                                  : "rotate-0 text-black"
                              }`}
                            >
                              {PlusIcon}
                            </span>
                          )} */}
                        </div>
                        <div
                          className={`overflow-hidden transition-all duration-300  ${isOpen
                            ? "max-h-96 opacity-100 px-6 pb-6"
                            : "max-h-0 opacity-0"
                            }`}
                        >
                          <p className="text-sm sm:text-base leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </section>
  );
};

export default FAQsAccordion;
