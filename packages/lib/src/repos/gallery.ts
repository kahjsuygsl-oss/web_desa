import { appendRow, deleteRow, readAll } from "../sheets";
import { SHEETS, type Photo, type Video } from "../types";
import { generateId } from "../utils";
import type { PhotoInput, VideoInput } from "../validation";

// ---------- Foto ----------
export async function getAllPhotos(): Promise<Photo[]> {
  const rows = await readAll<Photo>(SHEETS.photos);
  return rows.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
}

export async function getLatestPhotos(limit = 8): Promise<Photo[]> {
  return (await getAllPhotos()).slice(0, limit);
}

export async function createPhoto(input: PhotoInput): Promise<Photo> {
  const photo: Photo = {
    id: generateId(),
    title: input.title,
    imageUrl: input.imageUrl,
    createdAt: new Date().toISOString(),
  };
  await appendRow(SHEETS.photos, photo as unknown as Record<string, unknown>);
  return photo;
}

export async function deletePhoto(id: string): Promise<boolean> {
  return deleteRow(SHEETS.photos, id);
}

// ---------- Video ----------
export async function getAllVideos(): Promise<Video[]> {
  const rows = await readAll<Video>(SHEETS.videos);
  return rows.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
}

export async function createVideo(input: VideoInput): Promise<Video> {
  const video: Video = {
    id: generateId(),
    title: input.title,
    youtubeUrl: input.youtubeUrl,
    createdAt: new Date().toISOString(),
  };
  await appendRow(SHEETS.videos, video as unknown as Record<string, unknown>);
  return video;
}

export async function deleteVideo(id: string): Promise<boolean> {
  return deleteRow(SHEETS.videos, id);
}
