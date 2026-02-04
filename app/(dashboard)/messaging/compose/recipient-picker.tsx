"use client";

import * as React from "react";
import { 
  Users, 
  Contact, 
  UsersRound, 
  Search,
  Check,
  Plus,
  BookUser
} from "lucide-react";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { SelectedRecipient, Contact as ContactType, ContactGroup, MemberPhone } from "@/types/sms";

interface RecipientPickerProps {
  contacts: ContactType[];
  groups: ContactGroup[];
  members: MemberPhone[];
  onSelect: (recipients: SelectedRecipient[]) => void;
  alreadySelectedPhones: string[];
}

export function RecipientPicker({
  contacts,
  groups,
  members,
  onSelect,
  alreadySelectedPhones,
}: RecipientPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [localSelected, setLocalSelected] = React.useState<SelectedRecipient[]>([]);

  const toggleRecipient = (r: SelectedRecipient) => {
    setLocalSelected(prev => 
      prev.some(p => p.id === r.id) 
        ? prev.filter(p => p.id !== r.id)
        : [...prev, r]
    );
  };

  const handleConfirm = () => {
    onSelect(localSelected);
    setLocalSelected([]);
    setOpen(false);
  };

  const filteredContacts = (contacts || []).filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone_number.includes(search)
  );

  const filteredGroups = (groups || []).filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredMembers = (members || []).filter(m => 
    m.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (m.member_part || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.role || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 rounded-lg border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all">
          <BookUser className="h-3.5 w-3.5 text-primary" />
          Browse List
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
        <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-br from-primary/10 to-transparent">
          <DialogTitle className="flex items-center gap-2">
            <BookUser className="h-5 w-5 text-primary" />
            Recipient Directory
          </DialogTitle>
          <DialogDescription>
            Select multiple contacts, groups, or members to message.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-muted/30 border-none rounded-xl"
            />
          </div>
        </div>

        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border/40 bg-transparent h-12 px-6 gap-6">
            <TabsTrigger value="contacts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 h-12 font-medium">
              Contacts
            </TabsTrigger>
            <TabsTrigger value="groups" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 h-12 font-medium">
              Groups
            </TabsTrigger>
            <TabsTrigger value="members" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 h-12 font-medium">
              Members
            </TabsTrigger>
          </TabsList>

          <div className="p-0">
            <TabsContent value="contacts" className="m-0">
              <ScrollArea className="h-[350px]">
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredContacts.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => toggleRecipient({ id: `contact-${c.id}`, name: c.name, phone: c.phone_number, source: 'contact' })}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                        localSelected.some(p => p.id === `contact-${c.id}`) 
                          ? "bg-primary/5 border-primary/20" 
                          : "bg-background border-transparent hover:bg-muted/50"
                      )}
                    >
                      <Checkbox checked={localSelected.some(p => p.id === `contact-${c.id}`)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.phone_number}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="groups" className="m-0">
              <ScrollArea className="h-[350px]">
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredGroups.map(g => (
                    <div 
                      key={g.id} 
                      onClick={() => toggleRecipient({ id: `group-${g.id}`, name: g.name, phone: 'Group', source: 'group', groupId: g.id, count: g.contact_count })}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                        localSelected.some(p => p.id === `group-${g.id}`) 
                          ? "bg-primary/5 border-primary/20" 
                          : "bg-background border-transparent hover:bg-muted/50"
                      )}
                    >
                      <Checkbox checked={localSelected.some(p => p.id === `group-${g.id}`)} />
                      <UsersRound className="h-4 w-4 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{g.name}</p>
                        <p className="text-xs text-muted-foreground">{g.contact_count} contacts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="members" className="m-0">
               <ScrollArea className="h-[350px]">
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredMembers.map(m => (
                    <div 
                      key={m.id} 
                      onClick={() => toggleRecipient({ id: `member-${m.id}`, name: m.full_name, phone: m.phone_number, source: 'member' })}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                        localSelected.some(p => p.id === `member-${m.id}`) 
                          ? "bg-primary/5 border-primary/20" 
                          : "bg-background border-transparent hover:bg-muted/50"
                      )}
                    >
                      <Checkbox checked={localSelected.some(p => p.id === `member-${m.id}`)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{m.full_name}</p>
                        </div>
                        <div className="flex gap-1 mt-1">
                           {m.member_part && <Badge variant="outline" className="text-[10px] h-4 font-normal px-1">{m.member_part}</Badge>}
                           {m.role && m.role !== 'member' && <Badge variant="secondary" className="text-[10px] h-4 font-normal px-1 uppercase">{m.role.replace('_', ' ')}</Badge>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="px-6 py-4 border-t border-border/40 bg-muted/10">
          <div className="flex-1 text-sm text-muted-foreground flex items-center">
            {localSelected.length > 0 && (
              <span className="flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2">
                <Check className="h-4 w-4 text-emerald-500" />
                {localSelected.length} picked
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setLocalSelected([])} className="h-9">
              Clear
            </Button>
            <Button size="sm" onClick={handleConfirm} disabled={localSelected.length === 0} className="h-9 px-4 rounded-lg bg-primary shadow-lg shadow-primary/20">
              Add Selection
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
