/**
 * Premium styling utilities for VocalEssence
 * Reusable style functions and class strings for consistent premium design
 */

/**
 * Get premium gradient badge styles for member parts
 */
export const getVoicePartStyles = (part: string) => {
  switch (part) {
    case "Soprano":
      return "bg-gradient-to-br from-rose-500/15 to-rose-600/20 text-rose-700 dark:text-rose-300 shadow-sm shadow-rose-500/10";
    case "Alto":
      return "bg-gradient-to-br from-[#5A1E6E]/15 to-[#5A1E6E]/20 text-[#5A1E6E] dark:text-[#9F7FB8] shadow-sm shadow-[#5A1E6E]/10";
    case "Tenor":
      return "bg-gradient-to-br from-[#F36A21]/15 to-[#F36A21]/20 text-[#F36A21] dark:text-[#FF8F5E] shadow-sm shadow-[#F36A21]/10";
    case "Bass":
      return "bg-gradient-to-br from-[#3D123F]/15 to-[#3D123F]/20 text-[#3D123F] dark:text-[#8B6B8E] shadow-sm shadow-[#3D123F]/10";
    case "Keyboardist":
      return "bg-gradient-to-br from-blue-500/15 to-blue-600/20 text-blue-700 dark:text-blue-300 shadow-sm shadow-blue-500/10";
    case "Drummer":
      return "bg-gradient-to-br from-amber-500/15 to-amber-600/20 text-amber-700 dark:text-amber-300 shadow-sm shadow-amber-500/10";
    case "Horns":
      return "bg-gradient-to-br from-yellow-500/15 to-yellow-600/20 text-yellow-700 dark:text-yellow-300 shadow-sm shadow-yellow-500/10";
    case "Music Director":
      return "bg-gradient-to-br from-[#F2B705]/15 to-[#F2B705]/20 text-[#F2B705] dark:text-[#F2B705] shadow-sm shadow-[#F2B705]/10";
    default:
      return "bg-gradient-to-br from-gray-500/15 to-gray-600/20 text-gray-700 dark:text-gray-300 shadow-sm shadow-gray-500/10";
  }
};

/**
 * Get premium gradient badge styles for status
 */
export const getStatusStyles = (status: "Active" | "Inactive" | string) => {
  switch (status) {
    case "Active":
      return "bg-gradient-to-br from-emerald-500/15 to-emerald-600/25 text-emerald-700 dark:text-emerald-400 shadow-sm shadow-emerald-500/10";
    case "Inactive":
      return "bg-gradient-to-br from-slate-500/15 to-slate-600/25 text-slate-600 dark:text-slate-400 shadow-sm shadow-slate-500/10";
    default:
      return "bg-gradient-to-br from-gray-500/15 to-gray-600/25 text-gray-600 dark:text-gray-400 shadow-sm shadow-gray-500/10";
  }
};

/**
 * Get premium gradient badge styles for executive status
 */
export const getExecutiveStyles = (isExecutive: boolean) => {
  if (isExecutive) {
    return "bg-gradient-to-br from-[#5A1E6E]/15 to-[#5A1E6E]/25 text-[#5A1E6E] dark:text-[#9F7FB8] shadow-sm shadow-[#5A1E6E]/10";
  }
  return "bg-gradient-to-br from-muted/30 to-muted/50 text-muted-foreground shadow-sm";
};

/**
 * Premium stat card gradient backgrounds
 */
export const statCardStyles = {
  primary: "bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg shadow-primary/5",
  secondary: "bg-gradient-to-br from-secondary/5 to-secondary/10 shadow-lg shadow-secondary/5",
  pink: "bg-gradient-to-br from-pink-500/5 to-pink-500/10 shadow-lg shadow-pink-500/5",
  blue: "bg-gradient-to-br from-blue-500/5 to-blue-500/10 shadow-lg shadow-blue-500/5",
  green: "bg-gradient-to-br from-green-500/5 to-green-500/10 shadow-lg shadow-green-500/5",
  purple: "bg-gradient-to-br from-purple-500/5 to-purple-500/10 shadow-lg shadow-purple-500/5",
  gold: "bg-gradient-to-br from-[#F2B705]/5 to-[#F2B705]/10 shadow-lg shadow-[#F2B705]/5",
};

/**
 * Premium gradient text styles for numbers/stats
 */
export const gradientTextStyles = {
  primary: "bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent",
  secondary: "bg-gradient-to-br from-secondary to-secondary/70 bg-clip-text text-transparent",
  pink: "bg-gradient-to-br from-pink-600 to-pink-500/70 bg-clip-text text-transparent",
  blue: "bg-gradient-to-br from-blue-600 to-blue-500/70 bg-clip-text text-transparent",
  green: "bg-gradient-to-br from-green-600 to-green-500/70 bg-clip-text text-transparent",
  purple: "bg-gradient-to-br from-purple-600 to-purple-500/70 bg-clip-text text-transparent",
  gold: "bg-gradient-to-br from-[#F2B705] to-[#D4A005]/70 bg-clip-text text-transparent",
  foreground: "bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent",
};

/**
 * Premium button styles
 */
export const buttonStyles = {
  primary: "rounded-xl shadow-lg shadow-primary/10 bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary",
  secondary: "rounded-xl shadow-lg shadow-secondary/10 bg-gradient-to-br from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary",
  outline: "rounded-xl",
  ghost: "rounded-xl hover:bg-accent/50",
};

/**
 * Premium table container style
 */
export const tableContainerStyle = "rounded-2xl bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-sm overflow-hidden shadow-lg shadow-primary/5";

/**
 * Premium table header row style
 */
export const tableHeaderRowStyle = "border-border/20 hover:bg-transparent";

/**
 * Premium table header cell style
 */
export const tableHeaderCellStyle = "h-12 px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90";

/**
 * Premium pagination active button style
 */
export const paginationActiveStyle = "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20";

/**
 * Premium pagination inactive button style
 */
export const paginationInactiveStyle = "text-muted-foreground hover:bg-accent/50 hover:text-foreground";

/**
 * Premium badge base style
 */
export const badgeBaseStyle = "rounded-full px-3 py-0.5 text-[12px] font-medium";

/**
 * Premium card base style (for stats cards)
 */
export const cardBaseStyle = "relative overflow-hidden rounded-2xl p-6";

/**
 * Get premium gradient styles for attendance status
 */
export const getAttendanceStyles = (status: string) => {
  switch (status) {
    case "Present":
      return "bg-gradient-to-br from-green-500/15 to-green-600/25 text-green-700 dark:text-green-400 shadow-sm shadow-green-500/10";
    case "Absent":
      return "bg-gradient-to-br from-red-500/15 to-red-600/25 text-red-700 dark:text-red-400 shadow-sm shadow-red-500/10";
    case "Late":
      return "bg-gradient-to-br from-orange-500/15 to-orange-600/25 text-orange-700 dark:text-orange-400 shadow-sm shadow-orange-500/10";
    case "Excused":
      return "bg-gradient-to-br from-blue-500/15 to-blue-600/25 text-blue-700 dark:text-blue-400 shadow-sm shadow-blue-500/10";
    default:
      return "bg-gradient-to-br from-gray-500/15 to-gray-600/25 text-gray-600 dark:text-gray-400 shadow-sm shadow-gray-500/10";
  }
};

/**
 * Get premium gradient styles for payment status
 */
export const getPaymentStyles = (status: string) => {
  switch (status) {
    case "Paid":
      return "bg-gradient-to-br from-green-500/15 to-green-600/25 text-green-700 dark:text-green-400 shadow-sm shadow-green-500/10";
    case "Pending":
      return "bg-gradient-to-br from-orange-500/15 to-orange-600/25 text-orange-700 dark:text-orange-400 shadow-sm shadow-orange-500/10";
    case "Overdue":
      return "bg-gradient-to-br from-red-500/15 to-red-600/25 text-red-700 dark:text-red-400 shadow-sm shadow-red-500/10";
    case "Cancelled":
      return "bg-gradient-to-br from-gray-500/15 to-gray-600/25 text-gray-600 dark:text-gray-400 shadow-sm shadow-gray-500/10";
    default:
      return "bg-gradient-to-br from-gray-500/15 to-gray-600/25 text-gray-600 dark:text-gray-400 shadow-sm shadow-gray-500/10";
  }
};

/**
 * Get premium gradient styles for priority levels
 */
export const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-gradient-to-br from-red-500/15 to-red-600/25 text-red-700 dark:text-red-400 shadow-sm shadow-red-500/10";
    case "Medium":
      return "bg-gradient-to-br from-orange-500/15 to-orange-600/25 text-orange-700 dark:text-orange-400 shadow-sm shadow-orange-500/10";
    case "Low":
      return "bg-gradient-to-br from-blue-500/15 to-blue-600/25 text-blue-700 dark:text-blue-400 shadow-sm shadow-blue-500/10";
    default:
      return "bg-gradient-to-br from-gray-500/15 to-gray-600/25 text-gray-600 dark:text-gray-400 shadow-sm shadow-gray-500/10";
  }
};