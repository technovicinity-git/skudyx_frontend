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

const WelcomeLogin = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const { login, isLoading, error } = useLogin({
    onSuccess: (data) => {
      // Cookies.set("accessToken", data.data.data.accessToken, {
      //   path: "/",
      //   maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE || 86400,
      // });
      // Cookies.set("refreshToken", data.data.data.refreshToken, {
      //   path: "/",
      //   maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE || 86400,
      // });
      if (data.data.data.user?.role !== "agent") {
        showToast(
          "You are not authorized to access the agent panel",
          "error",
          "Unauthorized",
        );
        return;
      }

      showToast("Login successful", "success", "Success");
      router.push("/agent/pending-cases");
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
    <div className="bg-gray-100 w-full min-h-[calc(100vh-80px)] flex justify-center items-center">
      <div className="w-[95%] max-w-[580px] px-[15px] py-6 flex flex-col justify-center items-center">
        <div className="bg-white px-6 sm:px-8 py-8 rounded-2xl w-full">
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
              Support Agent Login
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

            {/* Submit Button */}
            <Button variant="solid" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WelcomeLogin;
