/**
 * Premium Badge Component
 * Reusable badge with gradient background and colored shadows
 */

import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";
import {
  getVoicePartStyles,
  getStatusStyles,
  getExecutiveStyles,
  getAttendanceStyles,
  getPaymentStyles,
  getPriorityStyles,
  badgeBaseStyle,
} from "../utils/premium-styles";

type BadgeType =
  | "voicePart"
  | "status"
  | "executive"
  | "attendance"
  | "payment"
  | "priority"
  | "custom";

interface PremiumBadgeProps {
  type: BadgeType;
  value: string | boolean;
  customStyles?: string;
  className?: string;
}

export function PremiumBadge({ type, value, customStyles, className }: PremiumBadgeProps) {
  let styles = "";
  let displayValue = "";

  switch (type) {
    case "voicePart":
      styles = getVoicePartStyles(value as string);
      displayValue = value as string;
      break;
    case "status":
      styles = getStatusStyles(value as string);
      displayValue = value as string;
      break;
    case "executive":
      styles = getExecutiveStyles(value as boolean);
      displayValue = value ? "Yes" : "No";
      break;
    case "attendance":
      styles = getAttendanceStyles(value as string);
      displayValue = value as string;
      break;
    case "payment":
      styles = getPaymentStyles(value as string);
      displayValue = value as string;
      break;
    case "priority":
      styles = getPriorityStyles(value as string);
      displayValue = value as string;
      break;
    case "custom":
      styles = customStyles || "";
      displayValue = value as string;
      break;
  }

  return (
    <Badge variant="secondary" className={cn(badgeBaseStyle, styles, className)}>
      {displayValue}
    </Badge>
  );
}
