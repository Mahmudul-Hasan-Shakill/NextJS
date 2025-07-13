"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SessionExpiredDialog() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/");
  };

  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session Expired</DialogTitle>
          <DialogDescription>
            Your session has expired due to inactivity or token expiration.
            Please log in again to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleRedirect}>Go to Login</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
