"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Loader2, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";

  const [email, setEmail] = React.useState(defaultEmail);
  const [otp, setOtp] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authService.verifyEmail({ email, otp });
      // Show success and redirect
      setSuccess("Email verified successfully!");
      toast.success("Email verified successfully! You can now login.");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Verification failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError("Please enter your email address to resend OTP");
      return;
    }

    setIsResending(true);
    setError(null);
    setSuccess(null);

    try {
      await authService.resendOtp({ email });
      setSuccess("OTP resent successfully. Please check your email.");
      toast.success("OTP resent successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to resend OTP";
      setError(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-background overflow-hidden">
      {/* Background Gradients (Same as Login) */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_circle_at_35%_20%,rgba(90,30,110,0.12),transparent_55%),radial-gradient(1000px_circle_at_70%_80%,rgba(243,106,33,0.08),transparent_50%),radial-gradient(800px_circle_at_10%_90%,rgba(242,183,5,0.06),transparent_45%)]" />

      {/* Animated Background Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="pointer-events-none absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-[#5A1E6E]/20 to-transparent rounded-full blur-3xl"
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
            "relative w-full max-w-md",
            "rounded-3xl border border-border/60",
            "bg-gradient-to-b from-background/95 to-background/85 backdrop-blur-xl",
            "shadow-[0_20px_70px_-15px_rgba(90,30,110,0.4)]",
            "overflow-hidden"
        )}
      >
        <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center mb-8">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5A1E6E]/20 to-[#5A1E6E]/10 shadow-lg shadow-[#5A1E6E]/20 mb-4"
                >
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#5A1E6E] to-[#3D123F]" />
                </motion.div>
                <h1 className="text-2xl font-bold tracking-tight mb-2">Verify Email</h1>
                <p className="text-sm text-muted-foreground text-center">
                    Enter the OTP sent to <strong>{email || "your email"}</strong>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}
                {success && (
                    <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-500 text-sm">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <p>{success}</p>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="rounded-xl"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="otp">One-Time Password (OTP)</Label>
                    <Input 
                        id="otp" 
                        type="text" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        className="rounded-xl text-center text-lg tracking-widest"
                        maxLength={6}
                        required
                    />
                </div>

                <Button 
                    type="submit" 
                    className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Login"}
                </Button>

                <div className="text-center">
                     <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isResending}
                        className="text-sm text-primary hover:underline flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                     >
                        {isResending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                        Resend OTP
                     </button>
                </div>
                
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    <Link href="/login" className="hover:text-foreground">Back to Login</Link>
                </div>
            </form>
        </div>
      </motion.div>
    </div>
  );
}

function VerifyOtpFallback() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-background overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_circle_at_35%_20%,rgba(90,30,110,0.12),transparent_55%),radial-gradient(1000px_circle_at_70%_80%,rgba(243,106,33,0.08),transparent_50%),radial-gradient(800px_circle_at_10%_90%,rgba(242,183,5,0.06),transparent_45%)]" />
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <React.Suspense fallback={<VerifyOtpFallback />}>
      <VerifyOtpContent />
    </React.Suspense>
  );
}
