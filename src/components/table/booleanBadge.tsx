// BooleanBadge.tsx
import { Badge } from "../ui/badge";

type BooleanBadgeProps = {
  value: boolean;
  type: "isActive" | "isLocked" | "isReset";
};

export const BooleanBadge = ({ value, type }: BooleanBadgeProps) => {
  let variant: "default" | "success" | "destructive" | "primary" = "default";
  let label = "";

  switch (type) {
    case "isActive":
      variant = value ? "success" : "destructive";
      label = value ? "Active" : "Inactive";
      break;
    case "isLocked":
      variant = value ? "destructive" : "primary";
      label = value ? "Locked" : "Unlocked";
      break;
    case "isReset":
      variant = value ? "destructive" : "primary";
      label = value ? "Yes" : "No";
      break;
    default:
      label = value ? "True" : "False";
      break;
  }

  return <Badge variant={variant}>{label}</Badge>;
};
