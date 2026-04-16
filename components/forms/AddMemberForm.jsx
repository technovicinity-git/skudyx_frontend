"use client";

import React, { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";

const schema = Yup.object({
  first_name: Yup.string()
    .trim()
    .min(2, "At least 2 characters")
    .max(50)
    .required("First name is required"),
  last_name: Yup.string()
    .trim()
    .min(2, "At least 2 characters")
    .max(50)
    .required("Last name is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .max(128)
    .required("Password is required"),
  level: Yup.number()
    .transform((val, orig) => (orig === "" ? undefined : Number(orig)))
    .oneOf([1, 2, 3], "Select a valid level")
    .required("Level is required"),
});

export default function AddMemberForm({
  initialValues,
  onSubmit,
  submitLabel = "Add member",
  onCancel,
}) {
  const [showPwd, setShowPwd] = useState(false);
  const firstInputRef = useRef(null);

  const defaults = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    level: 1,
    ...(initialValues || {}),
  };

  return (
    <Formik
      initialValues={defaults}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          // Cast level to number (Field returns string from <select>)
          const payload = { ...values, level: Number(values.level) };
          await onSubmit(payload);
          resetForm();
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#344054] mb-1">
                First name
              </label>
              <Field
                name="first_name"
                innerRef={firstInputRef}
                type="text"
                className="w-full rounded-lg border border-[#D0D5DD] px-3 py-2 outline-none focus:ring-2 focus:ring-[#023E8A]"
                placeholder="Afsana"
              />
              <ErrorMessage
                name="first_name"
                component="div"
                className="mt-1 text-xs text-red-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#344054] mb-1">
                Last name
              </label>
              <Field
                name="last_name"
                type="text"
                className="w-full rounded-lg border border-[#D0D5DD] px-3 py-2 outline-none focus:ring-2 focus:ring-[#023E8A]"
                placeholder="Khan"
              />
              <ErrorMessage
                name="last_name"
                component="div"
                className="mt-1 text-xs text-red-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#344054] mb-1">
              Email
            </label>
            <Field
              name="email"
              type="email"
              className="w-full rounded-lg border border-[#D0D5DD] px-3 py-2 outline-none focus:ring-2 focus:ring-[#023E8A]"
              placeholder="afsana.khan@example.com"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="mt-1 text-xs text-red-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#344054] mb-1">
              Password
            </label>
            <div className="relative">
              <Field
                name="password"
                type={showPwd ? "text" : "password"}
                className="w-full rounded-lg border border-[#D0D5DD] px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-[#023E8A]"
                placeholder="secret123"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute inset-y-0 right-0 px-3 text-sm text-[#667085] hover:text-[#101828]"
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
            <ErrorMessage
              name="password"
              component="div"
              className="mt-1 text-xs text-red-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#344054] mb-1">
              Level
            </label>
            <Field
              as="select"
              name="level"
              className="w-full rounded-lg border border-[#D0D5DD] px-3 py-2 outline-none focus:ring-2 focus:ring-[#023E8A]"
            >
              <option value={1}>Level 1</option>
              <option value={2}>Level 2</option>
              <option value={3}>Level 3</option>
            </Field>
            <ErrorMessage
              name="level"
              component="div"
              className="mt-1 text-xs text-red-600"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-[#D0D5DD] px-4 py-2 text-sm text-[#344054] hover:bg-[#F9FAFB]"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#067647] hover:bg-[#055C3A] disabled:opacity-60 text-white font-semibold rounded-lg px-5 py-2 text-sm"
            >
              {isSubmitting ? "Adding..." : submitLabel}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

AddMemberForm.propTypes = {
  initialValues: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    level: PropTypes.oneOf([1, 2, 3]),
  }),
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
  onCancel: PropTypes.func,
};
