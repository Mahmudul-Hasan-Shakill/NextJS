import useSWR from "swr";
import { userService } from "@/services/userServices";

export type User = {
  id: number;
  pin: string;
  name: string;
  email: string;
  userRole: string;
  isActive: boolean;
  isLocked: boolean;
  isReset: boolean;
};

const fetchUsers = async () => {
  const response = await userService.getAllUsers();
  if (response?.isSuccessful && Array.isArray(response.data)) {
    return response.data.map((user: any) => ({
      ...user,
      id: user.id,
    }));
  }
  throw new Error("Failed to fetch users");
};

export function useAllUsers() {
  const { data, error, mutate } = useSWR<User[]>("users", fetchUsers);

  return {
    users: data || [],
    error,
    mutate,
  };
}
