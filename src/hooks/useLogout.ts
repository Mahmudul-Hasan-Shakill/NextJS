import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { authService } from "@/services/authServices";

export function useLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from the application.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
      cancelButtonText: "Cancel",
    });

    if (!confirmation.isConfirmed) {
      return Swal.fire("Cancelled", "You are still logged in.", "info");
    }

    try {
      const result = await authService.logoutService();
      if (result?.isSuccessful) {
        Swal.fire("Logged out!", result.message, "success");
        router.push("/");
      } else {
        Swal.fire("Error!", result.message, "error");
      }
    } catch (err) {
      console.error("Logout error:", err);
      Swal.fire(
        "Error!",
        "An unexpected error occurred during logout.",
        "error"
      );
    }
  };

  return handleLogout;
}
