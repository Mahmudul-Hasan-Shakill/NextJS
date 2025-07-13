"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { toast } from "sonner";
import { useChangePassword } from "@/hooks/auth/useChangePassword";
import { useUserByPin } from "@/hooks/user/useUserByPin";
import SubmitButton from "../ui/submitButton";
import { Key, RotateCcwKey } from "lucide-react";

const ChangePassword = () => {
  const user = useUserByPin();
  const router = useRouter();
  const { changePassword } = useChangePassword();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    upperLowerCase: false,
    numerical: false,
    specialCharacter: false,
    minLength: false,
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);

    setPasswordValidation({
      upperLowerCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
      numerical: /\d/.test(password),
      specialCharacter: /[!@#$%^&*]/.test(password),
      minLength: password.length >= 6,
    });
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user?.pin) return toast.error("User PIN not found.");
    if (newPassword !== confirmPassword)
      return toast.error("New passwords do not match.");

    const isValid = Object.values(passwordValidation).every(Boolean);
    if (!isValid)
      return toast.error("Password does not meet security criteria.");

    setIsSubmitting(true);

    try {
      const result = await changePassword(user.pin, { password: newPassword });
      if (result?.isSuccessful) {
        toast.success(result.message);
        router.push("/home");
      } else {
        toast.error(result?.message);
      }
    } catch {
      toast.error("Unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderValidationMessage = (condition: boolean, message: string) => (
    <p className={`text-xs ${condition ? "text-green-500" : "text-red-500"}`}>
      {condition ? "✔" : "✘"} {message}
    </p>
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-white dark:bg-black">
      <form
        onSubmit={handleChangePassword}
        className="bg-gray-300 dark:bg-gray-800 shadow-lg dark:shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-black dark:text-white text-lg font-bold mb-4 text-center">
          Change Password
        </h2>
        {/* New Password */}
        <div className="mb-4">
          <label
            htmlFor="new-password"
            className="text-xs block font-semibold mb-1"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={handlePasswordChange}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="w-full p-2 pl-10 border rounded dark:bg-black bg-white dark:text-white text-black"
              required
            />
            <Key className="absolute left-3 top-2.5 text-gray-500" />

            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-2"
            >
              {showNewPassword ? <IoIosEyeOff /> : <IoIosEye />}
            </button>
          </div>
          {passwordFocused && (
            <div className="mt-2 space-y-1">
              {renderValidationMessage(
                passwordValidation.upperLowerCase,
                "Upper and lower case letters"
              )}
              {renderValidationMessage(
                passwordValidation.numerical,
                "At least one number"
              )}
              {renderValidationMessage(
                passwordValidation.specialCharacter,
                "At least one special character"
              )}
              {renderValidationMessage(
                passwordValidation.minLength,
                "Minimum 6 characters"
              )}
            </div>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="mb-4">
          <label
            htmlFor="confirm-password"
            className="text-xs block font-semibold mb-1"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 pl-10 border rounded dark:bg-black bg-white dark:text-white text-black"
              required
            />
            <RotateCcwKey className="absolute left-3 top-2.5 text-gray-500" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-2"
            >
              {showConfirmPassword ? <IoIosEyeOff /> : <IoIosEye />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <SubmitButton isSubmitting={isSubmitting} label="Change Password" />
      </form>
    </div>
  );
};

export default ChangePassword;
