/**
 * Events Service
 * API methods for event management
 */

import { apiClient } from "@/lib/api-client";
import {
  Event,
  EventListItem,
  EventFormData,
  EventFilters,
  RecurringEventRequest,
} from "@/types/events";

export const eventsService = {
  /**
   * List all events with optional filters
   * Accessible by all authenticated users
   */
  async listEvents(filters?: EventFilters): Promise<EventListItem[]> {
    const params: Record<string, string> = {};
    
    if (filters?.event_type) params.event_type = filters.event_type;
    if (filters?.status) params.status = filters.status;
    if (filters?.start_date) params.start_date = filters.start_date;
    if (filters?.end_date) params.end_date = filters.end_date;
    if (filters?.upcoming !== undefined) params.upcoming = String(filters.upcoming);

    const response = await apiClient.get<EventListItem[] | { results: EventListItem[] }>("/events/", { params });
    
    if (Array.isArray(response)) {
        return response;
    }
    // Handle paginated response
    return (response as { results: EventListItem[] }).results || [];
  },

  /**
   * Get event details by ID
   * Accessible by all authenticated users
   */
  async getEvent(slug: string): Promise<Event> {
    return apiClient.get<Event>(`/events/${slug}/`);
  },

  /**
   * Create a new event
   * Requires: super_admin, admin, or attendance_officer role
   */
  async createEvent(data: EventFormData): Promise<Event> {
    return apiClient.post<Event>("/events/", data);
  },

  /**
   * Update an existing event (partial update)
   * Requires: super_admin, admin, or attendance_officer role
   */
  async updateEvent(slug: string, data: Partial<EventFormData>): Promise<Event> {
    return apiClient.patch<Event>(`/events/${slug}/`, data);
  },

  /**
   * Delete an event
   * Requires: super_admin, admin, or attendance_officer role
   */
  async deleteEvent(slug: string): Promise<void> {
    return apiClient.delete(`/events/${slug}/`);
  },

  /**
   * Create a recurring series of events
   * Requires: super_admin, admin, or attendance_officer role
   */
  async createRecurringEvent(data: RecurringEventRequest): Promise<Event[]> {
    return apiClient.post<Event[]>("/events/recurring/", data);
  },
};
