"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Loader2, ArrowLeft, CheckCircle2, AlertCircle, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";

type Step = "request" | "verify";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>("request");
  
  // Form State
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  
  // UI State
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.requestPasswordReset({ email });
      toast.success(response.message || "OTP sent to your email");
      setStep("verify");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to request password reset";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.confirmPasswordReset({
        email,
        otp,
        new_password: password,
        new_password_confirm: confirmPassword,
      });

      setSuccessMessage(response.message || "Password reset successfully!");
      toast.success("Password reset successfully!");
      
      // Redirect after short delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to reset password";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-background overflow-hidden">
      {/* Background Gradients */}
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
            <div className="flex flex-col items-center mb-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5A1E6E]/20 to-[#5A1E6E]/10 shadow-lg shadow-[#5A1E6E]/20 mb-4"
                >
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#5A1E6E] to-[#3D123F]" />
                </motion.div>
                <h1 className="text-2xl font-bold tracking-tight mb-2">
                    {step === "request" ? "Forgot Password" : "Reset Password"}
                </h1>
                <p className="text-sm text-muted-foreground text-center">
                    {step === "request" 
                        ? "Enter your email to receive an OTP code" 
                        : "Enter the OTP code and your new password"}
                </p>
            </div>

            {successMessage ? (
                <div className="text-center space-y-4">
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 flex flex-col items-center gap-2">
                        <CheckCircle2 className="h-8 w-8" />
                        <p className="font-medium">{successMessage}</p>
                        <p className="text-sm opacity-90">Redirecting to login...</p>
                    </div>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    {step === "request" ? (
                        <motion.form 
                            key="request-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleRequestSubmit} 
                            className="space-y-4"
                        >
                            {error && (
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="john@example.com"
                                        className="pl-10 rounded-xl"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP Code"}
                            </Button>
                        </motion.form>
                    ) : (
                        <motion.form 
                            key="verify-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleConfirmSubmit} 
                            className="space-y-4"
                        >
                            {error && (
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="otp">OTP Code</Label>
                                <Input 
                                    id="otp" 
                                    type="text" 
                                    value={otp} 
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="e.g. 123456"
                                    className="text-center text-lg tracking-widest rounded-xl"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                                    <Input 
                                        id="password" 
                                        type={showPassword ? "text" : "password"}
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="New password"
                                        className="pl-10 pr-10 rounded-xl"
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                                    <Input 
                                        id="confirmPassword" 
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm password"
                                        className="pl-10 pr-10 rounded-xl"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset Password"}
                            </Button>
                            
                            <button
                                type="button"
                                onClick={() => setStep("request")}
                                className="w-full text-center text-sm text-muted-foreground hover:text-foreground underline"
                            >
                                Change email
                            </button>

                        </motion.form>
                    )}
                </AnimatePresence>
            )}

            <div className="mt-6 text-center text-sm text-muted-foreground">
                <Link href="/login" className="hover:text-foreground flex items-center justify-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Login
                </Link>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
