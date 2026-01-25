"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Bell,
  Shield,
  KeyRound,
  Save,
  Loader2,
  Lock,
  CreditCard,
  Check,
} from "lucide-react";

import { ProfileForm } from "@/components/profile-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/components/ui/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useMySubscriptions } from "@/hooks/useSubscriptions";
import { SubscriptionCard } from "@/components/subscriptions/subscription-card";

function SecuritySettings() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Password & Security</h3>
        <p className="text-sm text-muted-foreground">
          Manage your password and security preferences.
        </p>
      </div>
      <Separator />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Current Password</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="current-password" type="password" className="pl-10" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="new-password" type="password" className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="confirm-password" type="password" className="pl-10" />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#5A1E6E] hover:bg-[#3D123F]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Password
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Choose what you want to be notified about.
        </p>
      </div>
      <Separator />
      <div className="space-y-4">
        {[
          {
            id: "email-marketing",
            label: "Marketing Emails",
            desc: "Receive emails about new features and special offers.",
          },
          {
            id: "email-social",
            label: "Social Notifications",
            desc: "Get notified when someone mentions you or replies to your comment.",
          },
          {
            id: "email-security",
            label: "Security Alerts",
            desc: "Receive emails about your account security and login attempts.",
          },
        ].map((item) => (
          <div key={item.id} className="flex items-start space-x-3">
            <Checkbox id={item.id} defaultChecked className="mt-1" />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor={item.id} className="font-medium">
                {item.label}
              </Label>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button className="bg-[#5A1E6E] hover:bg-[#3D123F]">
          Save Preferences
        </Button>
      </div>
    </div>
  );
}

function SubscriptionSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">My Subscriptions</h3>
        <p className="text-sm text-muted-foreground">
          View and manage your subscription payments.
        </p>
      </div>
      <Separator />

      {/* Import the widget to display subscriptions */}
      <SubscriptionsContent />
    </div>
  );
}

// Separate component to use hooks
function SubscriptionsContent() {
  const { subscriptions, isLoading, error, mutate } = useMySubscriptions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Failed to load subscriptions</p>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <CreditCard className="h-10 w-10 mx-auto mb-3 opacity-50" />
        <p>No subscriptions assigned to you yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {subscriptions.map((subscription) => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          showPayButton
          onPaymentInitiated={() => mutate()}
        />
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = React.useState("general");

  const tabs = [
    { id: "general", label: "General", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="flex flex-col flex-1 h-full space-y-6 p-4 md:flex-row md:space-x-12 md:space-y-0 md:p-8">
      <aside className="md:w-1/4 lg:w-1/5">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Settings
          </h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-2 md:flex md:flex-col md:gap-0 md:space-y-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              className={cn(
                "justify-start w-full",
                activeTab === tab.id
                  ? "bg-[#5A1E6E]/10 text-[#5A1E6E] hover:bg-[#5A1E6E]/20"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </nav>
      </aside>
      <div className="flex-1 lg:max-w-2xl">
        <div className="rounded-2xl border border-border/60 bg-card p-4 md:p-6 shadow-sm">
          {activeTab === "general" && <ProfileForm />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "subscription" && <SubscriptionSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
        </div>
      </div>
    </div>
  );
}
