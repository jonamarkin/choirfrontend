/**
 * SWR hooks for events data fetching
 */

import useSWR from "swr";
import { eventsService } from "@/services/events.service";
import { EventListItem, Event, EventFilters } from "@/types/events";

/**
 * Hook to fetch events list with filters
 */
export function useEvents(filters?: EventFilters) {
  const { data, error, isLoading, mutate } = useSWR<EventListItem[]>(
    ["events", JSON.stringify(filters)],
    () => eventsService.listEvents(filters),
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  );

  return {
    events: data ?? [],
    count: data?.length ?? 0,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook to fetch single event details
 */
export function useEvent(slug: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Event>(
    slug ? ["event", slug] : null,
    () => eventsService.getEvent(slug!),
    {
      revalidateOnFocus: true,
    }
  );

  return {
    event: data,
    isLoading,
    error,
    mutate,
  };
}
