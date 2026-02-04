"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  Check,
  Save,
  UsersRound,
  Users,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  UserMinus,
  Eye,
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PremiumStatCard } from "@/components/premium-stat-card";
import { tableContainerStyle } from "@/utils/premium-styles";

import { useContactGroups, useContacts, useGroupContacts } from "@/hooks/useSMS";
import { contactGroupsService } from "@/services/contact-groups.service";
import { ContactGroup, Contact } from "@/types/sms";

export default function ContactGroupsPage() {
  // Data
  const { groups, isLoading, mutate } = useContactGroups();
  const { contacts } = useContacts();

  // UI State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(10);

  // Sheet state
  const [selectedGroup, setSelectedGroup] = React.useState<ContactGroup | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState({ name: "", description: "" });
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "success">("idle");

  // Group contacts
  const { contacts: groupContacts, mutate: mutateGroupContacts, isLoading: groupContactsLoading } = useGroupContacts(selectedGroup?.id || null);

  // Add group dialog
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [addForm, setAddForm] = React.useState({ name: "", description: "" });
  const [isAdding, setIsAdding] = React.useState(false);

  // Add contacts dialog
  const [showAddContactsDialog, setShowAddContactsDialog] = React.useState(false);
  const [selectedContactIds, setSelectedContactIds] = React.useState<string[]>([]);
  const [isAddingContacts, setIsAddingContacts] = React.useState(false);
  const [contactSearch, setContactSearch] = React.useState("");

  // Delete confirmation
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Filter groups
  const filteredGroups = React.useMemo(() => {
    const groupList = Array.isArray(groups) ? groups : [];
    if (groupList.length === 0) return [];
    if (!searchQuery) return groupList;
    const search = searchQuery.toLowerCase();
    return groupList.filter(
      (g) =>
        g.name.toLowerCase().includes(search) ||
        g.description.toLowerCase().includes(search)
    );
  }, [groups, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Available contacts (not in group)
  const availableContacts = React.useMemo(() => {
    const safeGroupContacts = Array.isArray(groupContacts) ? groupContacts : [];
    const safeContacts = Array.isArray(contacts) ? contacts : [];
    
    const groupContactIds = new Set(safeGroupContacts.map((c) => c.id));
    let available = safeContacts.filter((c) => !groupContactIds.has(c.id));
    if (contactSearch) {
      const search = contactSearch.toLowerCase();
      available = available.filter(
        (c) => c.name.toLowerCase().includes(search) || c.phone_number.includes(search)
      );
    }
    return available;
  }, [contacts, groupContacts, contactSearch]);

  // Total contacts across all groups
  const totalContactsInGroups = React.useMemo(() => {
    return (Array.isArray(groups) ? groups : []).reduce((sum, g) => sum + g.contact_count, 0);
  }, [groups]);

  // Handlers
  const handleViewGroup = (group: ContactGroup) => {
    setSelectedGroup(group);
    setEditForm({ name: group.name, description: group.description });
    setIsEditing(false);
  };

  const handleCloseSheet = () => {
    setSelectedGroup(null);
    setEditForm({ name: "", description: "" });
    setIsEditing(false);
    setSaveStatus("idle");
  };

  const handleSaveEdit = async () => {
    if (!selectedGroup) return;

    setSaveStatus("saving");
    try {
      const updated = await contactGroupsService.updateGroup(selectedGroup.id, editForm);
      setSelectedGroup({ ...selectedGroup, ...updated });
      setSaveStatus("success");
      mutate();
      await new Promise((r) => setTimeout(r, 800));
      setIsEditing(false);
      setSaveStatus("idle");
      toast.success("Group updated");
    } catch (err) {
      setSaveStatus("idle");
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const handleAddGroup = async () => {
    if (!addForm.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsAdding(true);
    try {
      await contactGroupsService.createGroup(addForm);
      mutate();
      setShowAddDialog(false);
      setAddForm({ name: "", description: "" });
      toast.success("Group created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await contactGroupsService.deleteGroup(deleteId);
      mutate();
      setDeleteId(null);
      handleCloseSheet();
      toast.success("Group deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddContactsToGroup = async () => {
    if (!selectedGroup || selectedContactIds.length === 0) return;

    setIsAddingContacts(true);
    try {
      await contactGroupsService.addContacts(selectedGroup.id, {
        contact_ids: selectedContactIds,
      });
      mutateGroupContacts();
      mutate();
      setShowAddContactsDialog(false);
      setSelectedContactIds([]);
      setContactSearch("");
      toast.success(`Added ${selectedContactIds.length} contact(s) to group`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add contacts");
    } finally {
      setIsAddingContacts(false);
    }
  };

  const handleRemoveContactFromGroup = async (contactId: string) => {
    if (!selectedGroup) return;

    try {
      await contactGroupsService.removeContacts(selectedGroup.id, {
        contact_ids: [contactId],
      });
      mutateGroupContacts();
      mutate();
      toast.success("Contact removed from group");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove");
    }
  };

  // Toggle contact selection
  const toggleContactSelection = (contactId: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
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
            Contact Groups
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize contacts into groups for batch messaging
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="gap-2 rounded-xl bg-gradient-to-br from-primary to-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create Group
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <PremiumStatCard value={(Array.isArray(groups) ? groups : []).length} label="Total Groups" variant="primary" />
        <PremiumStatCard value={totalContactsInGroups} label="Contacts in Groups" variant="secondary" />
        <PremiumStatCard value={(Array.isArray(contacts) ? contacts : []).length} label="Total Contacts" variant="gold" />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search groups..."
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
                <TableHead className="hidden md:table-cell h-10 px-6 text-[13px] font-semibold uppercase tracking-wider">Description</TableHead>
                <TableHead className="h-10 px-6 text-center text-[13px] font-semibold uppercase tracking-wider w-[120px]">Contacts</TableHead>
                <TableHead className="h-10 px-6 text-center text-[13px] font-semibold uppercase tracking-wider w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedGroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    {(Array.isArray(groups) ? groups : []).length === 0 ? "No groups yet. Create your first group!" : "No groups match your search"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedGroups.map((group, index) => (
                  <TableRow
                    key={group.id}
                    className={cn("border-border/20 transition-all hover:bg-accent/30", index === paginatedGroups.length - 1 && "border-0")}
                  >
                    <TableCell className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <UsersRound className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium">{group.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell py-3 px-6 text-muted-foreground">
                      {group.description || "—"}
                    </TableCell>
                    <TableCell className="py-3 px-6 text-center">
                      <Badge variant="secondary" className="rounded-full">
                        {group.contact_count}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 px-6">
                      <div className="flex items-center justify-center gap-1">
                        <Button onClick={() => handleViewGroup(group)} variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => {
                            handleViewGroup(group);
                            setTimeout(() => setIsEditing(true), 100);
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => setDeleteId(group.id)} variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive">
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
            Showing {paginatedGroups.length} of {filteredGroups.length}
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

      {/* View/Edit Group Sheet */}
      <Sheet open={!!selectedGroup} onOpenChange={handleCloseSheet}>
        <SheetContent className="sm:max-w-[450px] p-0 flex flex-col">
          <SheetTitle className="sr-only">Group Details</SheetTitle>
          <SheetDescription className="sr-only">View and manage group</SheetDescription>
          {selectedGroup && (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-6 pt-8 pb-6 border-b border-border/20">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
                  <UsersRound className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">{selectedGroup.name}</h2>
                {selectedGroup.description && (
                  <p className="text-sm text-muted-foreground mt-1">{selectedGroup.description}</p>
                )}
                <Badge variant="secondary" className="mt-3 rounded-full">
                  {selectedGroup.contact_count} contact(s)
                </Badge>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="edit"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label>Group Name</Label>
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="rounded-xl"
                          rows={3}
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Group Members */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Group Members
                          </h3>
                          <Button
                            onClick={() => setShowAddContactsDialog(true)}
                            size="sm"
                            variant="outline"
                            className="h-8 rounded-lg gap-1"
                          >
                            <UserPlus className="h-3.5 w-3.5" />
                            Add
                          </Button>
                        </div>

                        {groupContactsLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        ) : groupContacts.length === 0 ? (
                          <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed border-border/40 rounded-xl">
                            No contacts in this group yet
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {groupContacts.map((contact) => (
                              <div
                                key={contact.id}
                                className="flex items-center justify-between p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                    <Users className="h-4 w-4 text-primary" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">{contact.name}</div>
                                    <div className="text-xs text-muted-foreground">{contact.phone_number}</div>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => handleRemoveContactFromGroup(contact.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <UserMinus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
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
                      {saveStatus === "saving" ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : saveStatus === "success" ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {saveStatus === "saving" ? "Saving..." : saveStatus === "success" ? "Saved!" : "Save"}
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="w-full rounded-xl bg-gradient-to-br from-primary to-primary/90">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Group
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Group Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription>Create a new contact group</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Group Name *</Label>
              <Input
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                placeholder="e.g., Soprano Section"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={addForm.description}
                onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                placeholder="Optional description..."
                className="rounded-xl"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleAddGroup} disabled={isAdding} className="rounded-xl">
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {isAdding ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Contacts to Group Dialog */}
      <Dialog open={showAddContactsDialog} onOpenChange={setShowAddContactsDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add Contacts to Group</DialogTitle>
            <DialogDescription>Select contacts to add to "{selectedGroup?.name}"</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                placeholder="Search contacts..."
                className="pl-9 rounded-xl"
              />
            </div>
            <ScrollArea className="h-[300px] border rounded-xl">
              {availableContacts.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  {contacts.length === groupContacts.length
                    ? "All contacts are already in this group"
                    : "No contacts match your search"}
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {availableContacts.map((contact) => (
                    <label
                      key={contact.id}
                      className="flex items-center gap-3 p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        checked={selectedContactIds.includes(contact.id)}
                        onCheckedChange={() => toggleContactSelection(contact.id)}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{contact.name}</div>
                        <div className="text-xs text-muted-foreground">{contact.phone_number}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </ScrollArea>
            {selectedContactIds.length > 0 && (
              <div className="mt-3 text-sm text-muted-foreground">
                {selectedContactIds.length} contact(s) selected
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddContactsDialog(false);
                setSelectedContactIds([]);
                setContactSearch("");
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddContactsToGroup}
              disabled={isAddingContacts || selectedContactIds.length === 0}
              className="rounded-xl"
            >
              {isAddingContacts ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              {isAddingContacts ? "Adding..." : `Add ${selectedContactIds.length} Contact(s)`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this group? Contacts in the group will not be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="rounded-xl">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteGroup} disabled={isDeleting} className="rounded-xl">
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
