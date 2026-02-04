import useSWR from "swr";
import { contactsService } from "@/services/contacts.service";
import { contactGroupsService } from "@/services/contact-groups.service";
import { membersSmsService } from "@/services/members-sms.service";
import {
  Contact,
  ContactGroup,
  ContactGroupDetail,
  MemberPhone,
  VoicePart,
  MemberRole,
} from "@/types/sms";

/**
 * Hook to fetch all contacts
 */
export function useContacts() {
  const { data, error, isLoading, mutate } = useSWR<Contact[]>(
    "contacts",
    () => contactsService.listContacts(),
    { revalidateOnFocus: false }
  );

  return {
    contacts: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook to fetch all contact groups
 */
export function useContactGroups() {
  const { data, error, isLoading, mutate } = useSWR<ContactGroup[]>(
    "contact-groups",
    () => contactGroupsService.listGroups(),
    { revalidateOnFocus: false }
  );

  return {
    groups: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook to fetch a single contact group with contacts
 */
export function useContactGroup(groupId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<ContactGroupDetail>(
    groupId ? ["contact-group", groupId] : null,
    () => contactGroupsService.getGroup(groupId!),
    { revalidateOnFocus: false }
  );

  return {
    group: data,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook to fetch contacts in a group
 */
export function useGroupContacts(groupId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Contact[]>(
    groupId ? ["group-contacts", groupId] : null,
    () => contactGroupsService.getGroupContacts(groupId!),
    { revalidateOnFocus: false }
  );

  return {
    contacts: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook to fetch members with phone numbers
 */
export function useMembersWithPhones() {
  const { data, error, isLoading, mutate } = useSWR<MemberPhone[]>(
    "members-phones",
    () => membersSmsService.getMembersWithPhones(),
    { revalidateOnFocus: false }
  );

  return {
    members: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook to fetch members by voice part
 */
export function useMembersByPart(part: VoicePart | null) {
  const { data, error, isLoading, mutate } = useSWR<MemberPhone[]>(
    part ? ["members-by-part", part] : null,
    () => membersSmsService.getMembersByPart(part!),
    { revalidateOnFocus: false }
  );

  return {
    members: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook to fetch members by role
 */
export function useMembersByRole(role: MemberRole | null) {
  const { data, error, isLoading, mutate } = useSWR<MemberPhone[]>(
    role ? ["members-by-role", role] : null,
    () => membersSmsService.getMembersByRole(role!),
    { revalidateOnFocus: false }
  );

  return {
    members: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
