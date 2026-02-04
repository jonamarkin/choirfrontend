"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X, Users, Contact, UsersRound, Phone, Plus } from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { SelectedRecipient, Contact as ContactType, ContactGroup, MemberPhone } from "@/types/sms";

interface SmartRecipientInputProps {
  recipients: SelectedRecipient[];
  setRecipients: React.Dispatch<React.SetStateAction<SelectedRecipient[]>>;
  contacts: ContactType[];
  groups: ContactGroup[];
  members: MemberPhone[];
  isLoading?: boolean;
}

export function SmartRecipientInput({
  recipients,
  setRecipients,
  contacts,
  groups,
  members,
  isLoading,
}: SmartRecipientInputProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSelect = (recipient: SelectedRecipient) => {
    // Check for direct ID duplicates
    if (recipients.some((r) => r.id === recipient.id)) {
      setQuery("");
      return;
    }

    // For individual recipients (contacts, members, manual), check for phone duplicates
    if (recipient.source !== "group") {
      if (recipients.some((r) => r.phone === recipient.phone)) {
        setQuery("");
        return;
      }
    }

    setRecipients((prev) => [...prev, recipient]);
    setQuery("");
  };

  const removeRecipient = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent dropdown from toggling when clicking remove
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  };

  const handleManualAdd = () => {
    if (!query) return;
    
    // Basic phone validation (digits and + only)
    const cleanPhone = query.replace(/[^0-9+]/g, "");
    if (cleanPhone.length < 3) return;

    handleSelect({
      id: `manual-${Date.now()}`,
      name: cleanPhone,
      phone: cleanPhone,
      source: "manual",
    });
  };

  // Safe array checks
  const safeContacts = Array.isArray(contacts) ? contacts : [];
  const safeGroups = Array.isArray(groups) ? groups : [];
  const safeMembers = Array.isArray(members) ? members : [];

  // Determine if query is a manual number
  const isLikelyPhone = /^[0-9+]+$/.test(query) && query.length >= 3;

  return (
    <div className="group rounded-xl border border-input bg-background/60 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <div className="flex flex-wrap gap-2">
        {recipients.map((recipient) => (
          <Badge
            key={recipient.id}
            variant="secondary"
            className="rounded-full px-3 py-1 gap-1 pr-1 bg-secondary/50 hover:bg-secondary/70 transition-colors"
          >
            {recipient.source === 'group' && <UsersRound className="h-3 w-3 mr-1 opacity-50" />}
            {recipient.source === 'contact' && <Contact className="h-3 w-3 mr-1 opacity-50" />}
            {recipient.source === 'member' && <Users className="h-3 w-3 mr-1 opacity-50" />}
            {recipient.source === 'manual' && <Phone className="h-3 w-3 mr-1 opacity-50" />}
            {recipient.name}
            <button
              className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 hover:text-destructive focus:outline-none"
              onClick={(e) => removeRecipient(recipient.id, e)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {recipient.name}</span>
            </button>
          </Badge>
        ))}
        
        <Command className="overflow-visible bg-transparent p-0 min-w-[200px] flex-1">
          <CommandInput
            placeholder={recipients.length === 0 ? "Search contacts, groups, or enter a number..." : "Add more..."}
            value={query}
            onValueChange={setQuery}
            className="border-none bg-transparent p-0 shadow-none focus:ring-0 px-0 h-7"
            onKeyDown={(e) => {
              if (e.key === "Enter" && isLikelyPhone) {
                e.preventDefault();
                handleManualAdd();
              }
              if (e.key === "Backspace" && !query && recipients.length > 0) {
                removeRecipient(recipients[recipients.length - 1].id);
              }
            }}
          />
          <div className="relative mt-2">
            {query && (
              <div className="absolute top-0 w-full rounded-xl border bg-popover/95 backdrop-blur-sm text-popover-foreground shadow-lg overflow-hidden z-50 animate-in fade-in-0 zoom-in-95">
                <CommandList>
                  <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                    {isLikelyPhone ? (
                       <button onClick={handleManualAdd} className="flex items-center justify-center gap-2 w-full h-full text-primary hover:underline">
                         <Plus className="h-4 w-4" /> Add "{query}"
                       </button>
                    ) : "No matching contacts found."}
                  </CommandEmpty>

                  {isLikelyPhone && (
                     <CommandGroup heading="Manual Entry">
                         <CommandItem onSelect={handleManualAdd} className="cursor-pointer">
                            <Phone className="mr-2 h-4 w-4" />
                            <span>Add "{query}"</span>
                         </CommandItem>
                     </CommandGroup>
                  )}

                  {safeGroups.length > 0 && (
                    <CommandGroup heading="Groups">
                      {safeGroups.map((group) => (
                        <CommandItem
                          key={group.id}
                          onSelect={() => handleSelect({ id: `group-${group.id}`, name: group.name, phone: 'Group', source: 'group', groupId: group.id })} // Note: phone: 'Group' is temporary, actual logic handles group expansion later or we treat group as single entity first
                          className="cursor-pointer"
                        >
                          <UsersRound className="mr-2 h-4 w-4" />
                          <span>{group.name}</span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {group.contact_count} contacts
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {safeContacts.length > 0 && (
                    <CommandGroup heading="Contacts">
                      {safeContacts.map((contact) => (
                        <CommandItem
                          key={contact.id}
                          onSelect={() => handleSelect({ id: `contact-${contact.id}`, name: contact.name, phone: contact.phone_number, source: 'contact' })}
                          className="cursor-pointer"
                        >
                          <Contact className="mr-2 h-4 w-4" />
                          <span>{contact.name}</span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {contact.phone_number}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {safeMembers.length > 0 && (
                    <CommandGroup heading="Members">
                      {safeMembers.map((member) => (
                        <CommandItem
                          key={member.id}
                          // Include role and part in the searchable value
                          value={`${member.full_name} ${member.member_part || ''} ${member.role || ''} ${member.phone_number}`}
                          onSelect={() => handleSelect({ id: `member-${member.id}`, name: member.full_name, phone: member.phone_number, source: 'member' })}
                          className="cursor-pointer"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          <div className="flex flex-col">
                            <span>{member.full_name}</span>
                            <div className="flex gap-1 mt-0.5">
                               {member.member_part && (
                                 <Badge variant="outline" className="text-[10px] px-1 h-4 font-normal">
                                   {member.member_part}
                                 </Badge>
                               )}
                               {member.role && member.role !== 'member' && (
                                 <Badge variant="secondary" className="text-[10px] px-1 h-4 font-normal">
                                   {member.role.replace('_', ' ')}
                                 </Badge>
                               )}
                            </div>
                          </div>
                          <span className="ml-auto text-xs text-muted-foreground self-start mt-0.5">
                            {member.phone_number}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </div>
            )}
          </div>
        </Command>
      </div>
    </div>
  );
}
