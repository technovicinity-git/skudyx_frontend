"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Lock, Shield, Copy } from "lucide-react";
import Button from "@/components/common/Button";
import {
  // NotFoundIllustrationIcon,
  NoTransactionPinIllustrationIcon,
  SearchIcon,
} from "@/public/assets/icons/icons";
import { useGetMyProfile } from "@/hook/user";
import {
  useCreatePin,
  useMultiFactorDisable,
  useMultiFactorEnable,
  useMultiFactorSetup,
  useOTPVerification,
  useSendOtpToPhone,
} from "@/hook/auth";
import { useToast } from "@/lib/Provider/toastProvider";
import { CircularProgress } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

const Security = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [selectedOption, setSelectedOption] = useState(1); // 1 for Security pin, 2 for MFA
  const [showCreatePin, setShowCreatePin] = useState(false);
  const [showSendOtpSection, setShowSendOtpSection] = useState(false);
  const [isPinCreated, setIsPinCreated] = useState(false);
  const [newPin, setNewPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  // eslint-disable-next-line no-unused-vars
  const [activeInput, setActiveInput] = useState("new");
  const [mfaCode, setMfaCode] = useState(["", "", "", "", "", ""]);
  // const [authenticatorApp, setAuthenticatorApp] = useState("");
  const [copied, setCopied] = useState(false);
  const [otp, setOtp] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const { profile } = useGetMyProfile();

  const { verifyOTP, isLoading: isVerifyOtpLoading } = useOTPVerification();
  const { createPin, isLoading: isCreatePinLoading } = useCreatePin();
  const { sendOtpToPhone, isLoading: isSendOtpLoading } = useSendOtpToPhone();
  const {
    code,
    isLoading: isMfaCodeLoading,
    error: mfaCodeError,
    refetch: refetchMfaCode,
  } = useMultiFactorSetup();

  const {
    enableMultiFactor,
    isLoading: isEnableMfaLoading,
    errorMessage: enableMfaError,
  } = useMultiFactorEnable();

  const {
    disableMultiFactor,
    isLoading: isDisableMfaLoading,
    errorMessage: disableMfaError,
  } = useMultiFactorDisable();

  const securityOptions = [
    {
      id: 1,
      title: "Security pin",
      description: "Enable for added security",
      icon: <Lock size={20} />,
    },
    {
      id: 2,
      title: "Multi-factor authentication",
      description:
        "Add extra layer of security by requiring a one time verification code",
      icon: <Shield size={20} />,
    },
  ];

  const handleBack = () => {
    router.back();
  };

  const handleOtpSend = () => {
    sendOtpToPhone(
      { email: profile?.email, phone_number: profile?.phone_number },
      {
        onSuccess: () => {
          setIsPinCreated(true);
          setShowSendOtpSection(true);
          setSuccessMessage("OTP sent successfully");
        },
      }
    );
  };

  const handleVerifyOtp = () => {
    const code = mfaCode.join("");
    if (code.length === 6) {
      verifyOTP(
        { email: profile?.email, otp: code },
        {
          onSuccess: () => {
            showToast("OTP verified successfully", "success", "Success");
            setOtp(code);
            setShowSendOtpSection(false);
            setShowCreatePin(true);
            setError("");
          },
          onError: (error) => {
            showToast(
              error?.response?.data?.message || "Failed to verify OTP",
              "error",
              "Error"
            );
            setError(error?.response?.data?.message || "Failed to verify OTP");
            setShowSendOtpSection(true);
            setShowCreatePin(false);
          },
        }
      );
      setOtp(code);
    }
  };

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    setSuccessMessage("");
    setMfaCode(["", "", "", "", "", ""]);
    if (optionId === 1) {
      setShowCreatePin(false);
    } else if (optionId === 2) {
      setShowCreatePin(false);
    }
  };

  const handlePinChange = (index, value, type) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      if (type === "new") {
        const updatedPin = [...newPin];
        updatedPin[index] = value;
        setNewPin(updatedPin);

        // Auto-focus next input
        if (value && index < 3) {
          const nextInput = document.getElementById(`new-pin-${index + 1}`);
          if (nextInput) nextInput.focus();
        }
      } else {
        const updatedPin = [...confirmPin];
        updatedPin[index] = value;
        setConfirmPin(updatedPin);

        // Auto-focus next input
        if (value && index < 3) {
          const nextInput = document.getElementById(`confirm-pin-${index + 1}`);
          if (nextInput) nextInput.focus();
        }
      }
    }
  };

  const handleMfaCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const updatedCode = [...mfaCode];
      updatedCode[index] = value;
      setMfaCode(updatedCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`mfa-code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleCreatePin = () => {
    const newPinString = newPin.join("");
    const confirmPinString = confirmPin.join("");

    if (newPinString.length === 4 && confirmPinString.length === 4) {
      if (newPinString === confirmPinString) {
        createPin(
          { phone_number: profile?.phone_number, otp: otp, pin: newPinString },
          {
            onSuccess: () => {
              showToast("PIN created successfully", "success", "Success");
              setIsPinCreated(true);
              setShowCreatePin(false);
              setNewPin(["", "", "", ""]);
              setConfirmPin(["", "", "", ""]);
              setError("");
            },
            onError: (error) => {
              showToast(
                error?.response?.data?.message || "Failed to create PIN",
                "error",
                "Error"
              );
              setError(
                error?.response?.data?.message || "Failed to create PIN"
              );
            },
          }
        );
      } else {
        setError("PINs don't match");
      }
    }
  };

  const handleEnableMfa = () => {
    setSuccessMessage("");
    setSelectedOption(3);
    refetchMfaCode();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleDisableMfa = () => {
    disableMultiFactor(
      {},
      {
        onSuccess: () => {
          showToast("MFA disabled successfully", "success", "Success");
          setSuccessMessage("MFA disabled successfully");
          queryClient.invalidateQueries(["myProfile"]);
          setSelectedOption(2);
        },
        onError: () => {
          showToast(
            disableMfaError || "Failed to disable MFA",
            "error",
            "Error"
          );
        },
      }
    );
  };

  const handleCheckAuthenticator = () => {
    const code = mfaCode.join("");
    if (code.length === 6) {
      // Handle MFA verification
      enableMultiFactor(
        { token: code },
        {
          onSuccess: () => {
            showToast("MFA enabled successfully", "success", "Success");
            setSuccessMessage("MFA enabled successfully");
          },
          onError: () => {
            showToast(
              enableMfaError || "Failed to enable MFA",
              "error",
              "Error"
            );
          },
        }
      );
    }
  };

  const renderPinInputs = (pin, type) => {
    return (
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((index) => (
          <input
            key={index}
            id={`${type}-pin-${index}`}
            type="text"
            maxLength={1}
            value={pin[index]}
            onChange={(e) => handlePinChange(index, e.target.value, type)}
            onFocus={() => setActiveInput(type)}
            className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none ${
              pin[index]
                ? "text-primary-1 border-primary-1"
                : "bg-white border-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const renderMfaCodeInputs = () => {
    return (
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="flex items-center">
            <input
              id={`mfa-code-${index}`}
              type="text"
              maxLength={1}
              value={mfaCode[index]}
              onChange={(e) => handleMfaCodeChange(index, e.target.value)}
              className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none ${
                mfaCode[index]
                  ? "text-primary-1 border-primary-1"
                  : "bg-white border-gray-300"
              }`}
            />
            {index === 2 && (
              <span className="mx-1 text-gray-400 font-semibold">-</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderRightPanel = () => {
    if (selectedOption === 1) {
      // Security pin selected
      if (!isPinCreated && !showCreatePin) {
        // Empty state with create pin button
        return (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-16">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  {NoTransactionPinIllustrationIcon}
                  <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-12">
                    {SearchIcon}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No transaction pin yet
              </h3>
              <Button
                onClick={handleOtpSend}
                className="bg-primary-1 hover:bg-green-700 text-white cursor-pointer"
              >
                {isSendOtpLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  "Create Pin"
                )}
              </Button>
            </div>
          </div>
        );
      } else if (showSendOtpSection) {
        return (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#222222] mb-4">
              Set Your Secure PIN
            </h2>
            <p className="text-gray-600 text-base mb-8">
              Create a personal PIN to keep your account safe. You&apos;ll use
              this to confirm important actions.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  We&apos;ve sent a one-time password (OTP) to your Phone Number{" "}
                  <span className="font-semibold">
                    {profile?.phone_number || "<Phone Number>"}
                  </span>
                </label>
                {renderMfaCodeInputs()}
              </div>
            </div>
            {error && (
              <div className="bg-red-100 p-2 border border-red-400 text-red-500 text-sm mt-2">
                {error}
              </div>
            )}
            <div className="pt-4">
              <Button
                onClick={handleVerifyOtp}
                className="w-full bg-primary-1 hover:bg-green-700 text-white"
              >
                {isVerifyOtpLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </div>
        );
      } else if (showCreatePin) {
        // Create pin form
        return (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#222222] mb-4">
              Set Your Secure PIN
            </h2>
            <p className="text-gray-600 text-base mb-8">
              Create a personal PIN to keep your account safe. You&apos;ll use
              this to log in and confirm important actions.
            </p>

            <div className="space-y-6">
              {/* Enter New PIN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Enter New PIN
                </label>
                {renderPinInputs(newPin, "new")}
              </div>

              {/* Confirm PIN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Confirm PIN
                </label>
                {renderPinInputs(confirmPin, "confirm")}
              </div>

              {error && (
                <div className="bg-red-100 p-2 border border-red-400 text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}

              {/* Create PIN Button */}
              <div className="pt-4">
                <Button
                  onClick={handleCreatePin}
                  className="w-full bg-primary-1 hover:bg-green-700 text-white"
                  disabled={isCreatePinLoading}
                >
                  {isCreatePinLoading ? "Creating..." : "Create PIN"}
                </Button>
              </div>
            </div>
          </div>
        );
      }
    } else if (selectedOption === 2) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                {NoTransactionPinIllustrationIcon}
                <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-12">
                  {SearchIcon}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Multifactor Authentication (MFA)
            </h3>
            {profile?.two_factor_authentication ? (
              <Button
                onClick={handleDisableMfa}
                className="bg-primary-1 hover:bg-green-700 text-white cursor-pointer"
                disabled={isDisableMfaLoading}
              >
                {isDisableMfaLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  "Disable"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleEnableMfa}
                className="bg-primary-1 hover:bg-green-700 text-white cursor-pointer"
                disabled={isMfaCodeLoading}
              >
                {isMfaCodeLoading ? <CircularProgress size={20} /> : "Enable"}
              </Button>
            )}
          </div>
        </div>
      );
    } else if (selectedOption === 3) {
      // Multi-factor authentication selected
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#222222] mb-4">
            Multi-Factor Authentication
          </h2>
          <p className="text-gray-600 text-base mb-8">
            Add an extra layer of security by requiring a one-time verification
            code.
          </p>

          <div className="space-y-6">
            {/* Authenticator Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste this key into your authenticator app
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={
                    code ||
                    (isMfaCodeLoading
                      ? "Loading..."
                      : mfaCodeError
                      ? "Error loading code"
                      : "")
                  }
                  readOnly
                  className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                />
                <button
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={handleCopy}
                >
                  {copied ? (
                    "Copied!"
                  ) : (
                    <div className="flex items-center gap-1 cursor-pointer">
                      <Copy size={16} className="text-gray-600" /> {"Copy"}
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Authenticator App Name */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name of authenticator app
              </label>
              <input
                type="text"
                placeholder="e.g Google Auth App"
                value={authenticatorApp}
                onChange={(e) => setAuthenticatorApp(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-1"
              />
            </div> */}

            {/* Verification Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-digit code displayed in the app before it expires
              </label>
              {renderMfaCodeInputs()}
            </div>

            {successMessage && (
              <div className="bg-green-100 p-2 border border-green-400 text-green-500 text-sm mt-2">
                {successMessage}
              </div>
            )}

            {/* Check Authenticator Button */}
            <div className="pt-4">
              <Button
                onClick={handleCheckAuthenticator}
                className="w-full bg-primary-1 hover:bg-green-700 text-white"
                disabled={isEnableMfaLoading}
              >
                {isEnableMfaLoading ? "Checking..." : "Check authenticator"}
              </Button>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mb-6 hover:bg-gray-200 transition-colors"
      >
        <ArrowLeft size={20} className="text-gray-600" />
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#222222] mb-2">
          Security & Login
        </h1>
        <p className="text-gray-600 text-base">
          View and manage your personal details.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Security Options */}
        <div className="lg:col-span-1 space-y-4">
          {securityOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
                selectedOption === option.id
                  ? "bg-gray-100 border-primary-1"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-gray-600">{option.icon}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#222222] text-base">
                      {option.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {option.description}
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Dynamic Content */}
        <div className="lg:col-span-2">{renderRightPanel()}</div>
      </div>
    </div>
  );
};

export default Security;
