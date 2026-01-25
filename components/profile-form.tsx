"use client";

import * as React from "react";
import { User, Mail, Phone, Camera, Loader2, Save, Shield } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/services/auth.service";

export function ProfileForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(true);
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
  });
  const [originalData, setOriginalData] = React.useState(formData);

  // Fetch user data on mount
  React.useEffect(() => {
    async function fetchUser() {
      try {
        // Try from cache first for immediate display
        const cachedUser = authService.getCachedUser();
        if (cachedUser) {
          const data = {
            firstName: cachedUser.first_name || "",
            lastName: cachedUser.last_name || "",
            email: cachedUser.email || "",
            phone: cachedUser.phone_number || "",
            role: formatRole(cachedUser.role),
          };
          setFormData(data);
          setOriginalData(data);
        }

        // Fetch fresh data from API
        const user = await authService.getProfile();
        const data = {
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          email: user.email || "",
          phone: user.phone_number || "",
          role: formatRole(user.role),
        };
        setFormData(data);
        setOriginalData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsFetching(false);
      }
    }

    fetchUser();
  }, []);

  function formatRole(role: string): string {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const hasChanges =
    formData.firstName !== originalData.firstName ||
    formData.lastName !== originalData.lastName ||
    formData.phone !== originalData.phone;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) {
      toast.info("No changes to save.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phone,
      });

      // Update original data to reflect saved state
      setOriginalData({ ...formData });

      toast.success("Profile updated successfully!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#5A1E6E]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section with Avatar */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="relative group">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#5A1E6E] to-[#3D123F] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[#5A1E6E]/20">
            {formData.firstName[0] || "U"}
            {formData.lastName[0] || ""}
          </div>
          <button
            type="button"
            className="absolute bottom-0 right-0 p-2 rounded-full bg-background border border-border shadow-sm hover:bg-accent transition-colors cursor-pointer"
          >
            <Camera className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {formData.firstName} {formData.lastName}
          </h2>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-[#5A1E6E]/10 text-[#5A1E6E]"
            >
              <Shield className="h-3 w-3 mr-1" />
              {formData.role}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground/80">
            Manage your personal information and preferences.
          </p>
        </div>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled
                className="pl-10 bg-muted/50 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Email cannot be changed.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+233 XXX XXX XXXX"
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading || !hasChanges}
            className="min-w-[140px] bg-[#5A1E6E] hover:bg-[#3D123F] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
