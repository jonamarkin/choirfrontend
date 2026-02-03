"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { authService } from "@/services/auth.service";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    email?: string;
    password?: string;
  }>({});
  const [rootError, setRootError] = React.useState<string | null>(null);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setRootError(null);

    try {
      const response = await authService.login({ email, password });
      
      if (response.code === 'account_inactive') {
        toast.error("Account inactive. Please verify your email.");
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
        return;
      }

      if (response.access) {
        router.push("/home");
      }
    } catch (error: unknown) {
      console.error("Login failed:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      setRootError(message);

      // Optional: Highlight fields if the error suggests invalid credentials
      if (
        message.toLowerCase().includes("invalid") ||
        message.toLowerCase().includes("credential")
      ) {
        setErrors({ email: " ", password: " " });
      }
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
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        className="pointer-events-none absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-[#F36A21]/15 to-transparent rounded-full blur-3xl"
      />

      {/* Login Card */}
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
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5A1E6E]/20 to-[#5A1E6E]/10 shadow-lg shadow-[#5A1E6E]/20 mb-4"
            >
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#5A1E6E] to-[#3D123F]" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-2"
            >
              VocalEssence
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-sm text-muted-foreground"
            >
              Sign in to your account
            </motion.p>
          </div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Error Alert */}
            {rootError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{rootError}</p>
              </motion.div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@vocalessence.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors({ ...errors, email: undefined });
                  }}
                  className={cn(
                    "pl-10 h-11 rounded-xl border-border/60 bg-background/60 backdrop-blur-sm",
                    "focus:border-primary/40 focus:ring-primary/20",
                    "transition-all duration-200",
                    errors.email &&
                    "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                  )}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors({ ...errors, password: undefined });
                  }}
                  className={cn(
                    "pl-10 pr-10 h-11 rounded-xl border-border/60 bg-background/60 backdrop-blur-sm",
                    "focus:border-primary/40 focus:ring-primary/20",
                    "transition-all duration-200",
                    errors.password &&
                    "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                  )}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  className="w-4 h-4 rounded border-border/60 bg-background text-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 cursor-pointer"
                  disabled={isLoading}
                />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.div whileTap={{ scale: isLoading ? 1 : 0.98 }}>
              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full h-11 rounded-xl shadow-lg shadow-primary/20",
                  "bg-gradient-to-br from-primary to-primary/90",
                  "hover:from-primary/90 hover:to-primary",
                  "transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>
          </motion.form>

          {/* Divider */}
          <div className="relative my-6">
            <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
              Or continue with
            </span>
          </div>

          {/* Social Login Options */}
          <motion.div whileTap={{ scale: 0.98 }}>
            <GoogleAuthButton className="w-full h-11 rounded-xl border-border/60 bg-background/60 backdrop-blur-sm hover:bg-accent/50 transition-all duration-200" />
          </motion.div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Sign up
            </Link>
          </div>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-6 text-center text-xs text-muted-foreground"
          >
            By signing in, you agree to our Terms of Service and Privacy Policy
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
