"use client";

import * as React from "react";
import {
  User,
  Mail,
  Phone,
  Camera,
  Loader2,
  Save,
  Shield,
  Music,
  Briefcase,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  Building,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { authService } from "@/services/auth.service";
import type {
  User as UserType,
  VoicePart,
  Gender,
  EmploymentStatus,
} from "@/types/auth";

// Dropdown options matching backend values
const VOICE_PART_OPTIONS: { label: string; value: VoicePart }[] = [
  { label: "Soprano", value: "soprano" },
  { label: "Alto", value: "alto" },
  { label: "Tenor", value: "tenor" },
  { label: "Bass", value: "bass" },
];

const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const EMPLOYMENT_STATUS_OPTIONS: { label: string; value: EmploymentStatus }[] = [
  { label: "Employed", value: "employed" },
  { label: "Self Employed", value: "self_employed" },
  { label: "Student", value: "student" },
  { label: "Unemployed", value: "unemployed" },
  { label: "Retired", value: "retired" },
];

interface FormData {
  // Basic info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  // Profile details
  memberPart: VoicePart | "";
  gender: Gender | "";
  dateOfBirth: string;
  denomination: string;
  address: string;
  // Employment
  employmentStatus: EmploymentStatus | "";
  occupation: string;
  employer: string;
  joinDate: string;
  // Emergency contact
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  memberPart: "",
  gender: "",
  dateOfBirth: "",
  denomination: "",
  address: "",
  employmentStatus: "",
  occupation: "",
  employer: "",
  joinDate: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactPhone: "",
};

function mapUserToFormData(user: UserType): FormData {
  return {
    firstName: user.first_name || "",
    lastName: user.last_name || "",
    email: user.email || "",
    phone: user.phone_number || "",
    role: formatRole(user.role),
    memberPart: user.member_part || "",
    gender: user.gender || "",
    dateOfBirth: user.date_of_birth || "",
    denomination: user.denomination || "",
    address: user.address || "",
    employmentStatus: user.employment_status || "",
    occupation: user.occupation || "",
    employer: user.employer || "",
    joinDate: user.join_date || "",
    emergencyContactName: user.emergency_contact_name || "",
    emergencyContactRelationship: user.emergency_contact_relationship || "",
    emergencyContactPhone: user.emergency_contact_phone || "",
  };
}

function formatRole(role: string): string {
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function ProfileForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(true);
  const [formData, setFormData] = React.useState<FormData>(initialFormData);
  const [originalData, setOriginalData] = React.useState<FormData>(initialFormData);

  // Collapsible sections state
  const [profileOpen, setProfileOpen] = React.useState(true);
  const [employmentOpen, setEmploymentOpen] = React.useState(false);
  const [emergencyOpen, setEmergencyOpen] = React.useState(false);

  // Fetch user data on mount
  React.useEffect(() => {
    async function fetchUser() {
      try {
        // Try from cache first for immediate display
        const cachedUser = authService.getCachedUser();
        if (cachedUser) {
          const data = mapUserToFormData(cachedUser);
          setFormData(data);
          setOriginalData(data);
        }

        // Fetch fresh data from API
        const user = await authService.getProfile();
        const data = mapUserToFormData(user);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

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
        // Profile details
        member_part: formData.memberPart || undefined,
        gender: formData.gender || undefined,
        date_of_birth: formData.dateOfBirth || undefined,
        denomination: formData.denomination || undefined,
        address: formData.address || undefined,
        // Employment
        employment_status: formData.employmentStatus || undefined,
        occupation: formData.occupation || undefined,
        employer: formData.employer || undefined,
        join_date: formData.joinDate || undefined,
        // Emergency contact
        emergency_contact_name: formData.emergencyContactName || undefined,
        emergency_contact_relationship: formData.emergencyContactRelationship || undefined,
        emergency_contact_phone: formData.emergencyContactPhone || undefined,
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
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="secondary"
              className="bg-[#5A1E6E]/10 text-[#5A1E6E]"
            >
              <Shield className="h-3 w-3 mr-1" />
              {formData.role}
            </Badge>
            {formData.memberPart && (
              <Badge variant="outline" className="capitalize">
                <Music className="h-3 w-3 mr-1" />
                {formData.memberPart}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground/80">
            Manage your personal information and preferences.
          </p>
        </div>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <User className="h-4 w-4" />
            Basic Information
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
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
        </div>

        {/* Profile Details Section */}
        <Collapsible open={profileOpen} onOpenChange={setProfileOpen}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-between w-full py-2 text-sm font-medium text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
            >
              <span className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                Profile Details
              </span>
              {profileOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="memberPart">Voice Part</Label>
                <Select
                  value={formData.memberPart}
                  onValueChange={(value) => handleSelectChange("memberPart", value)}
                >
                  <SelectTrigger id="memberPart">
                    <SelectValue placeholder="Select voice part" />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICE_PART_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="denomination">Denomination</Label>
                <Input
                  id="denomination"
                  name="denomination"
                  value={formData.denomination}
                  onChange={handleChange}
                  placeholder="e.g., Presbyterian"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Employment Section */}
        <Collapsible open={employmentOpen} onOpenChange={setEmploymentOpen}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-between w-full py-2 text-sm font-medium text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
            >
              <span className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Employment Details
              </span>
              {employmentOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employmentStatus">Employment Status</Label>
                <Select
                  value={formData.employmentStatus}
                  onValueChange={(value) => handleSelectChange("employmentStatus", value)}
                >
                  <SelectTrigger id="employmentStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employer">Employer</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="employer"
                    name="employer"
                    value={formData.employer}
                    onChange={handleChange}
                    placeholder="Company name"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="joinDate"
                    name="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Emergency Contact Section */}
        <Collapsible open={emergencyOpen} onOpenChange={setEmergencyOpen}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-between w-full py-2 text-sm font-medium text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
            >
              <span className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Emergency Contact
              </span>
              {emergencyOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Contact Name</Label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="emergencyContactName"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                <Input
                  id="emergencyContactRelationship"
                  name="emergencyContactRelationship"
                  value={formData.emergencyContactRelationship}
                  onChange={handleChange}
                  placeholder="e.g., Spouse, Parent"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    placeholder="+233 XXX XXX XXXX"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="flex justify-end pt-4">
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
