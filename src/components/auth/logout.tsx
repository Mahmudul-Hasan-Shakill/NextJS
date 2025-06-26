"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authServices";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { SidebarButton } from "../sidebar/sidebar-button";

export default function LogoutButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const result = await authService.logoutService();
      if (result?.isSuccessful) {
        toast.success(result.message);
        setOpen(false);
        router.push("/");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("An unexpected error occurred during logout.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarButton
          size="sm"
          icon={LogOut}
          className="w-full text-xs text-red-700 dark:text-red-400"
        >
          Log Out
        </SidebarButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            You will be logged out from the application.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Yes, log me out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
