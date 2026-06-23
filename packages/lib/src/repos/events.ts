import { appendRow, deleteRow, readAll, updateRow } from "../sheets";
import { SHEETS, type EventItem } from "../types";
import { generateId } from "../utils";
import type { EventInput } from "../validation";

export async function getAllEvents(): Promise<EventItem[]> {
  const rows = await readAll<EventItem>(SHEETS.events);
  return rows.sort((a, b) => (a.eventDate > b.eventDate ? 1 : -1));
}

/** Agenda mendatang (tanggal >= hari ini). */
export async function getUpcomingEvents(limit?: number): Promise<EventItem[]> {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = (await getAllEvents()).filter((e) => e.eventDate >= today);
  return limit ? upcoming.slice(0, limit) : upcoming;
}

export async function getEventById(id: string): Promise<EventItem | null> {
  const all = await readAll<EventItem>(SHEETS.events);
  return all.find((e) => e.id === id) ?? null;
}

export async function createEvent(input: EventInput): Promise<EventItem> {
  const event: EventItem = {
    id: generateId(),
    title: input.title,
    description: input.description,
    eventDate: input.eventDate,
    location: input.location,
    poster: input.poster,
    createdAt: new Date().toISOString(),
  };
  await appendRow(SHEETS.events, event as unknown as Record<string, unknown>);
  return event;
}

export async function updateEvent(
  id: string,
  input: EventInput,
): Promise<EventItem | null> {
  const existing = await getEventById(id);
  if (!existing) return null;
  const updated: EventItem = { ...existing, ...input };
  const ok = await updateRow(
    SHEETS.events,
    id,
    updated as unknown as Record<string, unknown>,
  );
  return ok ? updated : null;
}

export async function deleteEvent(id: string): Promise<boolean> {
  return deleteRow(SHEETS.events, id);
}
