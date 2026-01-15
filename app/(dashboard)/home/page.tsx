"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  Calendar,
  Bell,
  TrendingUp,
  CreditCard,
  Clock,
  MapPin,
  Shirt,
} from "lucide-react";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import { PremiumStatCard } from "@/components/premium-stat-card";
import { gradientTextStyles, cardBaseStyle } from "@/utils/premium-styles";
import { PendingSubscriptionsWidget } from "@/components/subscriptions/pending-subscriptions-widget";

interface HomeProps {
  userEmail: string;
  userRole: "admin" | "member";
}

import { useRouter } from "next/navigation";
import { User } from "lucide-react";

export default function Home({ userEmail, userRole }: HomeProps) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(true);
  const [firstName, setFirstName] = React.useState("");

  React.useEffect(() => {
    // Check if user is pending
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setFirstName(user.first_name || "Member");

        // Active status holds higher power. If not active, show pending banner.
        if (!user.is_active) {
          setIsPending(true);
        } else {
          setIsPending(false);
        }
      }
    } catch (e) {
      console.error("Error parsing user from local storage", e);
    }
  }, []);

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeInOut" }}
    >
      <div className="space-y-8">
        {/* Page Header */}
        <div className="ml-0 md:ml-0 pl-14 md:pl-0">
          <h1 className={cn(gradientTextStyles.foreground)}>
            Welcome, {firstName}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isPending
              ? "Your account is currently pending verification."
              : "Here's what's happening with the choir."}
          </p>
        </div>

        {/* Pending State Banner / CTA */}
        {isPending && (
          <div className={cn(cardBaseStyle, "bg-gradient-to-br from-[#F36A21]/10 to-[#F36A21]/5 border-l-4 border-[#F36A21]")}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#F36A21] mb-1">Complete Your Profile</h2>
                <p className="text-sm text-muted-foreground">
                  Please complete your profile information (KYC) to get fully verified and assigned to your voice part.
                </p>
              </div>
              <Button
                onClick={() => router.push("/profile")}
                className="bg-[#F36A21] hover:bg-[#F36A21]/90 text-white shrink-0"
              >
                <User className="w-4 h-4 mr-2" />
                Complete Profile
              </Button>
            </div>
          </div>
        )}

        {/* Pending Subscriptions Widget - show for verified users */}
        {!isPending && <PendingSubscriptionsWidget />}

        {/* Stats Cards - Simplified */}
        <div className="grid gap-6 md:grid-cols-3">
          <PremiumStatCard value={3} label="Upcoming Events" variant="primary" />
          <PremiumStatCard value={7} label="Songs to Learn" variant="secondary" />
          {!isPending && (
            <PremiumStatCard value="95%" label="Attendance Rate" variant="pink" />
          )}
        </div>

        {/* Next Event */}
        <div className={cn(cardBaseStyle, "bg-gradient-to-br from-[#5A1E6E]/5 to-[#5A1E6E]/10 shadow-lg shadow-[#5A1E6E]/5")}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-[#5A1E6E]" />
              <h2 className="text-lg font-semibold">Next Event</h2>
            </div>
            <div className="text-sm font-medium text-[#F36A21]">In 2 Days</div>
          </div>

          <div className="flex items-start gap-4 mb-4">
            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-[#5A1E6E] text-white flex-shrink-0">
              <div className="text-[10px] font-medium opacity-80">DEC</div>
              <div className="text-2xl font-bold">30</div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Christmas Concert Rehearsal</h3>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>2:00 PM - 5:00 PM</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>VocalEssence Studio</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shirt className="h-4 w-4" />
                  <span>Black Formal Attire</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Please bring water and be prepared for a 3-hour session. We'll be finalizing all parts for the Christmas concert.
          </p>
        </div>

        {/* Announcements - Keep for everyone */}
        <div className={cn(cardBaseStyle, "bg-gradient-to-br from-secondary/5 to-secondary/10 shadow-lg shadow-secondary/5")}>
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-6 w-6 text-[#F36A21]" />
            <h2 className="text-lg font-semibold">Announcements</h2>
          </div>
          <div className="space-y-4">
            <div className="border-l-2 border-[#5A1E6E] pl-4">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="font-semibold">Christmas Concert Rehearsal</h3>
                <span className="text-xs font-medium text-[#5A1E6E] flex-shrink-0">Important</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Extra rehearsal scheduled for this Saturday at 2:00 PM. Please bring water and be prepared for a 3-hour session.
              </p>
              <p className="text-xs text-muted-foreground">2 days ago</p>
            </div>
            <div className="border-l-2 border-[#F36A21] pl-4">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="font-semibold">New Sheet Music Available</h3>
                <span className="text-xs font-medium text-[#F36A21] flex-shrink-0">Update</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                The sheet music for "O Holy Night" is now available in the Repertoire section.
              </p>
              <p className="text-xs text-muted-foreground">5 days ago</p>
            </div>
          </div>
        </div>

        {/* Upcoming Schedule - Keep for everyone */}
        <div className={cn(cardBaseStyle, "bg-gradient-to-br from-[#F2B705]/5 to-[#F2B705]/10 shadow-lg shadow-[#F2B705]/5")}>
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="h-6 w-6 text-[#F2B705]" />
            <h2 className="text-lg font-semibold">Upcoming Schedule</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-[#5A1E6E] text-white mx-auto mb-3">
                <div className="text-[10px] font-medium opacity-80">DEC</div>
                <div className="text-2xl font-bold">30</div>
              </div>
              <div className="text-xs font-medium text-[#5A1E6E] mb-2">Rehearsal</div>
              <h3 className="font-semibold mb-2">Saturday Rehearsal</h3>
              <p className="text-xs text-muted-foreground mb-1">2:00 PM - 5:00 PM</p>
              <p className="text-xs text-muted-foreground">VocalEssence Studio</p>
            </div>
            <div className="text-center">
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-[#F36A21] text-white mx-auto mb-3">
                <div className="text-[10px] font-medium opacity-80">JAN</div>
                <div className="text-2xl font-bold">5</div>
              </div>
              <div className="text-xs font-medium text-[#F36A21] mb-2">Performance</div>
              <h3 className="font-semibold mb-2">New Year Concert</h3>
              <p className="text-xs text-muted-foreground mb-1">7:00 PM - 9:30 PM</p>
              <p className="text-xs text-muted-foreground">National Theatre</p>
            </div>
            <div className="text-center">
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-[#F2B705] text-white mx-auto mb-3">
                <div className="text-[10px] font-medium opacity-80">JAN</div>
                <div className="text-2xl font-bold">12</div>
              </div>
              <div className="text-xs font-medium text-[#F2B705] mb-2">Rehearsal</div>
              <h3 className="font-semibold mb-2">Regular Practice</h3>
              <p className="text-xs text-muted-foreground mb-1">2:00 PM - 5:00 PM</p>
              <p className="text-xs text-muted-foreground">VocalEssence Studio</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}