// hooks/useUserDetails.ts
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { userService } from "@/services/userServices";
import { decrypt } from "@/services/secretService";

export function useUserDetails() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const encPin = Cookies.get("USRPIN");
      if (!encPin) return;

      const pin = decrypt(encPin);
      if (!pin) return;

      try {
        const response = await userService.getUserByPin(pin);
        if (response?.isSuccessful && response.data?.name) {
          setUserName(response.data.name);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUserDetails();
  }, []);

  return userName;
}
