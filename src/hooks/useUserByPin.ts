// hooks/useUserByPin.ts
import { useEffect, useState } from "react";
import { userService } from "@/services/userServices";
import Cookies from "js-cookie";
import { decrypt } from "@/services/secretService";

export function useUserByPin() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const encPin = Cookies.get("USRPIN");
      if (!encPin) return;

      const pin = decrypt(encPin);
      if (!pin) return;

      try {
        const response = await userService.getUserByPin(pin);
        if (response?.isSuccessful) {
          setUser(response.data);
        }
      } catch (err) {
        console.error(`Error fetching user by PIN ${pin}:`, err);
      }
    };

    fetchUser();
  }, []);

  return user;
}
