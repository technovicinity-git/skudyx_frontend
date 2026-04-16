"use client";

import React, { useState } from "react";
import Button from "../../common/Button";
import Link from "next/link";
import { LeftArrowIcon } from "@/public/assets/icons/icons";
import { useCreateCorporateInvestor } from "@/hook/corporateInvestor";
import { useToast } from "@/lib/Provider/toastProvider";

/**
 * Usage Example:
 *
 * <InvestmentRequestForm
 *   title="Corporate Investment Request"
 *   fields={[...fieldsArray]}
 *   submitText="Submit Request"
 *   thankYou={{
 *     title: "Thank you for your request!",
 *     message: "Our team at Green Wealth has received your submission. A representative will contact you shortly to discuss your needs in more detail.",
 *     button: "Okay, Go it"
 *   }}
 *   backHref="/corporate-investment"
 *   onSubmit={yourSubmitHandler}
 * />
 *
 * <InvestmentRequestForm
 *   title="Farmer Request"
 *   fields={[...farmerFieldsArray]}
 *   submitText="Send Request"
 *   thankYou={{
 *     title: "Thank you for your request!",
 *     message: "Our team will contact you soon.",
 *     button: "Okay, Go it"
 *   }}
 *   backHref="/farmer-request"
 *   onSubmit={yourSubmitHandler}
 * />
 */

function getInitialFormState(fields) {
  const acc = {};
  fields.forEach((field) => {
    if (field.type === "group") {
      field.fields.forEach((sub) => {
        acc[sub.name] = "";
      });
    } else {
      acc[field.name] = "";
    }
  });
  return acc;
}

const InvestmentRequestForm = ({
  title = "Request Form",
  fields = [],
  submitText = "Submit",
  thankYou = {
    title: "Thank you!",
    message: "Your submission has been received.",
    button: "Okay, Go it",
  },
  backHref = "/",
  onSubmit,
}) => {
  const [form, setForm] = useState(getInitialFormState(fields));
  const [showThankYou, setShowThankYou] = useState(false);
  const { showToast } = useToast();

  const { createCorporateInvestor, isLoading, errorMessage } =
    useCreateCorporateInvestor();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      company_name: form.company,
      contact_name: form.contact,
      business_email: form.email,
      business_phone: form.phone,
      request_details: form.details,
    };
    createCorporateInvestor(data, {
      onSuccess: () => {
        setShowThankYou(true);
        showToast(
          "Investment request submitted successfully!",
          "success",
          "Success"
        );
      },
    });
  };

  const handleCloseThankYou = () => {
    setShowThankYou(false);
    setForm(getInitialFormState(fields));
  };

  return (
    <section className="pt-36 pb-24">
      <div className="container !max-w-[1230px]">
        <div className="mb-8 flex items-center gap-2">
          <Link href={backHref} className="flex items-center gap-2 group">
            <span>{LeftArrowIcon}</span>
            <span className="text-base text-[#19202C] group-hover:underline">
              Back
            </span>
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="max-w-[890px] mx-auto">
          <h2 className="text-3xl font-semibold mb-8">{title}</h2>
          <div className="border-t border-gray-200">
            {fields.map((field, idx) => (
              <React.Fragment key={field.name || idx}>
                {field.type === "group" ? (
                  <div className="flex flex-col md:flex-row items-start py-6 gap-0 md:gap-8 pr-16">
                    <label
                      className="block text-gray-700 mb-2 md:w-1/3"
                      htmlFor={field.name}
                    >
                      {field.label}
                    </label>
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-2/3 ml-auto flex-wrap justify-between">
                      {field.fields.map((sub, subIdx) => (
                        <div
                          key={sub.name}
                          className={sub.className || "flex-1"}
                        >
                          {sub.type === "select" ? (
                            <select
                              id={sub.name}
                              name={sub.name}
                              value={form[sub.name]}
                              onChange={handleChange}
                              className="w-full border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary-1"
                              required={sub.required}
                            >
                              <option value="" disabled>
                                {sub.placeholder}
                              </option>
                              {sub.options &&
                                sub.options.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                            </select>
                          ) : (
                            <input
                              id={sub.name}
                              name={sub.name}
                              type={sub.type}
                              value={form[sub.name]}
                              onChange={handleChange}
                              placeholder={sub.placeholder}
                              className="w-full border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary-1"
                              required={sub.required}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`flex flex-col md:flex-row items-start py-6 gap-0 md:gap-8 pr-16`}
                  >
                    <label
                      className="block text-gray-700 mb-2 md:mb-0 md:w-1/3"
                      htmlFor={field.name}
                    >
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full md:w-2/3 border border-gray-200 rounded-md px-4 py-3 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-primary-1"
                        required={field.required}
                      />
                    ) : field.type === "select" ? (
                      <select
                        id={field.name}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        className="w-full md:w-2/3 border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary-1"
                        required={field.required}
                      >
                        <option value="" disabled>
                          {field.placeholder}
                        </option>
                        {field.options &&
                          field.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                      </select>
                    ) : (
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={form[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full md:w-2/3 border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary-1"
                        required={field.required}
                      />
                    )}
                  </div>
                )}
                <hr className="border-gray-200" />
              </React.Fragment>
            ))}
          </div>
          {errorMessage && (
            <div className="mt-4 p-2 bg-red-200 border border-red-500 text-red-600">
              {errorMessage}
            </div>
          )}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => setForm(getInitialFormState(fields))}
            >
              Cancel
            </Button>
            <Button type="submit" variant="solid" disabled={isLoading}>
              {isLoading ? "Submitting..." : submitText}
            </Button>
          </div>
        </form>
        {showThankYou && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full flex flex-col items-center text-center">
              <span className="mb-4">
                {/* Party icon SVG */}
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 56 56"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <path
                      d="M28 4v6"
                      stroke="#236647"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M44.5 11.5l-4.25 4.25"
                      stroke="#236647"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M52 28h-6"
                      stroke="#236647"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M44.5 44.5l-4.25-4.25"
                      stroke="#236647"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M28 52v-6"
                      stroke="#236647"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M11.5 44.5l4.25-4.25"
                      stroke="#236647"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4 28h6"
                      stroke="#236647"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M11.5 11.5l4.25 4.25"
                      stroke="#236647"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M28 14a14 14 0 1 1 0 28 14 14 0 0 1 0-28z"
                      fill="#A0D6B4"
                    />
                    <path
                      d="M28 18a10 10 0 1 1 0 20 10 10 0 0 1 0-20z"
                      fill="#fff"
                    />
                    <path
                      d="M28 22a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"
                      fill="#236647"
                    />
                  </g>
                </svg>
              </span>
              <h3 className="text-2xl font-semibold mb-2">{thankYou.title}</h3>
              <p className="text-[#475467] mb-6">{thankYou.message}</p>
              <Button
                variant="solid"
                className="w-full"
                onClick={handleCloseThankYou}
              >
                {thankYou.button}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default InvestmentRequestForm;
