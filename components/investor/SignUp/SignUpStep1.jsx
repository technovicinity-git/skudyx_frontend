"use client";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Label from "@/components/common/Label";
import { useSignUp } from "@/hook/auth";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiCalendar } from "react-icons/ci";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./signUpPhoneStyle.css";

const SignUpStep1 = ({ setCurrentStep, setUserEmail, setUserPhone }) => {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState({});

  const searchParams = useSearchParams();
  const { signUp, isLoading, errorMessage } = useSignUp();

  const referralCode = searchParams.get("ref");

  useEffect(() => {
    if (referralCode) {
      setInputCode(referralCode);
    }
  }, [referralCode]);

  // Password validation function
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

  const validateConfirmPassword = (value) => {
    if (value !== password) {
      setConfirmError("Passwords do not match.");
      return false;
    }
    setConfirmError("");
    return true;
  };

  const validateAge = (date) => {
    if (date) {
      // Age validation (must be at least 18 years old)
      const minAllowedDate = new Date();
      minAllowedDate.setFullYear(minAllowedDate.getFullYear() - 18);

      if (date > minAllowedDate) {
        setError({ dateOfBirth: "Age must be more than 18 years." });
        return;
      } else {
        setError({ dateOfBirth: "" });
      }
    }
  };

  const handleDateChange = (date) => {
    setDateOfBirth(date);
    validateAge(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateAge(dateOfBirth);
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(confirmPassword);

    if (!isPasswordValid || !isConfirmValid) return;

    const formData = new FormData(e.target);
    const first_name = formData.get("first-name");
    const last_name = formData.get("last-name");
    const email = formData.get("email");
    const phone_number = phone;

    signUp(
      {
        first_name,
        last_name,
        email,
        phone_number,
        birth_date: dateOfBirth,
        password,
        confirm_password: confirmPassword,
        role: "investor",
        referred_code: inputCode || "",
      },
      {
        onSuccess: () => {
          setCurrentStep("check-email");
          setUserEmail(email);
          setUserPhone(phone_number);
        },
        onError: (error) => {
          console.error("Sign up failed", error);
        },
      }
    );
  };

  return (
    <>
      {/* Form Heading */}
      <div className="w-full mb-6">
        <h2 className="text-center text-black text-2xl font-semibold mb-2">
          Tell us about yourself
        </h2>
        <p className="text-center text-[#314158]">
          Enter your details to create an account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="flex flex-col">
            <Label htmlFor="first-name">First Name</Label>
            <Input
              type="text"
              id="first-name"
              name="first-name"
              placeholder="Your First Name"
              required
            />
          </div>
          {/* Last Name */}
          <div className="flex flex-col">
            <Label htmlFor="last-name">Last Name</Label>
            <Input
              type="text"
              id="last-name"
              name="last-name"
              placeholder="Your Last Name"
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
            placeholder="Enter email address"
            required
          />
        </div>

        {/* Phone */}
        <div className="phone-number flex flex-col">
          <Label>Phone Number</Label>
          <PhoneInput
            id="phone"
            name="phone"
            country={"ng"}
            enableSearch={true}
            placeholder="Enter phone number"
            required
            onChange={(phone) => setPhone(phone)}
            inputProps={{ required: true }}
          />
        </div>

        <div>
          <div className="flex flex-col relative">
            <Label htmlFor="endDate">Date of Birth</Label>
            <DatePicker
              selected={dateOfBirth}
              onChange={(date) => {
                handleDateChange(date);
                validateAge(date);
              }}
              id="birth_date"
              placeholderText="Select date"
              className="text-base bg-white w-full px-3.5 py-3 border border-[#D0D5DD] rounded-lg"
              required
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
              showMonthDropdown
              dropdownMode="select"
              maxDate={new Date()}
              dateFormat="dd/MM/yyyy"
            />
            <CiCalendar className="size-6 absolute right-3.5 bottom-3 pointer-events-none" />
          </div>
          {error.dateOfBirth && (
            <p className="text-red-500 text-sm">{error.dateOfBirth}</p>
          )}
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

        {/* re-password */}
        <div className="flex flex-col relative">
          <Label htmlFor="re-password">Re-enter Password</Label>
          <Input
            type={showPassword2 ? "text" : "password"}
            id="re-password"
            name="re-password"
            placeholder="Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              validateConfirmPassword(e.target.value);
            }}
            required
            className={confirmError ? "border-red-500" : ""}
          />
          <button
            type="button"
            onClick={() => setShowPassword2(!showPassword2)}
            className="text-lg px-1 py-0.5 absolute right-2 bottom-3.5 cursor-pointer"
          >
            {showPassword2 ? <FaRegEye /> : <FaRegEyeSlash />}
          </button>
        </div>

        <div className="flex flex-col">
          <Label htmlFor="referred_code">Referral Code (optional)</Label>
          <Input
            type="text"
            id="referred_code"
            name="referred_code"
            value={inputCode}
            placeholder="Enter your referral code"
            onChange={(e) => setInputCode(e.target.value)}
          />
        </div>

        {confirmError && (
          <p className="text-xs text-red-500 mt-1">{confirmError}</p>
        )}

        {/* Terms */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            required
            className="size-5 accent-primary-1 appearance-none border border-[#D0D5DD] rounded-md relative cursor-pointer checked:border-primary-1 checked:bg-primary-0 focus:outline-none after:absolute after:top-0.5 after:left-1.5 after:border-b-2 after:border-r-2 after:border-white  after:h-3 after:w-1.5 after:rotate-45"
          />
          <label htmlFor="terms">
            I agree to{" "}
            <span
              className="text-green-800 cursor-pointer"
              onClick={() => {
                window.open("/terms-and-conditions", "_blank");
              }}
            >
              terms and conditions
            </span>
          </label>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-500 p-2 bg-red-100 border border-red-400 text-sm mt-2">
            {errorMessage}
          </p>
        )}

        {/* Submit Button */}
        <Button variant="solid" type="submit" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </>
  );
};

export default SignUpStep1;
