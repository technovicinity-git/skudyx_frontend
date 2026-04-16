"use client";
import { useEffect, useState } from "react";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import Input from "@/components/common/Input";
import Label from "@/components/common/Label";
import "@/components/common/phoneInputStyle.css";
import useCreateFarmerStore from "@/store/useCreateFarmerStore";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Button from "../../../common/Button";

const RegistrationStep1 = ({ setCurrentStep }) => {
  const [password, setPassword] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const { formData, updateField } = useCreateFarmerStore();

  useEffect(() => {
    if (formData.password) {
      setPassword(formData.password);
    }
  }, [formData.password]);

  const validatePassword = (value) => {
    const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!regex.test(value)) {
      setPasswordError(
        "Password must be at least 8 characters and include 1 special character."
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  return (
    <div className="w-full">
      <div className="text-[#101828] w-full mb-6 grid grid-cols-[auto_auto] gap-4">
        <h2 className="text-left text-[22px] font-semibold">
          Register As A Farmer
        </h2>
        <p className="text-right font-semibold">1/3</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* First name & Last name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First name */}
          <div className="flex flex-col">
            <Label htmlFor="first-name">First Name</Label>
            <Input
              type="text"
              id="first-name"
              name="first_name"
              value={formData.first_name}
              onChange={(e) => updateField("first_name", e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>
          {/* Last name */}
          <div className="flex flex-col">
            <Label htmlFor="last-name">Last Name</Label>
            <Input
              type="text"
              id="last-name"
              name="last_name"
              value={formData.last_name}
              onChange={(e) => updateField("last_name", e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <Label htmlFor="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="example@gmail.com"
            required
          />
        </div>

        {/* password */}
        <div className="flex flex-col relative">
          <Label htmlFor="password">Enter Password</Label>
          <Input
            type={showPassword1 ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
              updateField("password", e.target.value);
            }}
            required
            className={passwordError ? "border-red-500" : ""}
          />
          <button
            type="button"
            onClick={() => setShowPassword1(!showPassword1)}
            className="text-lg px-1 py-0.5 absolute right-2 bottom-3.5 cursor-pointer"
          >
            {showPassword1 ? <FaRegEye /> : <FaRegEyeSlash />}
          </button>
        </div>
        {passwordError && (
          <p className="text-xs text-red-500 mt-1">{passwordError}</p>
        )}

        {/* Phone */}
        <div className="phone-number flex flex-col">
          <Label>Phone Number</Label>
          <div className="flex items-center gap-4">
            <PhoneInput
              id="phone"
              name="phone_number"
              country={"bd"}
              enableSearch={true}
              value={formData.phone_number}
              placeholder="Enter phone number"
              onChange={(phone) => updateField("phone_number", phone)}
              required
            />
          </div>
        </div>

        {/* Continue Button */}
        <Button variant="solid" type="submit">
          Continue
        </Button>
      </form>
    </div>
  );
};

export default RegistrationStep1;
