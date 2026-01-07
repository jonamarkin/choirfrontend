"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  Users,
  CalendarDays,
  Wallet,
  Music,
  Settings,
  ChevronDown,
  UserCog,
  CreditCard,
  Calendar,
  Home,
  X,
  User,
} from "lucide-react";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/* ----------------------------------------
   Navigation configuration
---------------------------------------- */

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/members", label: "Members", icon: Users },
  { href: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/programs", label: "Programs", icon: Calendar },
  { href: "/attendance", label: "Attendance", icon: CalendarDays },
  { href: "/finance", label: "Finance", icon: Wallet },
  { href: "/repertoire", label: "Repertoire", icon: Music },
  {
    label: "Settings",
    icon: Settings,
    subItems: [
      {
        href: "/settings/manage-subscriptions",
        label: "Manage Subscriptions",
        icon: CreditCard,
      },
      { href: "/settings/manage-users", label: "Manage Users", icon: UserCog },
    ],
  },
];

const footerItems = [
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/login", label: "Sign out", icon: LogOut },
];

/* ----------------------------------------
   NavRow component
---------------------------------------- */

function NavRow({
  label,
  icon: Icon,
  active,
  onClick,
  subItems,
  expanded,
  onToggle,
  isSubItem,
  pathname,
  onNavigate,
}: {
  label: string;
  icon: React.ElementType;
  active?: boolean;
  onClick?: () => void;
  subItems?: any[];
  expanded?: boolean;
  onToggle?: () => void;
  isSubItem?: boolean;
  pathname?: string;
  onNavigate?: (href: string) => void;
}) {
  const hasSubItems = !!subItems?.length;

  return (
    <>
      <motion.button
        type="button"
        onClick={hasSubItems ? onToggle : onClick}
        whileHover={{ scale: active ? 1 : 1.02, x: active ? 0 : 2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative flex w-full items-center gap-3 rounded-xl py-3.5",
          isSubItem ? "px-3 pl-12" : "px-4",
          "transition-all duration-300 overflow-hidden"
        )}
      >
        {/* Active background */}
        {active && (
          <motion.div
            layoutId="activeBackground"
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5A1E6E]/8 via-[#5A1E6E]/5 to-transparent"
          />
        )}

        {/* Left indicator */}
        {active && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-[#5A1E6E] to-[#3D123F]"
          />
        )}

        {/* Hover background */}
        <div className="absolute inset-0 rounded-xl bg-accent/50 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Icon */}
        <Icon
          className={cn(
            "relative z-10 transition-colors",
            isSubItem ? "h-4 w-4" : "h-5 w-5",
            active
              ? "text-[#5A1E6E] dark:text-[#9F7FB8]"
              : "text-muted-foreground group-hover:text-foreground"
          )}
        />

        {/* Label */}
        <span
          className={cn(
            "relative z-10 truncate font-medium",
            isSubItem ? "text-[13px]" : "text-[14px]",
            active
              ? "text-foreground"
              : "text-muted-foreground group-hover:text-foreground"
          )}
        >
          {label}
        </span>

        {hasSubItems && (
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            className="ml-auto relative z-10"
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        )}
      </motion.button>

      {/* Sub items */}
      {hasSubItems && (
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-0.5 space-y-0.5">
                {subItems.map((item) => (
                  <NavRow
                    key={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={pathname === item.href}
                    onClick={() => onNavigate?.(item.href)}
                    isSubItem
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

/* ----------------------------------------
   Sidebar component
---------------------------------------- */

export function Sidebar({
  isMobile,
  onClose,
}: {
  isMobile?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(true);

  React.useEffect(() => {
    // Check if user is pending
    const checkUserStatus = () => {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.organization) {
            setIsPending(false);
          }
        }
      } catch (e) {
        console.error("Error parsing user from local storage", e);
      }
    };

    checkUserStatus();
  }, []);

  const navigate = (href: string) => {
    router.push(href);
    onClose?.();
  };

  return (
    <div
      className={cn(
        "relative flex h-full flex-col p-5",
        isMobile && "bg-background"
      )}
    >
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5A1E6E]/20 to-[#5A1E6E]/10">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#5A1E6E] to-[#3D123F]" />
        </div>

        <div className="flex-1">
          <div className="text-[17px] font-semibold">VocalEssence</div>
          <div className="mt-1 inline-flex rounded-full bg-[#5A1E6E]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#5A1E6E]">
            Admin
          </div>
        </div>

        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="grid gap-1">
        {navItems.map((item) => {
          // Check if user is pending (no organization)
          // Ideally this comes from a hook or context, but for now we'll simulate or check local storage if possible
          // For now, we'll assume if we're in this view, we might need to check.
          // Since this is a client component, let's use a hook or simple check.

          // However, to keep it simple and safe:
          // We will hide sensitive modules if we can detect the user is "pending".
          // Since we don't have global state easily accessible here without a Provider,
          // we might want to pass it as a prop or fetch it. 
          // But wait, the Sidebar is used in Layout which doesn't fetch user data deeply yet.

          // Let's rely on the fact that for "pending" users, we might want to HIDE everything except Home and Profile.
          // But without user data, we can't condition it easily.

          // REFACTOR: We should probably move the `navItems` filtering logic to the parent or a custom hook.
          // For this step, I will add a TODO and assume passed props or context later.
          // BUT, to satisfy the user request NOW:
          // I will fetch the user from `authService` in a useEffect to determine state.

          if (
            isPending &&
            !["Home", "Repertoire", "My Profile"].includes(item.label)
          ) {
            return null;
          }

          return item.subItems ? (
            <NavRow
              key={item.label}
              label={item.label}
              icon={item.icon}
              expanded={expanded === item.label}
              onToggle={() =>
                setExpanded(expanded === item.label ? null : item.label)
              }
              subItems={item.subItems}
              active={pathname.startsWith("/settings")}
              pathname={pathname}
              onNavigate={navigate}
            />
          ) : (
            <NavRow
              key={item.href}
              label={item.label}
              icon={item.icon}
              active={pathname === item.href}
              onClick={() => navigate(item.href)}
            />
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-6">
        <Separator />
        <div className="mt-4">
          {footerItems.map((item) => (
            <NavRow
              key={item.label}
              label={item.label}
              icon={item.icon}
              active={pathname === item.href}
              onClick={() => navigate(item.href)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
