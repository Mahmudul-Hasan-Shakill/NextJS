"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { FaKey, FaUser } from "react-icons/fa";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { authService } from "@/services/authServices";
import { encrypt, decrypt } from "@/services/secretService";
import Link from "next/link";
import UniversalButton from "../ui/universalButton";

export function LoginForm() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedId = Cookies.get("USR");
    const savedPassword = Cookies.get("SCRT");
    if (savedId && savedPassword) {
      setPin(decrypt(savedId));
      setPassword(decrypt(savedPassword));
      setRememberMe(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await authService.loginService({ pin, password });

    if (!result.isSuccessful) {
      toast.error(result.message, {
        duration: 4000,
        style: { backgroundColor: "#f44336", color: "#fff" },
      });
      return;
    }

    if (rememberMe) {
      Cookies.set("SCRT", encrypt(password), {
        path: "/",
        sameSite: "Lax",
      });
      Cookies.set("USR", encrypt(pin), {
        path: "/",
        sameSite: "Lax",
      });
    } else {
      Cookies.remove("SCRT");
      Cookies.remove("USR");
    }

    toast.success(result.message, {
      duration: 4000,
      style: { backgroundColor: "#4caf50", color: "#fff" },
    });

    router.push("/home");
  };

  return (
    <div className="shadow-none mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-black dark:text-white">Login</h2>
      <p className="mt-2 max-w-sm text-xs text-neutral-600 dark:text-neutral-300">
        Login to Inventory Management System
      </p>
      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label
            htmlFor="pin"
            className="text-xs flex items-center text-black dark:text-white"
          >
            <FaUser className="mr-2" /> Pin
          </Label>
          <Input
            id="pin"
            placeholder="12345"
            type="text"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="text-xs p-2 text-black dark:text-white"
            required
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label
            htmlFor="password"
            className="text-xs flex items-center text-black dark:text-white"
          >
            <FaKey className="mr-2" /> Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-xs p-2 text-black dark:text-white"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center px-2 text-black dark:text-white"
            >
              {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
            </button>
          </div>
        </LabelInputContainer>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember-me"
              className="text-black"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <Label
              htmlFor="remember-me"
              className="ml-2 text-xs text-black dark:text-white"
            >
              Remember me
            </Label>
          </div>
        </div>

        <UniversalButton type="submit">Submit &rarr;</UniversalButton>
        <div className="text-[10px] flex justify-between space-x-4 mt-2 mx-2">
          <Link
            href="/self-registration"
            className="text-blue-500 hover:underline"
          >
            Self Registration?
          </Link>
          <Link
            href="/reset-password"
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
      </form>
      <p className="w-full text-center text-black dark:text-white text-[10px]">
        Developed by <br /> Core Systems, TISM, Technology Division
      </p>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);
