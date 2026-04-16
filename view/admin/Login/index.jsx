"use client";

import { useState } from "react";

import ForgotPassword from "@/components/admin/login/ForgotPassword";
import WelcomeLogin from "@/components/admin/login/WelcomeLogin";
import CheckEmail from "@/components/admin/login/CheckEmail";
import SetPassword from "@/components/admin/login/SetPassword";
import Success from "@/components/admin/login/Success";

const index = () => {
  const [currentStep, setCurrentStep] = useState("welcome-login");
  const [userEmail, setUserEmail] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <div className="bg-gray-100 w-full min-h-[calc(100vh-80px)] flex justify-center items-center">
      <div className="w-[95%] max-w-[580px] px-[15px] py-6 flex flex-col justify-center items-center">
        <div className="bg-white px-6 sm:px-8 py-8 rounded-2xl w-full">
          {currentStep === "welcome-login" ? (
            <WelcomeLogin setCurrentStep={setCurrentStep} />
          ) : currentStep === "forgot-password" ? (
            <ForgotPassword
              setCurrentStep={setCurrentStep}
              setUserEmail={setUserEmail}
            />
          ) : currentStep === "check-email" ? (
            <CheckEmail
              setCurrentStep={setCurrentStep}
              userEmail={userEmail}
              setOtp={setOtp}
            />
          ) : currentStep === "set-new-password" ? (
            <SetPassword
              setCurrentStep={setCurrentStep}
              userEmail={userEmail}
              otp={otp}
            />
          ) : currentStep === "success" ? (
            <Success setCurrentStep={setCurrentStep} />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default index;
