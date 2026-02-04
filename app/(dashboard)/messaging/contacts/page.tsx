"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Upload,
  X,
  Loader2,
  Check,
  Save,
  Contact,
  Phone,
  User,
  UsersRound,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PremiumStatCard } from "@/components/premium-stat-card";
import { tableContainerStyle } from "@/utils/premium-styles";

import { useContacts, useContactGroups } from "@/hooks/useSMS";
import { contactsService } from "@/services/contacts.service";
import { Contact as ContactType } from "@/types/sms";

export default function ContactsPage() {
  // Data
  const { contacts, isLoading, error, mutate } = useContacts();
  const { groups } = useContactGroups();

  // UI State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  // Sheet state
  const [selectedContact, setSelectedContact] = React.useState<ContactType | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState({ name: "", phone_number: "" });
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "success">("idle");

  // Add contact dialog
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [addForm, setAddForm] = React.useState({ name: "", phone_number: "", group_id: "" });
  const [isAdding, setIsAdding] = React.useState(false);

  // Bulk import dialog
  const [showBulkDialog, setShowBulkDialog] = React.useState(false);
  const [bulkText, setBulkText] = React.useState("");
  const [bulkGroupId, setBulkGroupId] = React.useState("");
  const [isBulkImporting, setIsBulkImporting] = React.useState(false);

  // Delete confirmation
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Filter contacts
  const filteredContacts = React.useMemo(() => {
    if (!searchQuery) return contacts;
    const search = searchQuery.toLowerCase();
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.phone_number.includes(search)
    );
  }, [contacts, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleViewContact = (contact: ContactType) => {
    setSelectedContact(contact);
    setEditForm({ name: contact.name, phone_number: contact.phone_number });
    setIsEditing(false);
  };

  const handleCloseSheet = () => {
    setSelectedContact(null);
    setEditForm({ name: "", phone_number: "" });
    setIsEditing(false);
    setSaveStatus("idle");
  };

  const handleSaveEdit = async () => {
    if (!selectedContact) return;

    setSaveStatus("saving");
    try {
      await contactsService.updateContact(selectedContact.id, editForm);
      setSaveStatus("success");
      mutate();
      await new Promise((r) => setTimeout(r, 800));
      setIsEditing(false);
      setSaveStatus("idle");
      toast.success("Contact updated");
    } catch (err) {
      setSaveStatus("idle");
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const handleAddContact = async () => {
    if (!addForm.name.trim() || !addForm.phone_number.trim()) {
      toast.error("Name and phone are required");
      return;
    }

    setIsAdding(true);
    try {
      await contactsService.createContact({
        name: addForm.name,
        phone_number: addForm.phone_number,
        group_id: addForm.group_id || undefined,
      });
      mutate();
      setShowAddDialog(false);
      setAddForm({ name: "", phone_number: "", group_id: "" });
      toast.success("Contact created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBulkImport = async () => {
    const lines = bulkText.split("\n").filter((l) => l.trim());
    if (lines.length === 0) {
      toast.error("Please enter at least one contact");
      return;
    }

    const contactsToCreate = lines.map((line) => {
      const parts = line.split(",").map((p) => p.trim());
      return {
        name: parts[0] || "Unknown",
        phone_number: parts[1] || parts[0],
      };
    });

    setIsBulkImporting(true);
    try {
      const result = await contactsService.bulkCreate({
        contacts: contactsToCreate,
        group_id: bulkGroupId || undefined,
      });
      mutate();
      setShowBulkDialog(false);
      setBulkText("");
      setBulkGroupId("");
      toast.success(`Imported ${result.created} contacts`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bulk import failed");
    } finally {
      setIsBulkImporting(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await contactsService.deleteContact(deleteId);
      mutate();
      setDeleteId(null);
      handleCloseSheet();
      toast.success("Contact deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="pl-14 md:pl-0">
          <h1 className="tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Contacts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your SMS contacts
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowBulkDialog(true)}
            variant="outline"
            className="gap-2 rounded-xl"
          >
            <Upload className="h-4 w-4" />
            Bulk Import
          </Button>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="gap-2 rounded-xl bg-gradient-to-br from-primary to-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <PremiumStatCard value={contacts.length} label="Total Contacts" variant="primary" />
        <PremiumStatCard value={groups.length} label="Groups" variant="secondary" />
        <PremiumStatCard
          value={contacts.filter((c) => c.groups.length > 0).length}
          label="In Groups"
          variant="gold"
        />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search contacts..."
          className="pl-9 h-11 rounded-xl bg-background/60 backdrop-blur-sm border-border/40"
        />
      </div>

      {/* Table */}
      <div className={cn("rounded-2xl bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-sm overflow-hidden", tableContainerStyle)}>
        <div className="overflow-x-auto" style={{ minHeight: "calc(100vh - 480px)" }}>
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-border/20 hover:bg-transparent">
                <TableHead className="h-10 px-6 text-[13px] font-semibold uppercase tracking-wider">Name</TableHead>
                <TableHead className="h-10 px-6 text-[13px] font-semibold uppercase tracking-wider">Phone</TableHead>
                <TableHead className="hidden md:table-cell h-10 px-6 text-[13px] font-semibold uppercase tracking-wider">Groups</TableHead>
                <TableHead className="h-10 px-6 text-center text-[13px] font-semibold uppercase tracking-wider w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    {contacts.length === 0 ? "No contacts yet. Add your first contact!" : "No contacts match your search"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedContacts.map((contact, index) => (
                  <TableRow
                    key={contact.id}
                    className={cn("border-border/20 transition-all hover:bg-accent/30", index === paginatedContacts.length - 1 && "border-0")}
                  >
                    <TableCell className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <Contact className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium">{contact.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-6 text-muted-foreground">{contact.phone_number}</TableCell>
                    <TableCell className="hidden md:table-cell py-3 px-6">
                      {contact.groups.length > 0 ? (
                        <Badge variant="secondary" className="rounded-full">
                          {contact.groups.length} group(s)
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="py-3 px-6">
                      <div className="flex items-center justify-center gap-1">
                        <Button onClick={() => handleViewContact(contact)} variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => setDeleteId(contact.id)} variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border/20 px-6 py-3 bg-background/20">
          <div className="text-[13px] text-muted-foreground">
            Showing {paginatedContacts.length} of {filteredContacts.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-xl"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {currentPage} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="rounded-xl"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Sheet */}
      <Sheet open={!!selectedContact} onOpenChange={handleCloseSheet}>
        <SheetContent className="sm:max-w-[400px] p-0 flex flex-col">
          <SheetTitle className="sr-only">Edit Contact</SheetTitle>
          <SheetDescription className="sr-only">Edit contact details</SheetDescription>
          {selectedContact && (
            <div className="flex flex-col h-full">
              <div className="px-6 pt-8 pb-6 border-b border-border/20">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
                  <Contact className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">{selectedContact.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedContact.phone_number}</p>
              </div>

              <div className="flex-1 px-6 py-6 space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        value={editForm.phone_number}
                        onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                        <User className="h-3.5 w-3.5" />
                        Name
                      </div>
                      <div className="text-sm pl-5">{selectedContact.name}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                        <Phone className="h-3.5 w-3.5" />
                        Phone
                      </div>
                      <div className="text-sm pl-5">{selectedContact.phone_number}</div>
                    </div>
                    {selectedContact.groups.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                          <UsersRound className="h-3.5 w-3.5" />
                          Groups
                        </div>
                        <div className="text-sm pl-5">{selectedContact.groups.length} group(s)</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-border/20 px-6 py-4">
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1 rounded-xl">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      disabled={saveStatus !== "idle"}
                      className={cn("flex-1 rounded-xl", saveStatus === "success" && "bg-emerald-600")}
                    >
                      {saveStatus === "saving" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : saveStatus === "success" ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      {saveStatus === "saving" ? "Saving..." : saveStatus === "success" ? "Saved!" : "Save"}
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="w-full rounded-xl bg-gradient-to-br from-primary to-primary/90">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Contact
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Contact Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Contact</DialogTitle>
            <DialogDescription>Create a new contact for SMS</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                placeholder="John Doe"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input
                value={addForm.phone_number}
                onChange={(e) => setAddForm({ ...addForm, phone_number: e.target.value })}
                placeholder="233209335976"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Add to Group (optional)</Label>
              <Select value={addForm.group_id} onValueChange={(v) => setAddForm({ ...addForm, group_id: v })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select group..." />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleAddContact} disabled={isAdding} className="rounded-xl">
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {isAdding ? "Adding..." : "Add Contact"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Bulk Import Contacts</DialogTitle>
            <DialogDescription>
              Enter one contact per line as: Name, Phone Number
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Contacts</Label>
              <Textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`John Doe, 233209335976\nJane Smith, 233241234567`}
                className="min-h-[150px] rounded-xl font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Add to Group (optional)</Label>
              <Select value={bulkGroupId} onValueChange={setBulkGroupId}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select group..." />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkDialog(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleBulkImport} disabled={isBulkImporting} className="rounded-xl">
              {isBulkImporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
              {isBulkImporting ? "Importing..." : "Import"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="rounded-xl">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteContact} disabled={isDeleting} className="rounded-xl">
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
