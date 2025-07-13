"use client";

import React, { useState } from "react";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MdEmail, MdPin } from "react-icons/md";
import MailLoader from "../loader/mailLoader";
import SubmitButton from "../ui/submitButton";

const ResetPassword = () => {
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMailLoader, setShowMailLoader] = useState(false);

  const { resetPassword } = useResetPassword();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pin.trim() || !email.trim()) {
      toast.error("Both PIN and Email are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await resetPassword(pin);

      if (result?.isSuccessful) {
        // Show spinner for 2 seconds
        setTimeout(() => {
          setIsSubmitting(false);
          setShowMailLoader(true);

          // Show mail loader for 5 seconds
          setTimeout(() => {
            setShowMailLoader(false);
            toast.success(result.message);
            router.push("/");
          }, 5000);
        }, 2000);
      } else {
        toast.error(result?.message);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      toast.error(err?.toString() || "Unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  if (showMailLoader) return <MailLoader />;

  return (
    <div className="text-xs flex justify-center items-center min-h-screen bg-white dark:bg-black">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-300 dark:bg-gray-800 shadow-lg shadow-gray-600 dark:shadow-gray-400 rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-black dark:text-white text-lg font-bold mb-4 text-center">
          Reset Password
        </h2>

        {/* PIN Field */}
        <div className="mb-4">
          <label htmlFor="pin" className="block font-semibold mb-1">
            Your PIN
          </label>
          <div className="relative">
            <input
              id="pin"
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full p-2 pl-10 border rounded dark:bg-black bg-white dark:text-white text-black"
              required
            />
            <MdPin className="absolute left-3 top-2.5 text-gray-500" />
          </div>
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block font-semibold mb-1">
            Your Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 pl-10 border rounded dark:bg-black bg-white dark:text-white text-black"
              required
            />
            <MdEmail className="absolute left-3 top-2.5 text-gray-500" />
          </div>
        </div>

        {/* Submit Button */}
        <SubmitButton isSubmitting={isSubmitting} label="Reset Password" />
      </form>
    </div>
  );
};

export default ResetPassword;
