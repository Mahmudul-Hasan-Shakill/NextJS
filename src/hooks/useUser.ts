import { useEffect, useState } from "react";
import { userService } from "@/services/userServices";

export function useUser(id: number) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const response = await userService.getUser(id);
        if (response?.isSuccessful) {
          setUser(response.data);
        }
      } catch (err) {
        console.error(`Error fetching user with ID ${id}:`, err);
      }
    };

    fetchUser();
  }, [id]);

  return user;
}
