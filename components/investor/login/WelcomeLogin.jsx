/* eslint-disable no-undef */
"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Label from "@/components/common/Label";
import { useLogin } from "@/hook/auth";
import { useToast } from "@/lib/Provider/toastProvider";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const WelcomeLogin = ({ setCurrentStep, setUserEmail }) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error } = useLogin({
    onSuccess: (data) => {
      showToast("Login successful", "success", "Success");
      Cookies.set("accessToken", data.data.data.accessToken, {
        path: "/",
        maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE || 86400,
      });
      Cookies.set("refreshToken", data.data.data.refreshToken, {
        path: "/",
        maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE || 86400,
      });
      Cookies.set("userRole", data.data.data.userData.role, {
        path: "/",
        maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE || 86400,
      });

      if (data.data.data.userData.two_factor_authentication) {
        setUserEmail(data.data.data.userData.email);
        setCurrentStep("multifactor-verify");
      } else if (!data.data.data.userData.email_verified) {
        router.push("/investor/signup?p=check-email");
      } else if (!data.data.data.userData.phone_verified) {
        router.push("/investor/signup?p=verify-phone");
      } else {
        router.push("/investor");
      }
    },
    onError: (error) => {
      console.error("Login failed", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    login({ email, password });
  };

  return (
    <>
      {/* Form Heading */}
      <div className="w-full mb-6">
        <h2 className="text-center text-black text-2xl font-semibold mb-2">
          Welcome back
        </h2>
        <p className="text-center text-[#314158]">
          Enter your details to Login
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Email */}
        <div className="flex flex-col">
          <Label htmlFor="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email address"
          />
        </div>

        {/* password */}
        <div className="flex flex-col relative">
          <Label htmlFor="password">Enter Password</Label>
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-lg px-1 py-0.5 absolute right-2 bottom-3.5 cursor-pointer"
          >
            {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 p-2 bg-red-100 border border-red-400 text-sm mt-1">
            {error.message}
          </p>
        )}

        <p
          onClick={() => setCurrentStep("forgot-password")}
          className="text-primary-1 font-medium my-1 hover:underline cursor-pointer w-fit"
        >
          Forgot password
        </p>

        {/* Submit Button */}
        <Button variant="solid" type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </>
  );
};

export default WelcomeLogin;
