"use client";

import * as React from "react";
import {
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Save,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { smsService } from "@/services/sms.service";
import { contactGroupsService } from "@/services/contact-groups.service";
import { contactsService } from "@/services/contacts.service";
import {
  useContacts,
  useContactGroups,
  useMembersWithPhones,
} from "@/hooks/useSMS";
import { SelectedRecipient } from "@/types/sms";
import { SmartRecipientInput } from "./smart-recipient-input";
import { RecipientPicker } from "./recipient-picker";

const SMS_CHAR_LIMIT = 160;

export default function ComposeSMS() {
  // Message state
  const [message, setMessage] = React.useState("");
  
  // Recipients state
  const [recipients, setRecipients] = React.useState<SelectedRecipient[]>([]);

  // Send state
  const [isSending, setIsSending] = React.useState(false);
  const [sendResult, setSendResult] = React.useState<"success" | "error" | null>(null);
  
  // Confirmation state
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [expandedRecipientCount, setExpandedRecipientCount] = React.useState(0);

  // Save Unknowns State
  const [unknownNumbers, setUnknownNumbers] = React.useState<string[]>([]);
  const [showSaveDialog, setShowSaveDialog] = React.useState(false);
  const [saveName, setSaveName] = React.useState("");
  const [currentSaveIndex, setCurrentSaveIndex] = React.useState(0);
  const [isSavingContact, setIsSavingContact] = React.useState(false);

  // Data hooks
  const { contacts, isLoading: contactsLoading } = useContacts();
  const { groups, isLoading: groupsLoading } = useContactGroups();
  const { members, isLoading: membersLoading } = useMembersWithPhones();

  // Character count
  const charCount = message.length;
  const smsCount = Math.ceil(charCount / SMS_CHAR_LIMIT) || 1;

  // Helpers
  const resolveRecipients = async () => {
    const phoneSet = new Set<string>();
    let count = 0;

    for (const r of recipients) {
      if (r.source === "group" && r.groupId) {
        // We estimate count from metadata first for UI speed, 
        // but for actual sending we'd resolve. 
        // Here we are resolving for the CONFIRMATION dialog count.
        // If getting contacts is heavy, we might use r.count (metadata) for estimation.
        // But to be accurate lets rely on metadata for PRE-Check and resolve later?
        // Actually, let's just use metadata count for the UI dialog to avoid pre-fetching everything.
        count += (r.count || 0); // r.count should be populated from group.contact_count
      } else {
        phoneSet.add(r.phone);
        count++;
      }
    }
    // Note: This is an estimation because Groups might overlap with manual contacts.
    // However, exact de-duplication happens at sending. 
    return count;
  };

  // Pre-Send Check
  const handlePreSend = async () => {
    if (recipients.length === 0) {
      toast.error("Please add at least one recipient");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    // Calculate effective count (approximate)
    let totalEstimated = 0;
    recipients.forEach(r => {
      if (r.source === 'group') totalEstimated += (r.count || 0);
      else totalEstimated += 1;
    });

    setExpandedRecipientCount(totalEstimated);

    if (totalEstimated >= 5) {
      setShowConfirmDialog(true);
    } else {
      executeSend();
    }
  };

  // Execution
  const executeSend = async () => {
    setIsSending(true);
    setSendResult(null);
    setShowConfirmDialog(false);

    try {
      // 1. Resolve all numbers
      const finalPhones: string[] = [];
      const manuals: string[] = [];

      for (const r of recipients) {
        if (r.source === "group" && r.groupId) {
          // Fetch real contacts for group
          try {
             const groupContacts = await contactGroupsService.getGroupContacts(r.groupId);
             finalPhones.push(...groupContacts.map(c => c.phone_number));
          } catch (e) {
             console.error(`Failed to fetch contacts for group ${r.groupId}`, e);
             toast.error(`Failed to load contacts for group: ${r.name}`);
             setIsSending(false);
             return;
          }
        } else {
          finalPhones.push(r.phone);
          if (r.source === "manual") manuals.push(r.phone);
        }
      }

      // 2. Send
      if (finalPhones.length === 0) {
        toast.error("No valid phone numbers found in selection.");
        setIsSending(false);
        return;
      }

      await smsService.sendToRecipients(finalPhones, message);

      setSendResult("success");
      toast.success(`SMS sent to ${finalPhones.length} recipient(s)`);

      // 3. Post-Send Actions (Save Unknowns warning)
      if (manuals.length > 0) {
         setUnknownNumbers(manuals);
         setShowSaveDialog(true);
         setCurrentSaveIndex(0);
         setSaveName("");
      } else {
        // Reset only if no post-actions
        setTimeout(() => {
          setRecipients([]);
          setMessage("");
          setSendResult(null);
        }, 2000);
      }

    } catch (err) {
      setSendResult("error");
      const errorMessage = err instanceof Error ? err.message : "Failed to send SMS";
      toast.error(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveContact = async () => {
    if (!saveName.trim()) {
      toast.error("Please enter a name");
      return;
    }
    setIsSavingContact(true);
    try {
      await contactsService.createContact({
        name: saveName,
        phone_number: unknownNumbers[currentSaveIndex]
      });
      toast.success("Contact saved!");
      
      if (currentSaveIndex < unknownNumbers.length - 1) {
        setCurrentSaveIndex(prev => prev + 1);
        setSaveName("");
      } else {
        setShowSaveDialog(false);
        // All done, clear form
          setRecipients([]);
          setMessage("");
          setSendResult(null);
      }
    } catch (e) {
      toast.error("Failed to save contact");
    } finally {
      setIsSavingContact(false);
    }
  };

  const skipSaveContact = () => {
     if (currentSaveIndex < unknownNumbers.length - 1) {
        setCurrentSaveIndex(prev => prev + 1);
        setSaveName("");
      } else {
        setShowSaveDialog(false);
        setRecipients([]);
        setMessage("");
        setSendResult(null);
      }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4 px-4 md:px-0">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          New Message
        </h1>
        <p className="text-muted-foreground mt-2">
          Send SMS to contacts, groups, or manual numbers.
        </p>
      </div>

      <div className="space-y-6">
        {/* Recipient Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <Label className="text-sm font-medium">To:</Label>
            <RecipientPicker 
              contacts={contacts || []}
              groups={groups || []}
              members={members || []}
              onSelect={(newRecipients) => {
                setRecipients(prev => {
                  const merged = [...prev, ...newRecipients];
                  const unique = [];
                  const ids = new Set();
                  for (const r of merged) {
                    if (!ids.has(r.id)) {
                      unique.push(r);
                      ids.add(r.id);
                    }
                  }
                  return unique;
                });
              }}
              alreadySelectedPhones={recipients.map(r => r.phone)}
            />
          </div>
          <SmartRecipientInput
            recipients={recipients}
            setRecipients={setRecipients}
            contacts={contacts || []}
            groups={groups || []}
            members={members || []}
            isLoading={contactsLoading || groupsLoading || membersLoading}
          />
          <div className="flex justify-between px-1">
             <p className="text-xs text-muted-foreground">
               Type to search or enter a phone number directly.
             </p>
             {recipients.length > 0 && (
               <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-0 text-xs text-destructive hover:bg-transparent"
                onClick={() => setRecipients([])}
               >
                 Clear all
               </Button>
             )}
          </div>
        </div>

        {/* Message Input */}
        <div className="space-y-2">
           <Label htmlFor="message" className="text-sm font-medium">
              Message
           </Label>
           <div className="relative">
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-[200px] rounded-xl border-border/60 resize-none text-base p-4 shadow-sm focus-visible:ring-primary/20"
            />
            <div className="absolute bottom-3 right-3 flex gap-2">
               <Badge variant={smsCount > 1 ? "secondary" : "outline"} className="bg-background/80 backdrop-blur-sm">
                  {charCount} / {SMS_CHAR_LIMIT} • {smsCount} SMS
               </Badge>
            </div>
           </div>
        </div>

        {/* Actions */}
        <div className="pt-4">
           <Button
              onClick={handlePreSend}
              disabled={isSending || recipients.length === 0 || !message.trim()}
              className={cn(
                "w-full h-12 text-lg font-medium rounded-xl shadow-lg transition-all duration-300",
                sendResult === "success"
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                  : "bg-primary hover:bg-primary/90 shadow-primary/20"
              )}
            >
              {isSending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Sending...
                </>
              ) : sendResult === "success" ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Sent Successfully!
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </>
              )}
            </Button>
        </div>
      </div>

       {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Sending</DialogTitle>
            <DialogDescription>
              You are about to send to approximately <strong>{expandedRecipientCount}</strong> phone numbers.
              <br />
              Estimated cost: <strong>{expandedRecipientCount * smsCount} credits</strong>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-xl border border-border/50 space-y-2">
               <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Message Preview</Label>
               <p className="text-sm line-clamp-4 italic">"{message}"</p>
               <div className="flex justify-between items-center pt-2 border-t border-border/20">
                  <span className="text-[10px] text-muted-foreground">{message.length} characters</span>
                  <Badge variant="outline" className="text-[10px] h-4 font-normal">{smsCount} SMS units</Badge>
               </div>
            </div>

            <div className="bg-amber-500/10 p-3 rounded-lg text-[13px] border border-amber-500/20 text-amber-600 dark:text-amber-400">
               <div className="flex items-start gap-2">
                 <AlertCircle className="h-4 w-4 mt-0.5" />
                 <p>Duplicate numbers will be automatically removed before sending.</p>
               </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={executeSend} disabled={isSending}>
              {isSending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Confirm Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Unknown Numbers Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={(open) => !open && skipSaveContact()}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Save Unknown Number?</DialogTitle>
               <DialogDescription>
                  You sent a message to <strong>{unknownNumbers[currentSaveIndex]}</strong> which is not in your contacts.
                  Would you like to save it?
               </DialogDescription>
            </DialogHeader>
             <div className="py-4 space-y-4">
                <div className="space-y-2">
                   <Label>Contact Name</Label>
                   <Input 
                      value={saveName} 
                      onChange={(e) => setSaveName(e.target.value)} 
                      placeholder="e.g. John Doe"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveContact()}
                   />
                </div>
                <div className="text-xs text-muted-foreground text-center">
                   Number {currentSaveIndex + 1} of {unknownNumbers.length}
                </div>
             </div>
             <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="ghost" onClick={skipSaveContact}>
                   Skip
                </Button>
                <Button onClick={handleSaveContact} disabled={isSavingContact}>
                   {isSavingContact ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                   Save Contact
                </Button>
             </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );
}
