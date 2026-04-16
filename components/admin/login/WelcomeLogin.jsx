/* eslint-disable no-undef */
"use client";

import { useState } from "react";
import Input from "@/components/common/Input";
import Label from "@/components/common/Label";
import Button from "@/components/common/Button";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useLogin } from "@/hook/auth";
// import Cookies from "js-cookie";
import { useToast } from "@/lib/Provider/toastProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";

const WelcomeLogin = ({ setCurrentStep }) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const { login, isLoading, error } = useLogin({
    onSuccess: (data) => {
      if (data.data.data.user?.role !== "admin") {
        showToast(
          "You are not authorized to access the admin panel",
          "error",
          "Unauthorized",
        );
        return;
      }

      // Cookies.set("accessToken", data.data.data.accessToken, {
      //   path: "/",
      //   maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE || 86400,
      // });
      // Cookies.set("refreshToken", data.data.data.refreshToken, {
      //   path: "/",
      //   maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE || 86400,
      // });

      showToast("Login successful", "success", "Success");
      router.push("/admin");
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
      <div className="flex items-center justify-center my-4">
        <Image
          src="/assets/images/logo-small.png"
          alt="SkudyX Logo"
          width={250}
          height={50}
          className="mb-4"
        />
      </div>
      <div className="w-full mb-6">
        <h2 className="text-center text-black text-2xl font-semibold mb-2">
          Super Admin Login
        </h2>
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
          <Label htmlFor="password">Password</Label>
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
          <p className="text-red-500 bg-red-100 p-2 border border-red-400 text-sm mt-1">
            {error.message}
          </p>
        )}
        <div className="flex items-center justify-between">
          <label className="flex gap-2 items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => {
                setRemember(e.target.checked);
                console.log("Remember me:", e.target.checked);
              }}
              className="hidden"
            />

            <div
              className={`
                  w-5 h-5 rounded-md border flex items-center justify-center
                  transition-all duration-200
                   ${remember ? "bg-blue-950 border-[#406DA4]" : "border-gray-300"}
                    `}
            >
              {remember && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>

            <span className="text-sm text-gray-600">Remember me</span>
          </label>

          <p
            onClick={() => setCurrentStep("forgot-password")}
            className=" font-medium my-1 hover:underline cursor-pointer w-fit"
          >
            Forgot password?
          </p>
        </div>

        {/* Submit Button */}
        <Button variant="solid" type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </>
  );
};

export default WelcomeLogin;
