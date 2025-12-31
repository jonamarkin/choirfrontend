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

interface HomeProps {
  userEmail: string;
  userRole: "admin" | "member";
}

export default function Home({ userEmail, userRole }: HomeProps) {
  // Mock subscription data - in real app, this would come from API
  const mockMemberSubscriptions = [
    {
      id: "SUB001",
      planName: "Annual Subscription 2025",
      status: "Partially Paid" as const,
      amount: 150.00,
      paidAmount: 75.00,
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      paymentDate: "2024-12-15",
    },
    {
      id: "SUB002",
      planName: "Annual Subscription 2024",
      status: "Fully Paid" as const,
      amount: 120.00,
      paidAmount: 120.00,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      paymentDate: "2023-11-28",
    },
    {
      id: "SUB003",
      planName: "Special Event Contribution",
      status: "Refunded" as const,
      amount: 50.00,
      paidAmount: 0.00,
      startDate: "2024-06-01",
      endDate: "2024-06-30",
      paymentDate: "2024-05-20",
    },
  ];

  // Calculate outstanding balance
  const outstandingBalance = mockMemberSubscriptions
    .filter(sub => sub.status !== "Fully Paid" && sub.status !== "Refunded")
    .reduce((total, sub) => total + (sub.amount - (sub.paidAmount || 0)), 0);

  // Get next due date (next subscription period)
  const nextDueDate = "Jan 1, 2026";

  const handlePayNow = () => {
    // In real app, this would redirect to Hubtel payment page
    const hubtelCheckoutUrl = "https://checkout.hubtel.com/YOUR_CHECKOUT_URL";
    console.log("Redirecting to Hubtel for payment...");
    
    // Mock alert for now
    alert(`Redirecting to Hubtel to pay GH₵ ${outstandingBalance.toFixed(2)}\n\nIn production, this will redirect to Hubtel's secure payment page.`);
    
    // Uncomment in production:
    // window.location.href = hubtelCheckoutUrl;
  };

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
          <h1 className={cn(gradientTextStyles.foreground)}>Home</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <PremiumStatCard value={3} label="Upcoming Events" variant="primary" />
          <PremiumStatCard value={7} label="Songs to Learn" variant="secondary" />
          <PremiumStatCard value="95%" label="Attendance Rate" variant="pink" />
          <PremiumStatCard value="Active" label="Subscription" variant="blue" />
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

        {/* Announcements */}
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

        {/* Attendance & Subscriptions */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className={cn(cardBaseStyle, "bg-gradient-to-br from-[#5A1E6E]/5 to-[#5A1E6E]/10 shadow-lg shadow-[#5A1E6E]/5")}>
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-6 w-6 text-[#5A1E6E]" />
              <h2 className="text-lg font-semibold">Attendance Summary</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">This Month</div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-4xl font-bold">8<span className="text-2xl text-muted-foreground">/9</span></div>
                  <div className="text-2xl font-bold text-green-600">89%</div>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-[89%] bg-green-500" />
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Rehearsals Attended</span>
                  <span className="font-semibold">38/40</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Performances</span>
                  <span className="font-semibold">12/12</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-muted-foreground">Overall Rate</span>
                  <span className="text-lg font-bold">95%</span>
                </div>
              </div>
            </div>
          </div>

          <div className={cn(cardBaseStyle, "bg-gradient-to-br from-green-500/5 to-green-500/10 shadow-lg shadow-green-500/5")}>
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="h-6 w-6 text-green-600" />
              <h2 className="text-lg font-semibold">Outstanding Subscriptions</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Total Balance</div>
                <div className="flex items-center justify-between mb-2">
                  <div className={cn(
                    "text-4xl font-bold",
                    outstandingBalance > 0 ? "text-[#F36A21]" : "text-green-600"
                  )}>
                    GH₵ {outstandingBalance.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2">
                    {outstandingBalance === 0 ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        All Paid Up
                      </div>
                    ) : (
                      <motion.div whileTap={{ scale: 0.96 }}>
                        <Button
                          onClick={handlePayNow}
                          variant="outline"
                          size="sm"
                          className="gap-1.5 rounded-lg border-[#F36A21]/20 text-[#F36A21] hover:bg-[#F36A21]/5 hover:border-[#F36A21]/30"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                          Pay Now
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                {mockMemberSubscriptions.slice(0, 2).map((sub) => {
                  const remainingBalance = sub.amount - sub.paidAmount;
                  return (
                    <div key={sub.id} className="flex items-center justify-between py-2 border-b border-border/40">
                      <div className="flex-1">
                        <div className="text-muted-foreground mb-1">{sub.planName}</div>
                        {remainingBalance > 0 && (
                          <div className="text-xs text-[#F36A21]">
                            Balance: GH₵ {remainingBalance.toFixed(2)}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 md:flex-row flex-col md:items-center items-end">
                        <span className="font-semibold">GH₵ {sub.paidAmount.toFixed(2)}</span>
                        <span className={cn(
                          "text-xs",
                          sub.status === "Fully Paid" ? "text-green-600" : "text-[#F2B705]"
                        )}>
                          {sub.status === "Fully Paid" ? "Paid" : "Partial"}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-muted-foreground">Next Due Date</span>
                  <span className="font-semibold text-[#F36A21]">{nextDueDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Schedule */}
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