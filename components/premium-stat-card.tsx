/**
 * Premium Stat Card Component
 * Reusable borderless card with gradient background and gradient text
 */

import { cn } from "./ui/utils";
import { cardBaseStyle } from "../utils/premium-styles";

interface PremiumStatCardProps {
  value: string | number;
  label: string;
  variant?: "primary" | "secondary" | "pink" | "blue" | "green" | "purple" | "gold";
  className?: string;
}

const variantStyles = {
  primary: {
    container: "bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg shadow-primary/5",
    text: "bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent",
  },
  secondary: {
    container: "bg-gradient-to-br from-secondary/5 to-secondary/10 shadow-lg shadow-secondary/5",
    text: "bg-gradient-to-br from-secondary to-secondary/70 bg-clip-text text-transparent",
  },
  pink: {
    container: "bg-gradient-to-br from-pink-500/5 to-pink-500/10 shadow-lg shadow-pink-500/5",
    text: "bg-gradient-to-br from-pink-600 to-pink-500/70 bg-clip-text text-transparent",
  },
  blue: {
    container: "bg-gradient-to-br from-blue-500/5 to-blue-500/10 shadow-lg shadow-blue-500/5",
    text: "bg-gradient-to-br from-blue-600 to-blue-500/70 bg-clip-text text-transparent",
  },
  green: {
    container: "bg-gradient-to-br from-green-500/5 to-green-500/10 shadow-lg shadow-green-500/5",
    text: "bg-gradient-to-br from-green-600 to-green-500/70 bg-clip-text text-transparent",
  },
  purple: {
    container: "bg-gradient-to-br from-purple-500/5 to-purple-500/10 shadow-lg shadow-purple-500/5",
    text: "bg-gradient-to-br from-purple-600 to-purple-500/70 bg-clip-text text-transparent",
  },
  gold: {
    container: "bg-gradient-to-br from-[#F2B705]/5 to-[#F2B705]/10 shadow-lg shadow-[#F2B705]/5",
    text: "bg-gradient-to-br from-[#F2B705] to-[#D4A005]/70 bg-clip-text text-transparent",
  },
};

export function PremiumStatCard({
  value,
  label,
  variant = "primary",
  className,
}: PremiumStatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className={cn(cardBaseStyle, styles.container, className)}>
      <div className="flex flex-col gap-2">
        <div className={cn("text-[42px] font-bold leading-none tracking-tight", styles.text)}>
          {value}
        </div>
        <div className="text-[14px] font-medium text-muted-foreground/80">{label}</div>
      </div>
    </div>
  );
}