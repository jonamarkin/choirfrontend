"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  Pencil,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Save,
  X as XIcon,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Cake,
  Heart,
  User,
  Church,
  Check,
  Loader2,
  Search,
  Filter,
  X,
} from "lucide-react";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PremiumStatCard } from "@/components/premium-stat-card";
import { PremiumBadge } from "@/components/premium-badge";
import {
  tableContainerStyle,
  tableHeaderRowStyle,
  tableHeaderCellStyle,
  paginationActiveStyle,
  paginationInactiveStyle,
  buttonStyles,
  gradientTextStyles,
} from "@/utils/premium-styles";

interface Member {
  id: string;
  name: string;
  role: string;
  executive: boolean;
  part: "Soprano" | "Alto" | "Tenor" | "Bass" | "Keyboardist" | "Drummer" | "Horns" | "Music Director";
  email?: string;
  phone?: string;
  joinDate?: string;
  address?: string;
  status?: "Active" | "Inactive";
  dateOfBirth?: string;
  denomination?: string;
  employmentStatus?: "Employed" | "Student" | "Self-Employed" | "Retired" | "Other";
  occupation?: string;
  employer?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
}

const mockMembers: Member[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Choir Director",
    executive: true,
    part: "Soprano",
    email: "sarah.j@vocalessence.org",
    phone: "+1 (555) 123-4567",
    joinDate: "2020-01-15",
    address: "123 Music Lane, Harmony City",
    status: "Active",
    dateOfBirth: "1985-05-20",
    denomination: "Methodist",
    employmentStatus: "Employed",
    occupation: "Music Teacher",
    employer: "Harmony School",
    emergencyContactName: "James Johnson",
    emergencyContactRelationship: "Spouse",
    emergencyContactPhone: "+1 (555) 123-4568",
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Section Leader",
    executive: true,
    part: "Tenor",
    email: "michael.c@vocalessence.org",
    phone: "+1 (555) 234-5678",
    joinDate: "2020-03-22",
    address: "456 Melody Ave, Harmony City",
    status: "Active",
    dateOfBirth: "1978-08-12",
    denomination: "Non-Denominational",
    employmentStatus: "Self-Employed",
    occupation: "Freelance Musician",
    employer: "None",
    emergencyContactName: "Lisa Chen",
    emergencyContactRelationship: "Spouse",
    emergencyContactPhone: "+1 (555) 234-5679",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Member",
    executive: false,
    part: "Alto",
    email: "emily.r@vocalessence.org",
    phone: "+1 (555) 345-6789",
    joinDate: "2021-09-10",
    address: "789 Chorus St, Harmony City",
    status: "Active",
    dateOfBirth: "1992-03-25",
    denomination: "Catholic",
    employmentStatus: "Student",
    occupation: "Music Student",
    employer: "Harmony College",
    emergencyContactName: "Maria Rodriguez",
    emergencyContactRelationship: "Mother",
    emergencyContactPhone: "+1 (555) 345-6790",
  },
  {
    id: "4",
    name: "David Thompson",
    role: "Treasurer",
    executive: true,
    part: "Bass",
    email: "david.t@vocalessence.org",
    phone: "+1 (555) 456-7890",
    joinDate: "2019-11-05",
    address: "321 Harmony Blvd, Harmony City",
    status: "Active",
    dateOfBirth: "1965-07-18",
    denomination: "Presbyterian",
    employmentStatus: "Retired",
    occupation: "Retired Musician",
    employer: "None",
    emergencyContactName: "Margaret Thompson",
    emergencyContactRelationship: "Spouse",
    emergencyContactPhone: "+1 (555) 456-7891",
  },
  {
    id: "5",
    name: "Jessica Martinez",
    role: "Member",
    executive: false,
    part: "Soprano",
    email: "jessica.m@vocalessence.org",
    phone: "+1 (555) 567-8901",
    joinDate: "2022-01-20",
    address: "654 Song Circle, Harmony City",
    status: "Active",
    dateOfBirth: "1988-11-30",
    denomination: "Baptist",
    employmentStatus: "Employed",
    occupation: "Musician",
    employer: "Harmony Orchestra",
    emergencyContactName: "Carlos Martinez",
    emergencyContactRelationship: "Brother",
    emergencyContactPhone: "+1 (555) 567-8902",
  },
  {
    id: "6",
    name: "Robert Wilson",
    role: "Secretary",
    executive: true,
    part: "Bass",
    email: "robert.w@vocalessence.org",
    phone: "+1 (555) 678-9012",
    joinDate: "2020-06-15",
    address: "987 Note Drive, Harmony City",
    status: "Active",
    dateOfBirth: "1974-04-05",
    denomination: "Anglican",
    employmentStatus: "Employed",
    occupation: "Music Administrator",
    employer: "Harmony Choir",
    emergencyContactName: "Helen Wilson",
    emergencyContactRelationship: "Spouse",
    emergencyContactPhone: "+1 (555) 678-9013",
  },
  {
    id: "7",
    name: "Amanda Lee",
    role: "Member",
    executive: false,
    part: "Alto",
    email: "amanda.l@vocalessence.org",
    phone: "+1 (555) 789-0123",
    joinDate: "2021-04-08",
    address: "147 Rhythm Road, Harmony City",
    status: "Active",
    dateOfBirth: "1990-09-15",
    denomination: "Pentecostal",
    employmentStatus: "Student",
    occupation: "Music Student",
    employer: "Harmony College",
    emergencyContactName: "Jennifer Lee",
    emergencyContactRelationship: "Mother",
    emergencyContactPhone: "+1 (555) 789-0124",
  },
  {
    id: "8",
    name: "Christopher Brown",
    role: "Member",
    executive: false,
    part: "Tenor",
    email: "chris.b@vocalessence.org",
    phone: "+1 (555) 890-1234",
    joinDate: "2022-08-30",
    address: "258 Tune Terrace, Harmony City",
    status: "Active",
    dateOfBirth: "1982-06-28",
    denomination: "Lutheran",
    employmentStatus: "Employed",
    occupation: "Musician",
    employer: "Harmony Orchestra",
    emergencyContactName: "Susan Brown",
    emergencyContactRelationship: "Sister",
    emergencyContactPhone: "+1 (555) 890-1235",
  },
  {
    id: "9",
    name: "Sophia Davis",
    role: "Member",
    executive: false,
    part: "Soprano",
    email: "sophia.d@vocalessence.org",
    phone: "+1 (555) 901-2345",
    joinDate: "2023-02-14",
    address: "369 Harmony Heights, Harmony City",
    status: "Active",
    dateOfBirth: "1995-01-10",
    denomination: "Non-Denominational",
    employmentStatus: "Employed",
    occupation: "Musician",
    employer: "Harmony Orchestra",
    emergencyContactName: "Emma Davis",
    emergencyContactRelationship: "Mother",
    emergencyContactPhone: "+1 (555) 901-2346",
  },
  {
    id: "10",
    name: "Daniel Martinez",
    role: "Assistant Director",
    executive: true,
    part: "Bass",
    email: "daniel.m@vocalessence.org",
    phone: "+1 (555) 012-3456",
    joinDate: "2020-08-01",
    address: "741 Music Boulevard, Harmony City",
    status: "Active",
    dateOfBirth: "1970-12-01",
    denomination: "Catholic",
    employmentStatus: "Employed",
    occupation: "Music Director",
    employer: "Harmony Choir",
    emergencyContactName: "Rosa Martinez",
    emergencyContactRelationship: "Spouse",
    emergencyContactPhone: "+1 (555) 012-3457",
  },
  {
    id: "11",
    name: "Olivia Taylor",
    role: "Member",
    executive: false,
    part: "Alto",
    email: "olivia.t@vocalessence.org",
    phone: "+1 (555) 123-4568",
    joinDate: "2022-05-20",
    address: "852 Song Street, Harmony City",
    status: "Active",
    dateOfBirth: "1993-07-22",
    denomination: "Methodist",
    employmentStatus: "Student",
    occupation: "Music Student",
    employer: "Harmony College",
    emergencyContactName: "William Taylor",
    emergencyContactRelationship: "Father",
    emergencyContactPhone: "+1 (555) 123-4569",
  },
  {
    id: "12",
    name: "James Anderson",
    role: "Member",
    executive: false,
    part: "Tenor",
    email: "james.a@vocalessence.org",
    phone: "+1 (555) 234-5679",
    joinDate: "2021-11-12",
    address: "963 Chorus Court, Harmony City",
    status: "Active",
    dateOfBirth: "1986-02-14",
    denomination: "Baptist",
    employmentStatus: "Employed",
    occupation: "Musician",
    employer: "Harmony Orchestra",
    emergencyContactName: "Sarah Anderson",
    emergencyContactRelationship: "Spouse",
    emergencyContactPhone: "+1 (555) 234-5680",
  },
  {
    id: "13",
    name: "Patricia Wilson",
    role: "Member",
    executive: false,
    part: "Soprano",
    email: "patricia.w@vocalessence.org",
    phone: "+1 (555) 345-6780",
    joinDate: "2021-03-15",
    address: "159 Melody Lane, Harmony City",
    status: "Inactive",
    dateOfBirth: "1989-04-06",
    denomination: "Presbyterian",
    employmentStatus: "Employed",
    occupation: "Musician",
    employer: "Harmony Orchestra",
    emergencyContactName: "Thomas Wilson",
    emergencyContactRelationship: "Spouse",
    emergencyContactPhone: "+1 (555) 345-6781",
  },
  {
    id: "14",
    name: "Richard Harris",
    role: "Member",
    executive: false,
    part: "Bass",
    email: "richard.h@vocalessence.org",
    phone: "+1 (555) 456-7891",
    joinDate: "2020-09-22",
    address: "357 Harmony Street, Harmony City",
    status: "Inactive",
    dateOfBirth: "1975-08-29",
    denomination: "Evangelical Free Church",
    employmentStatus: "Retired",
    occupation: "Retired Musician",
    employer: "None",
    emergencyContactName: "Dorothy Harris",
    emergencyContactRelationship: "Spouse",
    emergencyContactPhone: "+1 (555) 456-7892",
  },
  {
    id: "15",
    name: "Linda Garcia",
    role: "Section Leader",
    executive: true,
    part: "Alto",
    email: "linda.g@vocalessence.org",
    phone: "+1 (555) 567-8902",
    joinDate: "2019-05-10",
    address: "753 Song Avenue, Harmony City",
    status: "Inactive",
    dateOfBirth: "1980-11-17",
    denomination: "Anglican",
    employmentStatus: "Employed",
    occupation: "Music Administrator",
    employer: "Harmony Choir",
    emergencyContactName: "Pedro Garcia",
    emergencyContactRelationship: "Spouse",
    emergencyContactPhone: "+1 (555) 567-8903",
  },
];

const voiceParts = ["Soprano", "Alto", "Tenor", "Bass", "Keyboardist", "Drummer", "Horns", "Music Director"] as const;
const roles = [
  "Member",
  "Section Leader",
  "Choir Director",
  "Assistant Director",
  "Treasurer",
  "Secretary",
] as const;
const denominations = [
  "Catholic",
  "Baptist",
  "Methodist",
  "Presbyterian",
  "Lutheran",
  "Pentecostal",
  "Anglican",
  "Non-Denominational",
  "Other",
] as const;

const ITEMS_PER_PAGE = 8;

export default function Members() {
  const [members, setMembers] = React.useState<Member[]>(mockMembers);
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(
    null
  );
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedMember, setEditedMember] = React.useState<Member | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [customDenomination, setCustomDenomination] = React.useState("");
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "success">("idle");
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterPart, setFilterPart] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [filterRole, setFilterRole] = React.useState<string>("all");

  // Add member state
  const [isAddingMember, setIsAddingMember] = React.useState(false);
  const [newMember, setNewMember] = React.useState<Member>({
    id: "",
    name: "",
    role: "Member",
    executive: false,
    part: "Soprano",
    email: "",
    phone: "",
    joinDate: new Date().toISOString().split("T")[0],
    address: "",
    status: "Active",
    dateOfBirth: "",
    denomination: "",
    employmentStatus: "Employed",
    occupation: "",
    employer: "",
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
  });
  const [newMemberCustomDenomination, setNewMemberCustomDenomination] = React.useState("");

  // Ref for the scrollable drawer content
  const drawerContentRef = React.useRef<HTMLDivElement>(null);
  const addMemberContentRef = React.useRef<HTMLDivElement>(null);

  // Reset scroll position when drawer opens or mode changes
  React.useEffect(() => {
    // Only scroll if drawer is open (selectedMember exists)
    if (selectedMember && drawerContentRef.current) {
      // Use setTimeout to ensure content is fully rendered
      const timeoutId = setTimeout(() => {
        if (drawerContentRef.current) {
          drawerContentRef.current.scrollTop = 0;
        }
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedMember?.id, isEditing]); // Use selectedMember.id to trigger on different members

  // Filter and search members
  const filteredMembers = React.useMemo(() => {
    return members.filter((member) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        member.name.toLowerCase().includes(searchLower) ||
        member.email?.toLowerCase().includes(searchLower) ||
        member.phone?.toLowerCase().includes(searchLower) ||
        member.role.toLowerCase().includes(searchLower);

      // Part filter
      const matchesPart = filterPart === "all" || member.part === filterPart;

      // Status filter
      const matchesStatus =
        filterStatus === "all" || (member.status || "Active") === filterStatus;

      // Role filter
      const matchesRole =
        filterRole === "all" ||
        (filterRole === "executive" && member.executive) ||
        (filterRole === "member" && !member.executive);

      return matchesSearch && matchesPart && matchesStatus && matchesRole;
    });
  }, [members, searchQuery, filterPart, filterStatus, filterRole]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  // Reset to page 1 when items per page changes or filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchQuery, filterPart, filterStatus, filterRole]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterPart("all");
    setFilterStatus("all");
    setFilterRole("all");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    filterPart !== "all" ||
    filterStatus !== "all" ||
    filterRole !== "all";

  const handleViewDetails = (member: Member) => {
    setSelectedMember(member);
    setEditedMember({ ...member });
    // Check if denomination is a custom value (not in the predefined list)
    const isCustom = member.denomination && !denominations.slice(0, -1).includes(member.denomination as any);
    if (isCustom && member.denomination) {
      setCustomDenomination(member.denomination);
    } else {
      setCustomDenomination("");
    }
    setIsEditing(false);
  };

  const handleCloseSheet = () => {
    setSelectedMember(null);
    setEditedMember(null);
    setCustomDenomination("");
    setIsEditing(false);
    setSaveStatus("idle");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSaveStatus("idle");
  };

  const handleSave = async () => {
    if (editedMember) {
      // Set to saving state
      setSaveStatus("saving");
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update members
      setMembers((prev) =>
        prev.map((m) => (m.id === editedMember.id ? editedMember : m))
      );
      setSelectedMember(editedMember);
      
      // Set to success state
      setSaveStatus("success");
      
      // Wait a bit to show success state, then close edit mode
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsEditing(false);
      setSaveStatus("idle");
    }
  };

  const handleCancel = () => {
    if (selectedMember) {
      setEditedMember({ ...selectedMember });
    }
    setIsEditing(false);
    setSaveStatus("idle");
  };

  const handleOpenAddMember = () => {
    setIsAddingMember(true);
    setNewMember({
      id: "",
      name: "",
      role: "Member",
      executive: false,
      part: "Soprano",
      email: "",
      phone: "",
      joinDate: new Date().toISOString().split("T")[0],
      address: "",
      status: "Active",
      dateOfBirth: "",
      denomination: "",
      employmentStatus: "Employed",
      occupation: "",
      employer: "",
      emergencyContactName: "",
      emergencyContactRelationship: "",
      emergencyContactPhone: "",
    });
    setNewMemberCustomDenomination("");
  };

  const handleCloseAddMember = () => {
    setIsAddingMember(false);
    setNewMember({
      id: "",
      name: "",
      role: "Member",
      executive: false,
      part: "Soprano",
      email: "",
      phone: "",
      joinDate: new Date().toISOString().split("T")[0],
      address: "",
      status: "Active",
      dateOfBirth: "",
      denomination: "",
      employmentStatus: "Employed",
      occupation: "",
      employer: "",
      emergencyContactName: "",
      emergencyContactRelationship: "",
      emergencyContactPhone: "",
    });
    setNewMemberCustomDenomination("");
    setSaveStatus("idle");
  };

  const handleAddMember = async () => {
    if (newMember.name.trim() === "") {
      return;
    }

    setSaveStatus("saving");
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Generate new ID
    const newId = (Math.max(...members.map((m) => parseInt(m.id))) + 1).toString();
    
    // Add member to list
    const memberToAdd = { ...newMember, id: newId };
    setMembers((prev) => [...prev, memberToAdd]);
    
    setSaveStatus("success");
    
    // Wait a bit to show success, then close
    await new Promise((resolve) => setTimeout(resolve, 800));
    handleCloseAddMember();
  };

  const getPartColor = (part: string) => {
    switch (part) {
      case "Soprano":
        return "bg-gradient-to-br from-rose-500/15 to-rose-600/20 text-rose-700 dark:text-rose-300 shadow-sm shadow-rose-500/10";
      case "Alto":
        return "bg-gradient-to-br from-[#5A1E6E]/15 to-[#5A1E6E]/20 text-[#5A1E6E] dark:text-[#9F7FB8] shadow-sm shadow-[#5A1E6E]/10";
      case "Tenor":
        return "bg-gradient-to-br from-[#F36A21]/15 to-[#F36A21]/20 text-[#F36A21] dark:text-[#FF8F5E] shadow-sm shadow-[#F36A21]/10";
      case "Bass":
        return "bg-gradient-to-br from-[#3D123F]/15 to-[#3D123F]/20 text-[#3D123F] dark:text-[#8B6B8E] shadow-sm shadow-[#3D123F]/10";
      default:
        return "bg-gradient-to-br from-gray-500/15 to-gray-600/20 text-gray-700 dark:text-gray-300 shadow-sm shadow-gray-500/10";
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="ml-0 md:ml-0 pl-14 md:pl-0">
          <h1 className="tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">Members</h1>
        </div>
        <motion.div whileTap={{ scale: 0.96 }}>
          <Button 
            onClick={handleOpenAddMember}
            className="gap-2 rounded-xl shadow-lg shadow-primary/10 bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
          >
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>
        </motion.div>
      </div>

      {/* Stats Cards - Ultra Minimal */}
      <div className="grid gap-6 md:grid-cols-4">
        <PremiumStatCard
          value={filteredMembers.length}
          label="Members"
          variant="primary"
        />
        <PremiumStatCard
          value={filteredMembers.filter((m) => m.executive).length}
          label="Executive"
          variant="secondary"
        />
        <PremiumStatCard
          value={
            filteredMembers.filter((m) => m.part === "Soprano" || m.part === "Alto")
              .length
          }
          label="Soprano/Alto"
          variant="pink"
        />
        <PremiumStatCard
          value={
            filteredMembers.filter((m) => m.part === "Tenor" || m.part === "Bass")
              .length
          }
          label="Tenor/Bass"
          variant="blue"
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email, phone, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 h-9 rounded-xl bg-background/60 backdrop-blur-sm border-border/40 focus:border-primary/40 shadow-sm"
          />
        </div>

        {/* Filter Options */}
        <div className="flex gap-3">
          <Select value={filterPart} onValueChange={setFilterPart}>
            <SelectTrigger className="w-[160px] h-9 rounded-xl bg-background/60 backdrop-blur-sm border-border/40">
              <SelectValue placeholder="Member Part" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Parts</SelectItem>
              <SelectItem value="Soprano">Soprano</SelectItem>
              <SelectItem value="Alto">Alto</SelectItem>
              <SelectItem value="Tenor">Tenor</SelectItem>
              <SelectItem value="Bass">Bass</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px] h-9 rounded-xl bg-background/60 backdrop-blur-sm border-border/40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[160px] h-9 rounded-xl bg-background/60 backdrop-blur-sm border-border/40">
              <SelectValue placeholder="Role Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="executive">Executive</SelectItem>
              <SelectItem value="member">Members Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Premium Minimal Table */}
      <div
        className={cn(
          "rounded-2xl bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-sm overflow-hidden shadow-lg shadow-primary/5 flex flex-col",
          tableContainerStyle
        )}
      >
        <div 
          className="overflow-x-auto overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-muted/20 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-primary/40" 
          style={{ minHeight: "calc(100vh - 370px)", maxHeight: "calc(100vh - 370px)" }}
        >
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow className="border-border/20 hover:bg-transparent">
                <TableHead className="h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[200px]">
                  Name
                </TableHead>
                <TableHead className="hidden sm:table-cell h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[180px]">
                  Role
                </TableHead>
                <TableHead className="h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[130px]">
                  Member Part
                </TableHead>
                <TableHead className="hidden md:table-cell h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[110px]">
                  Status
                </TableHead>
                <TableHead className="h-10 px-3 md:px-6 text-center text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[140px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody style={{ minHeight: `${itemsPerPage * 40}px` }}>
              {currentMembers.map((member, index) => (
                <TableRow
                  key={member.id}
                  className={cn(
                    "border-border/20 transition-all duration-200",
                    "hover:bg-accent/30",
                    index === currentMembers.length - 1 && "border-0"
                  )}
                >
                  <TableCell className="py-1.5 px-3 md:px-6 w-[200px]">
                    <div className="font-medium text-[15px] text-foreground">
                      {member.name}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell py-1.5 px-3 md:px-6 w-[180px]">
                    <div className="text-[14px] text-muted-foreground">
                      {member.role}
                    </div>
                  </TableCell>
                  <TableCell className="py-1.5 px-3 md:px-6 w-[130px]">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "rounded-full px-3 py-0.5 text-[12px] font-medium",
                        getPartColor(member.part)
                      )}
                    >
                      {member.part}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell py-1.5 px-3 md:px-6 w-[110px]">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "rounded-full px-3 py-0.5 text-[12px] font-medium",
                        member.status === "Active"
                          ? "bg-gradient-to-br from-emerald-500/15 to-emerald-600/25 text-emerald-700 dark:text-emerald-400 shadow-sm shadow-emerald-500/10"
                          : "bg-gradient-to-br from-slate-500/15 to-slate-600/25 text-slate-600 dark:text-slate-400 shadow-sm shadow-slate-500/10"
                      )}
                    >
                      {member.status || "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-1.5 px-3 md:px-6 text-center w-[140px]">
                    <motion.div
                      whileTap={{ scale: 0.96 }}
                      className="inline-block"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 rounded-xl text-[13px] font-medium hover:bg-accent/50"
                        onClick={() => handleViewDetails(member)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </motion.div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Premium Pagination */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border/20 px-8 py-2 bg-background/20">
          <div className="flex items-center gap-4">
            <div className="text-[13px] text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {filteredMembers.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredMembers.length)}
              </span>{" "}
              of <span className="font-medium text-foreground">{filteredMembers.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-muted-foreground">Items per page:</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-[80px] h-8 rounded-lg text-[13px] bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.div whileTap={{ scale: 0.96 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="rounded-xl gap-2 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            </motion.div>
            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <motion.button
                    key={page}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "h-9 w-9 rounded-lg text-[13px] font-medium transition-all duration-200",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                      page === currentPage
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {page}
                  </motion.button>
                )
              )}
            </div>
            <motion.div whileTap={{ scale: 0.96 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="rounded-xl gap-2 disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Details Sheet */}
      <Sheet open={!!selectedMember} onOpenChange={handleCloseSheet}>
        <SheetContent className="sm:max-w-[380px] p-0 flex flex-col">
          {/* Visually hidden but accessible title and description */}
          <SheetTitle className="sr-only">
            {isEditing ? "Edit Member" : "Member Details"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {isEditing
              ? "Update member information and save changes"
              : "View detailed information about this member"}
          </SheetDescription>

          {editedMember && (
            <div ref={drawerContentRef} className="flex flex-col h-full overflow-y-auto">
              {/* Header Section */}
              <div className="px-6 pt-8 pb-6 border-b border-border/20">
                {/* Member Name and Role */}
                <div className="space-y-1 mb-4">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {editedMember.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {editedMember.role}
                  </p>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      getPartColor(editedMember.part)
                    )}
                  >
                    {editedMember.part}
                  </Badge>
                  {editedMember.executive && (
                    <Badge
                      variant="secondary"
                      className="rounded-full px-3 py-1 text-xs font-medium bg-gradient-to-br from-[#F2B705]/15 to-[#F2B705]/25 text-[#F2B705] shadow-sm shadow-[#F2B705]/10"
                    >
                      Executive
                    </Badge>
                  )}
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      editedMember.status === "Active"
                        ? "bg-gradient-to-br from-emerald-500/15 to-emerald-600/25 text-emerald-700 dark:text-emerald-400 shadow-sm shadow-emerald-500/10"
                        : "bg-gradient-to-br from-slate-500/15 to-slate-600/25 text-slate-600 dark:text-slate-400 shadow-sm shadow-slate-500/10"
                    )}
                  >
                    {editedMember.status || "Active"}
                  </Badge>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="edit-mode"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {/* Edit Mode */}
                      <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Basic Information
                          </h3>

                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm">Full Name</Label>
                            <Input
                              id="name"
                              value={editedMember.name}
                              onChange={(e) =>
                                setEditedMember({ ...editedMember, name: e.target.value })
                              }
                              className="rounded-xl border-border/60"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="role" className="text-sm">Role</Label>
                            <Select
                              value={editedMember.role}
                              onValueChange={(value) =>
                                setEditedMember({ ...editedMember, role: value })
                              }
                            >
                              <SelectTrigger className="rounded-xl border-border/60">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {roles.map((role) => (
                                  <SelectItem key={role} value={role}>
                                    {role}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="part" className="text-sm">Member Part</Label>
                            <Select
                              value={editedMember.part}
                              onValueChange={(value: any) =>
                                setEditedMember({ ...editedMember, part: value })
                              }
                            >
                              <SelectTrigger className="rounded-xl border-border/60">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {voiceParts.map((part) => (
                                  <SelectItem key={part} value={part}>
                                    {part}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3.5 bg-muted/20">
                            <div className="space-y-0.5">
                              <Label htmlFor="executive" className="text-sm font-medium">Executive Member</Label>
                              <div className="text-xs text-muted-foreground">
                                Member of the executive team
                              </div>
                            </div>
                            <Switch
                              id="executive"
                              checked={editedMember.executive}
                              onCheckedChange={(checked) =>
                                setEditedMember({ ...editedMember, executive: checked })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="status" className="text-sm">Status</Label>
                            <Select
                              value={editedMember.status || "Active"}
                              onValueChange={(value: any) =>
                                setEditedMember({ ...editedMember, status: value })
                              }
                            >
                              <SelectTrigger className="rounded-xl border-border/60">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                        {/* Personal Details */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Personal Details
                          </h3>

                          <div className="space-y-2">
                            <Label htmlFor="dateOfBirth" className="text-sm">
                              Date of Birth
                            </Label>
                            <div className="relative">
                              <Input
                                id="dateOfBirth"
                                type="date"
                                value={editedMember.dateOfBirth || ""}
                                onChange={(e) =>
                                  setEditedMember({ ...editedMember, dateOfBirth: e.target.value })
                                }
                                className="rounded-xl border-border/60 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-datetime-edit]:text-foreground [&::-webkit-datetime-edit-fields-wrapper]:text-foreground"
                                style={{
                                  colorScheme: 'light'
                                }}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="denomination" className="text-sm">
                              Denomination
                            </Label>
                            <Select
                              value={
                                editedMember.denomination && denominations.slice(0, -1).includes(editedMember.denomination as any)
                                  ? editedMember.denomination
                                  : editedMember.denomination
                                  ? "Other"
                                  : ""
                              }
                              onValueChange={(value) => {
                                if (value === "Other") {
                                  setEditedMember({ ...editedMember, denomination: customDenomination || "" });
                                } else {
                                  setEditedMember({ ...editedMember, denomination: value });
                                  setCustomDenomination("");
                                }
                              }}
                            >
                              <SelectTrigger className="rounded-xl border-border/60">
                                <SelectValue placeholder="Select denomination" />
                              </SelectTrigger>
                              <SelectContent>
                                {denominations.map((denom) => (
                                  <SelectItem key={denom} value={denom}>
                                    {denom}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {(editedMember.denomination === "Other" || 
                            (editedMember.denomination && !denominations.slice(0, -1).includes(editedMember.denomination as any))) && (
                            <div className="space-y-2">
                              <Label htmlFor="customDenomination" className="text-sm">
                                Specify Denomination
                              </Label>
                              <Input
                                id="customDenomination"
                                placeholder="Enter denomination name"
                                value={
                                  customDenomination || 
                                  (editedMember.denomination && !denominations.includes(editedMember.denomination as any) 
                                    ? editedMember.denomination 
                                    : "")
                                }
                                onChange={(e) => {
                                  setCustomDenomination(e.target.value);
                                  setEditedMember({ ...editedMember, denomination: e.target.value });
                                }}
                                className="rounded-xl border-border/60"
                              />
                            </div>
                          )}
                        </div>

                        <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                        {/* Employment Details */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Employment Details
                          </h3>

                          <div className="space-y-2">
                            <Label htmlFor="employmentStatus" className="text-sm">Employment Status</Label>
                            <Select
                              value={editedMember.employmentStatus || "Other"}
                              onValueChange={(value: any) =>
                                setEditedMember({ ...editedMember, employmentStatus: value })
                              }
                            >
                              <SelectTrigger className="rounded-xl border-border/60">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Employed">Employed</SelectItem>
                                <SelectItem value="Student">Student</SelectItem>
                                <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                                <SelectItem value="Retired">Retired</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="occupation" className="text-sm">
                              Occupation
                            </Label>
                            <Input
                              id="occupation"
                              value={editedMember.occupation || ""}
                              onChange={(e) =>
                                setEditedMember({ ...editedMember, occupation: e.target.value })
                              }
                              className="rounded-xl border-border/60"
                              disabled={editedMember.employmentStatus === "Student"}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="employer" className="text-sm">
                              {editedMember.employmentStatus === "Student" ? "Institution" : "Employer"}
                            </Label>
                            <Input
                              id="employer"
                              value={editedMember.employer || ""}
                              onChange={(e) =>
                                setEditedMember({ ...editedMember, employer: e.target.value })
                              }
                              className="rounded-xl border-border/60"
                            />
                          </div>
                        </div>

                        <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                        {/* Contact Information */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Contact Information
                          </h3>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm">
                              Email
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={editedMember.email || ""}
                              onChange={(e) =>
                                setEditedMember({ ...editedMember, email: e.target.value })
                              }
                              className="rounded-xl border-border/60"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm">
                              Phone
                            </Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={editedMember.phone || ""}
                              onChange={(e) =>
                                setEditedMember({ ...editedMember, phone: e.target.value })
                              }
                              className="rounded-xl border-border/60"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address" className="text-sm">
                              Address
                            </Label>
                            <Input
                              id="address"
                              value={editedMember.address || ""}
                              onChange={(e) =>
                                setEditedMember({
                                  ...editedMember,
                                  address: e.target.value,
                                })
                              }
                              className="rounded-xl border-border/60"
                            />
                          </div>
                        </div>

                        <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                        {/* Emergency Contact */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Emergency Contact
                          </h3>

                          <div className="space-y-2">
                            <Label htmlFor="emergencyContactName" className="text-sm">
                              Contact Name
                            </Label>
                            <Input
                              id="emergencyContactName"
                              value={editedMember.emergencyContactName || ""}
                              onChange={(e) =>
                                setEditedMember({ ...editedMember, emergencyContactName: e.target.value })
                              }
                              className="rounded-xl border-border/60"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="emergencyContactRelationship" className="text-sm">
                              Relationship
                            </Label>
                            <Input
                              id="emergencyContactRelationship"
                              placeholder="e.g., Spouse, Parent, Sibling"
                              value={editedMember.emergencyContactRelationship || ""}
                              onChange={(e) =>
                                setEditedMember({ ...editedMember, emergencyContactRelationship: e.target.value })
                              }
                              className="rounded-xl border-border/60"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="emergencyContactPhone" className="text-sm">
                              Phone
                            </Label>
                            <Input
                              id="emergencyContactPhone"
                              type="tel"
                              value={editedMember.emergencyContactPhone || ""}
                              onChange={(e) =>
                                setEditedMember({ ...editedMember, emergencyContactPhone: e.target.value })
                              }
                              className="rounded-xl border-border/60"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view-mode"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {/* View Mode */}
                      <div className="space-y-6">
                        {/* Personal Details */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Personal Details
                          </h3>

                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <Calendar className="h-3.5 w-3.5" />
                                Date of Birth
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {editedMember.dateOfBirth
                                  ? new Date(editedMember.dateOfBirth).toLocaleDateString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      }
                                    )
                                  : "—"}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <Church className="h-3.5 w-3.5" />
                                Denomination
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {editedMember.denomination || "—"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                        {/* Employment Details */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Employment Details
                          </h3>

                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                {editedMember.employmentStatus === "Student" ? (
                                  <><GraduationCap className="h-3.5 w-3.5" /> Status</>
                                ) : (
                                  <><Briefcase className="h-3.5 w-3.5" /> Status</>
                                )}
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {editedMember.employmentStatus || "—"}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <Briefcase className="h-3.5 w-3.5" />
                                Occupation
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {editedMember.occupation || "—"}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                {editedMember.employmentStatus === "Student" ? (
                                  <><GraduationCap className="h-3.5 w-3.5" /> Institution</>
                                ) : (
                                  <><Briefcase className="h-3.5 w-3.5" /> Employer</>
                                )}
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {editedMember.employer || "—"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                        {/* Contact Information */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Contact Information
                          </h3>

                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <Mail className="h-3.5 w-3.5" />
                                Email
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {editedMember.email || "—"}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <Phone className="h-3.5 w-3.5" />
                                Phone
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {editedMember.phone || "—"}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <MapPin className="h-3.5 w-3.5" />
                                Address
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {editedMember.address || "—"}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <Calendar className="h-3.5 w-3.5" />
                                Join Date
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {editedMember.joinDate
                                  ? new Date(editedMember.joinDate).toLocaleDateString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      }
                                    )
                                  : "—"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                        {/* Emergency Contact */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Emergency Contact
                          </h3>

                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <Heart className="h-3.5 w-3.5" />
                                Contact Name
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {editedMember.emergencyContactName || "—"}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <User className="h-3.5 w-3.5" />
                                Relationship
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {editedMember.emergencyContactRelationship || "—"}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <Phone className="h-3.5 w-3.5" />
                                Phone
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {editedMember.emergencyContactPhone || "—"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-border/20 px-6 py-4">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div 
                      key="edit-buttons"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-2"
                    >
                      <motion.div whileTap={{ scale: 0.96 }} className="flex-1">
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          className="w-full gap-2 rounded-xl"
                        >
                          <XIcon className="h-4 w-4" />
                          Cancel
                        </Button>
                      </motion.div>
                      <motion.div whileTap={{ scale: saveStatus === "idle" ? 0.96 : 1 }} className="flex-1">
                        <Button
                          onClick={handleSave}
                          disabled={saveStatus !== "idle"}
                          className={cn(
                            "w-full gap-2 rounded-xl shadow-lg overflow-hidden relative transition-all duration-300",
                            saveStatus === "success"
                              ? "bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-emerald-500/20"
                              : "bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-primary/10",
                            saveStatus !== "idle" && "opacity-100"
                          )}
                        >
                          <AnimatePresence mode="wait">
                            {saveStatus === "idle" && (
                              <motion.div
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-2"
                              >
                                <Save className="h-4 w-4" />
                                <span>Save</span>
                              </motion.div>
                            )}
                            {saveStatus === "saving" && (
                              <motion.div
                                key="saving"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-2"
                              >
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Saving...</span>
                              </motion.div>
                            )}
                            {saveStatus === "success" && (
                              <motion.div
                                key="success"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-2"
                              >
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ 
                                    type: "spring", 
                                    stiffness: 200, 
                                    damping: 10,
                                    delay: 0.1 
                                  }}
                                >
                                  <Check className="h-4 w-4" />
                                </motion.div>
                                <span>Saved!</span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="view-button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      whileTap={{ scale: 0.96 }} 
                      className="w-full"
                    >
                      <Button
                        onClick={handleEdit}
                        className="w-full gap-2 rounded-xl shadow-lg shadow-primary/10 bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit Member
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Member Sheet */}
      <Sheet open={isAddingMember} onOpenChange={handleCloseAddMember}>
        <SheetContent className="sm:max-w-[380px] p-0 flex flex-col">
          <SheetTitle className="sr-only">Add New Member</SheetTitle>
          <SheetDescription className="sr-only">
            Add a new member to the choir roster
          </SheetDescription>

          <div ref={addMemberContentRef} className="flex flex-col h-full overflow-y-auto">
            {/* Header Section */}
            <div className="px-6 pt-8 pb-6 border-b border-border/20">
              <h2 className="text-2xl font-semibold tracking-tight">Add New Member</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Fill in the details to add a new choir member
              </p>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Basic Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="new-name" className="text-sm">Full Name *</Label>
                    <Input
                      id="new-name"
                      value={newMember.name}
                      onChange={(e) =>
                        setNewMember({ ...newMember, name: e.target.value })
                      }
                      className="rounded-xl border-border/60"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-role" className="text-sm">Role</Label>
                    <Select
                      value={newMember.role}
                      onValueChange={(value) =>
                        setNewMember({ ...newMember, role: value })
                      }
                    >
                      <SelectTrigger className="rounded-xl border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-part" className="text-sm">Member Part</Label>
                    <Select
                      value={newMember.part}
                      onValueChange={(value: any) =>
                        setNewMember({ ...newMember, part: value })
                      }
                    >
                      <SelectTrigger className="rounded-xl border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {voiceParts.map((part) => (
                          <SelectItem key={part} value={part}>
                            {part}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3.5 bg-muted/20">
                    <div className="space-y-0.5">
                      <Label htmlFor="new-executive" className="text-sm font-medium">Executive Member</Label>
                      <div className="text-xs text-muted-foreground">
                        Member of the executive team
                      </div>
                    </div>
                    <Switch
                      id="new-executive"
                      checked={newMember.executive}
                      onCheckedChange={(checked) =>
                        setNewMember({ ...newMember, executive: checked })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-status" className="text-sm">Status</Label>
                    <Select
                      value={newMember.status || "Active"}
                      onValueChange={(value: any) =>
                        setNewMember({ ...newMember, status: value })
                      }
                    >
                      <SelectTrigger className="rounded-xl border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Contact Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="new-email" className="text-sm">
                      Email
                    </Label>
                    <Input
                      id="new-email"
                      type="email"
                      value={newMember.email}
                      onChange={(e) =>
                        setNewMember({ ...newMember, email: e.target.value })
                      }
                      className="rounded-xl border-border/60"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-phone" className="text-sm">
                      Phone Number
                    </Label>
                    <Input
                      id="new-phone"
                      type="tel"
                      value={newMember.phone}
                      onChange={(e) =>
                        setNewMember({ ...newMember, phone: e.target.value })
                      }
                      className="rounded-xl border-border/60"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-address" className="text-sm">
                      Address
                    </Label>
                    <Input
                      id="new-address"
                      value={newMember.address}
                      onChange={(e) =>
                        setNewMember({ ...newMember, address: e.target.value })
                      }
                      className="rounded-xl border-border/60"
                      placeholder="Street address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-joinDate" className="text-sm">
                      Join Date
                    </Label>
                    <div className="relative">
                      <Input
                        id="new-joinDate"
                        type="date"
                        value={newMember.joinDate || ""}
                        onChange={(e) =>
                          setNewMember({ ...newMember, joinDate: e.target.value })
                        }
                        className="rounded-xl border-border/60 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-datetime-edit]:text-foreground [&::-webkit-datetime-edit-fields-wrapper]:text-foreground"
                        style={{
                          colorScheme: 'light'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                {/* Personal Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Personal Details
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="new-dateOfBirth" className="text-sm">
                      Date of Birth
                    </Label>
                    <div className="relative">
                      <Input
                        id="new-dateOfBirth"
                        type="date"
                        value={newMember.dateOfBirth || ""}
                        onChange={(e) =>
                          setNewMember({ ...newMember, dateOfBirth: e.target.value })
                        }
                        className="rounded-xl border-border/60 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-datetime-edit]:text-foreground [&::-webkit-datetime-edit-fields-wrapper]:text-foreground"
                        style={{
                          colorScheme: 'light'
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-denomination" className="text-sm">
                      Denomination
                    </Label>
                    <Select
                      value={
                        newMember.denomination && denominations.slice(0, -1).includes(newMember.denomination as any)
                          ? newMember.denomination
                          : newMember.denomination
                          ? "Other"
                          : ""
                      }
                      onValueChange={(value) => {
                        if (value === "Other") {
                          setNewMember({ ...newMember, denomination: newMemberCustomDenomination || "" });
                        } else {
                          setNewMember({ ...newMember, denomination: value });
                          setNewMemberCustomDenomination("");
                        }
                      }}
                    >
                      <SelectTrigger className="rounded-xl border-border/60">
                        <SelectValue placeholder="Select denomination" />
                      </SelectTrigger>
                      <SelectContent>
                        {denominations.map((denom) => (
                          <SelectItem key={denom} value={denom}>
                            {denom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {(newMember.denomination === "Other" || 
                    (newMember.denomination && !denominations.slice(0, -1).includes(newMember.denomination as any))) && (
                    <div className="space-y-2">
                      <Label htmlFor="new-customDenomination" className="text-sm">
                        Specify Denomination
                      </Label>
                      <Input
                        id="new-customDenomination"
                        placeholder="Enter denomination name"
                        value={
                          newMemberCustomDenomination || 
                          (newMember.denomination && !denominations.includes(newMember.denomination as any) 
                            ? newMember.denomination 
                            : "")
                        }
                        onChange={(e) => {
                          setNewMemberCustomDenomination(e.target.value);
                          setNewMember({ ...newMember, denomination: e.target.value });
                        }}
                        className="rounded-xl border-border/60"
                      />
                    </div>
                  )}
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                {/* Employment Information */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Employment Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="new-employmentStatus" className="text-sm">
                      Employment Status
                    </Label>
                    <Select
                      value={newMember.employmentStatus || "Employed"}
                      onValueChange={(value: any) =>
                        setNewMember({ ...newMember, employmentStatus: value })
                      }
                    >
                      <SelectTrigger className="rounded-xl border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Employed">Employed</SelectItem>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-occupation" className="text-sm">
                      Occupation
                    </Label>
                    <Input
                      id="new-occupation"
                      value={newMember.occupation}
                      onChange={(e) =>
                        setNewMember({ ...newMember, occupation: e.target.value })
                      }
                      className="rounded-xl border-border/60"
                      placeholder="Job title or profession"
                      disabled={newMember.employmentStatus === "Student"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-employer" className="text-sm">
                      Employer/Institution
                    </Label>
                    <Input
                      id="new-employer"
                      value={newMember.employer}
                      onChange={(e) =>
                        setNewMember({ ...newMember, employer: e.target.value })
                      }
                      className="rounded-xl border-border/60"
                      placeholder="Company or school name"
                    />
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Emergency Contact
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="new-emergencyContactName" className="text-sm">
                      Contact Name
                    </Label>
                    <Input
                      id="new-emergencyContactName"
                      value={newMember.emergencyContactName}
                      onChange={(e) =>
                        setNewMember({ ...newMember, emergencyContactName: e.target.value })
                      }
                      className="rounded-xl border-border/60"
                      placeholder="Full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-emergencyContactRelationship" className="text-sm">
                      Relationship
                    </Label>
                    <Input
                      id="new-emergencyContactRelationship"
                      value={newMember.emergencyContactRelationship}
                      onChange={(e) =>
                        setNewMember({ ...newMember, emergencyContactRelationship: e.target.value })
                      }
                      className="rounded-xl border-border/60"
                      placeholder="e.g., Spouse, Parent, Sibling"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-emergencyContactPhone" className="text-sm">
                      Contact Phone
                    </Label>
                    <Input
                      id="new-emergencyContactPhone"
                      type="tel"
                      value={newMember.emergencyContactPhone}
                      onChange={(e) =>
                        setNewMember({ ...newMember, emergencyContactPhone: e.target.value })
                      }
                      className="rounded-xl border-border/60"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-border/20 px-6 py-4 bg-muted/10">
              <div className="flex gap-3">
                <motion.div whileTap={{ scale: 0.96 }} className="flex-1">
                  <Button
                    variant="outline"
                    onClick={handleCloseAddMember}
                    disabled={saveStatus === "saving"}
                    className="w-full rounded-xl border-border/60 hover:bg-muted/50"
                  >
                    Cancel
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.96 }} className="flex-1">
                  <Button
                    onClick={handleAddMember}
                    disabled={saveStatus === "saving" || newMember.name.trim() === ""}
                    className="w-full gap-2 rounded-xl bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/10"
                  >
                    {saveStatus === "saving" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : saveStatus === "success" ? (
                      <>
                        <Check className="h-4 w-4" />
                        Added!
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Add Member
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}