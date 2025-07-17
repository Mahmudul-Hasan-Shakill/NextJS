import Image from "next/image";
import LogoWhite from "@/../public/svg/brac_bank.svg";
import LogoBlack from "@/../public/svg/brac_bank_black.svg";
import { LoginForm } from "@/components/auth/login";

export default function Home() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <main className="flex w-full flex-col md:flex-row justify-center">
        {/* Left Side - Hidden on small screens */}
        <div className="hidden md:flex md:w-3/5 bg-white dark:bg-black items-center justify-center">
          <div className="max-w-md p-4">
            <div className="block dark:hidden">
              {/* <Image
                src={LogoBlack}
                alt="BRAC Bank Logo"
                width={400}
                height={200}
                className="mx-auto"
                priority
              /> */}
              <div className="relative w-[400px] h-[200px] mx-auto">
                <Image
                  src={LogoBlack}
                  alt="BRAC Bank Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="hidden dark:block">
              {/* <Image
                src={LogoWhite}
                alt="BRAC Bank Logo"
                width={400}
                height={200}
                className="mx-auto"
                priority
              /> */}
              <div className="relative w-[400px] h-[200px] mx-auto">
                <Image
                  src={LogoWhite}
                  alt="BRAC Bank Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <h1 className="mt-6 text-center text-xl text-black dark:text-white tracking-[.15em]">
              Technology Infrastructure and Systems Management Inventory
            </h1>
          </div>
        </div>

        {/* Right Side - Always visible */}
        <div className="w-full md:w-2/5 lg:w-2/5 bg-white dark:bg-black flex items-center justify-center">
          <div className="w-full max-w-md px-6 py-10 md:mx-12">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}
