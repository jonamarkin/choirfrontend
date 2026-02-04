"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Users,
  Contact,
  UsersRound,
  Keyboard,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { smsService } from "@/services/sms.service";
import {
  useContacts,
  useContactGroups,
  useMembersWithPhones,
  useGroupContacts,
} from "@/hooks/useSMS";
import {
  SelectedRecipient,
  VoicePart,
  MemberRole,
  VOICE_PART_DISPLAY,
  MEMBER_ROLE_DISPLAY,
  Contact as ContactType,
  MemberPhone,
} from "@/types/sms";
import { membersSmsService } from "@/services/members-sms.service";

const SMS_CHAR_LIMIT = 160;

export default function ComposeSMS() {
  // Message state
  const [message, setMessage] = React.useState("");
  const [manualPhone, setManualPhone] = React.useState("");

  // Recipients state
  const [recipients, setRecipients] = React.useState<SelectedRecipient[]>([]);

  // Send state
  const [isSending, setIsSending] = React.useState(false);
  const [sendResult, setSendResult] = React.useState<"success" | "error" | null>(null);

  // Filters
  const [contactSearch, setContactSearch] = React.useState("");
  const [memberSearch, setMemberSearch] = React.useState("");
  const [memberPartFilter, setMemberPartFilter] = React.useState<VoicePart | "all">("all");
  const [memberRoleFilter, setMemberRoleFilter] = React.useState<MemberRole | "all">("all");
  const [selectedGroupId, setSelectedGroupId] = React.useState<string | null>(null);

  // Data hooks
  const { contacts, isLoading: contactsLoading } = useContacts();
  const { groups, isLoading: groupsLoading } = useContactGroups();
  const { members, isLoading: membersLoading } = useMembersWithPhones();
  const { contacts: groupContacts, isLoading: groupContactsLoading } = useGroupContacts(selectedGroupId);

  // Filtered members based on search and filters
  const [filteredMembers, setFilteredMembers] = React.useState<MemberPhone[]>([]);
  const [isFilteringMembers, setIsFilteringMembers] = React.useState(false);

  // Filter members
  React.useEffect(() => {
    const filterMembers = async () => {
      setIsFilteringMembers(true);
      let result = members;

      // Apply API filters for part/role
      if (memberPartFilter !== "all") {
        try {
          result = await membersSmsService.getMembersByPart(memberPartFilter);
        } catch {
          result = members.filter((m) => m.member_part === memberPartFilter);
        }
      }

      if (memberRoleFilter !== "all") {
        try {
          result = await membersSmsService.getMembersByRole(memberRoleFilter);
        } catch {
          result = members.filter((m) => m.role === memberRoleFilter);
        }
      }

      // Apply local search filter
      if (memberSearch) {
        const search = memberSearch.toLowerCase();
        result = result.filter(
          (m) =>
            m.full_name.toLowerCase().includes(search) ||
            m.phone_number.includes(search)
        );
      }

      setFilteredMembers(result);
      setIsFilteringMembers(false);
    };

    filterMembers();
  }, [members, memberPartFilter, memberRoleFilter, memberSearch]);

  // Filtered contacts
  const filteredContacts = React.useMemo(() => {
    if (!contactSearch) return contacts;
    const search = contactSearch.toLowerCase();
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.phone_number.includes(search)
    );
  }, [contacts, contactSearch]);

  // Character count
  const charCount = message.length;
  const smsCount = Math.ceil(charCount / SMS_CHAR_LIMIT) || 1;

  // Add recipient
  const addRecipient = (recipient: SelectedRecipient) => {
    // Check for duplicates by phone
    if (recipients.some((r) => r.phone === recipient.phone)) {
      toast.error("This recipient is already added");
      return;
    }
    setRecipients((prev) => [...prev, recipient]);
  };

  // Remove recipient
  const removeRecipient = (id: string) => {
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  };

  // Add manual phone
  const handleAddManualPhone = () => {
    if (!manualPhone.trim()) return;

    // Basic validation - remove any non-numeric chars except +
    const cleanPhone = manualPhone.replace(/[^0-9+]/g, "");
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    addRecipient({
      id: `manual-${Date.now()}`,
      name: cleanPhone,
      phone: cleanPhone,
      source: "manual",
    });
    setManualPhone("");
  };

  // Add contact
  const handleAddContact = (contact: ContactType) => {
    addRecipient({
      id: `contact-${contact.id}`,
      name: contact.name,
      phone: contact.phone_number,
      source: "contact",
    });
  };

  // Add member
  const handleAddMember = (member: MemberPhone) => {
    addRecipient({
      id: `member-${member.id}`,
      name: member.full_name,
      phone: member.phone_number,
      source: "member",
    });
  };

  // Add all from group
  const handleAddGroup = () => {
    if (!selectedGroupId || groupContacts.length === 0) return;

    const group = groups.find((g) => g.id === selectedGroupId);
    let addedCount = 0;

    groupContacts.forEach((contact) => {
      if (!recipients.some((r) => r.phone === contact.phone_number)) {
        setRecipients((prev) => [
          ...prev,
          {
            id: `group-${contact.id}`,
            name: contact.name,
            phone: contact.phone_number,
            source: "group",
          },
        ]);
        addedCount++;
      }
    });

    toast.success(`Added ${addedCount} contacts from "${group?.name}"`);
    setSelectedGroupId(null);
  };

  // Send SMS
  const handleSend = async () => {
    if (recipients.length === 0) {
      toast.error("Please add at least one recipient");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSending(true);
    setSendResult(null);

    try {
      const phoneNumbers = recipients.map((r) => r.phone);
      await smsService.sendToRecipients(phoneNumbers, message);

      setSendResult("success");
      toast.success(`SMS sent to ${recipients.length} recipient(s)`);

      // Reset after success
      setTimeout(() => {
        setRecipients([]);
        setMessage("");
        setSendResult(null);
      }, 2000);
    } catch (err) {
      setSendResult("error");
      const errorMessage = err instanceof Error ? err.message : "Failed to send SMS";
      toast.error(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pl-14 md:pl-0">
        <h1 className="tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          Compose SMS
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Send messages to individuals or groups
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        {/* Left: Compose Area */}
        <div className="space-y-6">
          {/* Recipients Display */}
          <div className="rounded-2xl bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-sm border border-border/40 p-6">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-sm font-medium">Recipients</Label>
              <Badge variant="secondary" className="rounded-full">
                {recipients.length} selected
              </Badge>
            </div>

            {recipients.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center border-2 border-dashed border-border/40 rounded-xl">
                Select recipients from the panel on the right
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {recipients.slice(0, 10).map((recipient) => (
                    <motion.div
                      key={recipient.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge
                        variant="secondary"
                        className={cn(
                          "rounded-full pl-3 pr-1.5 py-1.5 flex items-center gap-2",
                          "bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
                        )}
                      >
                        <span className="text-sm">{recipient.name}</span>
                        <button
                          onClick={() => removeRecipient(recipient.id)}
                          className="h-5 w-5 rounded-full hover:bg-destructive/20 flex items-center justify-center transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    </motion.div>
                  ))}
                  {recipients.length > 10 && (
                    <Badge variant="outline" className="rounded-full">
                      +{recipients.length - 10} more
                    </Badge>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="rounded-2xl bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-sm border border-border/40 p-6">
            <Label htmlFor="message" className="text-sm font-medium">
              Message
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="mt-3 min-h-[160px] rounded-xl border-border/60 resize-none text-base"
            />
            <div className="flex items-center justify-between mt-3 text-sm">
              <span className="text-muted-foreground">
                {charCount} / {SMS_CHAR_LIMIT} characters
              </span>
              <Badge
                variant={smsCount > 1 ? "secondary" : "outline"}
                className="rounded-full"
              >
                {smsCount} SMS
              </Badge>
            </div>
          </div>

          {/* Send Button */}
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSend}
              disabled={isSending || recipients.length === 0 || !message.trim()}
              className={cn(
                "w-full h-14 text-lg font-medium rounded-2xl gap-3 shadow-lg transition-all duration-300",
                sendResult === "success"
                  ? "bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-emerald-500/20"
                  : sendResult === "error"
                  ? "bg-gradient-to-br from-destructive to-destructive/90 shadow-destructive/20"
                  : "bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-primary/20"
              )}
            >
              {isSending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : sendResult === "success" ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Sent Successfully!
                </>
              ) : sendResult === "error" ? (
                <>
                  <AlertCircle className="h-5 w-5" />
                  Failed to Send
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send SMS
                </>
              )}
            </Button>
          </motion.div>
        </div>

        {/* Right: Recipient Selector */}
        <div className="rounded-2xl bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-sm border border-border/40 overflow-hidden">
          <Tabs defaultValue="manual" className="h-full flex flex-col">
            <TabsList className="w-full rounded-none border-b border-border/40 bg-transparent p-0 h-auto">
              <TabsTrigger
                value="manual"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
              >
                <Keyboard className="h-4 w-4 mr-2" />
                Manual
              </TabsTrigger>
              <TabsTrigger
                value="contacts"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
              >
                <Contact className="h-4 w-4 mr-2" />
                Contacts
              </TabsTrigger>
              <TabsTrigger
                value="groups"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
              >
                <UsersRound className="h-4 w-4 mr-2" />
                Groups
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
              >
                <Users className="h-4 w-4 mr-2" />
                Members
              </TabsTrigger>
            </TabsList>

            {/* Manual Entry */}
            <TabsContent value="manual" className="flex-1 p-4">
              <div className="space-y-4">
                <Label className="text-sm font-medium">Enter Phone Number</Label>
                <div className="flex gap-2">
                  <Input
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="e.g., 233209335976"
                    className="rounded-xl"
                    onKeyDown={(e) => e.key === "Enter" && handleAddManualPhone()}
                  />
                  <Button
                    onClick={handleAddManualPhone}
                    variant="secondary"
                    className="rounded-xl px-4"
                  >
                    Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter phone numbers in international format without spaces
                </p>
              </div>
            </TabsContent>

            {/* Contacts */}
            <TabsContent value="contacts" className="flex-1 flex flex-col p-0">
              <div className="p-4 border-b border-border/40">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    placeholder="Search contacts..."
                    className="pl-9 rounded-xl"
                  />
                </div>
              </div>
              <ScrollArea className="flex-1 h-[400px]">
                {contactsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : filteredContacts.length === 0 ? (
                  <div className="text-center py-12 text-sm text-muted-foreground">
                    {contacts.length === 0 ? "No contacts yet" : "No contacts match your search"}
                  </div>
                ) : (
                  <div className="divide-y divide-border/40">
                    {filteredContacts.map((contact) => {
                      const isSelected = recipients.some((r) => r.phone === contact.phone_number);
                      return (
                        <button
                          key={contact.id}
                          onClick={() => !isSelected && handleAddContact(contact)}
                          disabled={isSelected}
                          className={cn(
                            "w-full flex items-center gap-3 p-4 text-left transition-colors",
                            isSelected
                              ? "bg-primary/5 opacity-60"
                              : "hover:bg-accent/50"
                          )}
                        >
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <Contact className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{contact.name}</div>
                            <div className="text-xs text-muted-foreground">{contact.phone_number}</div>
                          </div>
                          {isSelected && (
                            <Badge variant="secondary" className="rounded-full text-xs">
                              Added
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            {/* Groups */}
            <TabsContent value="groups" className="flex-1 flex flex-col p-0">
              <div className="p-4 border-b border-border/40">
                <Label className="text-sm font-medium mb-2 block">Select a Group</Label>
                <Select
                  value={selectedGroupId || ""}
                  onValueChange={(value) => setSelectedGroupId(value)}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Choose a group..." />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name} ({group.contact_count} contacts)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 p-4">
                {groupsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : selectedGroupId ? (
                  <div className="space-y-4">
                    {groupContactsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : (
                      <>
                        <div className="text-sm text-muted-foreground">
                          This group has {groupContacts.length} contact(s)
                        </div>
                        <Button
                          onClick={handleAddGroup}
                          disabled={groupContacts.length === 0}
                          className="w-full rounded-xl"
                        >
                          <UsersRound className="h-4 w-4 mr-2" />
                          Add All Contacts from Group
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-sm text-muted-foreground">
                    Select a group to add all its contacts
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Members */}
            <TabsContent value="members" className="flex-1 flex flex-col p-0">
              <div className="p-4 border-b border-border/40 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Search members..."
                    className="pl-9 rounded-xl"
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    value={memberPartFilter}
                    onValueChange={(value) => setMemberPartFilter(value as VoicePart | "all")}
                  >
                    <SelectTrigger className="flex-1 rounded-xl h-9 text-sm">
                      <SelectValue placeholder="Voice Part" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Parts</SelectItem>
                      {(Object.keys(VOICE_PART_DISPLAY) as VoicePart[]).map((part) => (
                        <SelectItem key={part} value={part}>
                          {VOICE_PART_DISPLAY[part]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={memberRoleFilter}
                    onValueChange={(value) => setMemberRoleFilter(value as MemberRole | "all")}
                  >
                    <SelectTrigger className="flex-1 rounded-xl h-9 text-sm">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {(Object.keys(MEMBER_ROLE_DISPLAY) as MemberRole[]).map((role) => (
                        <SelectItem key={role} value={role}>
                          {MEMBER_ROLE_DISPLAY[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <ScrollArea className="flex-1 h-[350px]">
                {membersLoading || isFilteringMembers ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : filteredMembers.length === 0 ? (
                  <div className="text-center py-12 text-sm text-muted-foreground">
                    No members match your filters
                  </div>
                ) : (
                  <div className="divide-y divide-border/40">
                    {filteredMembers.map((member) => {
                      const isSelected = recipients.some((r) => r.phone === member.phone_number);
                      return (
                        <button
                          key={member.id}
                          onClick={() => !isSelected && handleAddMember(member)}
                          disabled={isSelected}
                          className={cn(
                            "w-full flex items-center gap-3 p-4 text-left transition-colors",
                            isSelected
                              ? "bg-primary/5 opacity-60"
                              : "hover:bg-accent/50"
                          )}
                        >
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{member.full_name}</div>
                            <div className="text-xs text-muted-foreground">
                              {member.phone_number}
                              {member.member_part && (
                                <span className="ml-2">• {VOICE_PART_DISPLAY[member.member_part as VoicePart] || member.member_part}</span>
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <Badge variant="secondary" className="rounded-full text-xs">
                              Added
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
