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
  const [isPaying, setIsPaying] = React.useState(false);
  const [isSubscribing, setIsSubscribing] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [subscribedPlanId, setSubscribedPlanId] = React.useState<string | null>(
    null
  );
  const [selectedPlanId, setSelectedPlanId] = React.useState("singing");

  const plans = [
    {
      id: "singing",
      name: "Singing Member",
      price: 120,
      interval: "year",
      description:
        "Full participation in all choir activities and performances.",
    },
    {
      id: "non-singing",
      name: "Non-Singing",
      price: 60,
      interval: "year",
      description: "Support the choir without performing.",
    },
    {
      id: "auxiliary",
      name: "Auxiliary",
      price: 40,
      interval: "year",
      description: "For temporary or seasonal support staff.",
    },
    {
      id: "diaspora",
      name: "Diaspora",
      price: 100,
      interval: "year",
      description: "For members living abroad.",
    },
    {
      id: "executive",
      name: "Executive",
      price: 200,
      interval: "year",
      description: "Premium membership with voting rights.",
    },
  ];

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const handlePayment = async () => {
    setIsPaying(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsPaying(false);
    setShowModal(false);
  };

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    // Simulate subscription update without payment
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubscribedPlanId(selectedPlanId);
    setIsSubscribing(false);
    setShowModal(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Subscription & Billing</h3>
          <p className="text-sm text-muted-foreground">
            Select a membership plan and manage your subscription.
          </p>
        </div>
        <Separator />

        {/* Plan Selection */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={cn(
                "relative cursor-pointer rounded-xl border p-4 transition-all duration-200",
                selectedPlanId === plan.id
                  ? "border-[#5A1E6E] bg-[#5A1E6E]/5 ring-1 ring-[#5A1E6E]"
                  : "border-border/60 bg-card hover:border-[#5A1E6E]/50 hover:bg-accent/50"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{plan.name}</h4>
                {selectedPlanId === plan.id && (
                  <div className="h-5 w-5 rounded-full bg-[#5A1E6E] flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <span className="text-2xl font-bold">${plan.price}</span>
                <span className="text-sm text-muted-foreground">
                  /{plan.interval}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {plan.description}
              </p>
            </div>
          ))}
        </div>

        {/* Selected Plan Summary & Payment */}
        <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Selected Plan
              </p>
              <h4 className="text-xl font-bold">{selectedPlan.name}</h4>
              <p className="text-sm text-muted-foreground">
                Total due:{" "}
                <span className="font-bold text-foreground">
                  ${selectedPlan.price}.00
                </span>
              </p>
            </div>
            <Button
              onClick={handleSubscribe}
              disabled={isSubscribing || subscribedPlanId === selectedPlan.id}
              className={cn(
                "min-w-[160px]",
                subscribedPlanId === selectedPlan.id
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-[#5A1E6E] hover:bg-[#3D123F]"
              )}
            >
              {isSubscribing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : subscribedPlanId === selectedPlan.id ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Subscribed
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Payment Method</h4>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-border/60 p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-14 items-center justify-center rounded bg-muted">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full sm:w-auto">
              Edit
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-xl sm:p-10"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mb-2 text-2xl font-bold">
                  Subscription Confirmed!
                </h3>
                <p className="mb-8 text-muted-foreground">
                  You have successfully subscribed to the{" "}
                  <span className="font-medium text-foreground">
                    {selectedPlan.name}
                  </span>{" "}
                  plan. Would you like to complete your payment now?
                </p>

                <div className="flex w-full flex-col gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="flex-1 h-11 rounded-xl"
                  >
                    Pay Later
                  </Button>
                  <Button
                    onClick={handlePayment}
                    disabled={isPaying}
                    className="flex-1 h-11 rounded-xl bg-[#5A1E6E] hover:bg-[#3D123F]"
                  >
                    {isPaying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay ${selectedPlan.price}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
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
              variant={activeTab === tab.id ? "secondary" : "ghost"}
              className={cn(
                "justify-start w-full",
                activeTab === tab.id && "bg-muted hover:bg-muted"
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
