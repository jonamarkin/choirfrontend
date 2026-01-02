"use client";

import * as React from "react";
import { User, Mail, Phone, MapPin, Camera, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function ProfileForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@vocalessence.com",
    phone: "+1 (555) 123-4567",
    address: "123 Choir Lane, Minneapolis, MN",
    role: "Administrator",
    voicePart: "Tenor",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Header Section with Avatar */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="relative group">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#5A1E6E] to-[#3D123F] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[#5A1E6E]/20">
            {formData.firstName[0]}
            {formData.lastName[0]}
          </div>
          <button className="absolute bottom-0 right-0 p-2 rounded-full bg-background border border-border shadow-sm hover:bg-accent transition-colors cursor-pointer">
            <Camera className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {formData.firstName} {formData.lastName}
          </h2>
          <p className="text-muted-foreground font-medium">
            {formData.role} • {formData.voicePart}
          </p>
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
                onChange={handleChange}
                className="pl-10"
              />
            </div>
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
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[140px] bg-[#5A1E6E] hover:bg-[#3D123F]"
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
