import useSWR from "swr";
import { userService } from "@/services/userServices";
import { Register } from "@/types/register";

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
  const { data, error, mutate } = useSWR<Register[]>("users", fetchUsers);

  return {
    users: data || [],
    error,
    mutate,
  };
}
