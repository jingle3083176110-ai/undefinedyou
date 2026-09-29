import * as localSource from "./local-source.js";
import * as supabaseSource from "./supabase-source.js";

export const contentSource = process.env.CONTENT_SOURCE || "supabase";

function getSource() {
  if (contentSource === "local") return localSource;
  if (contentSource === "supabase") return supabaseSource;
  throw new Error(`Unsupported CONTENT_SOURCE: ${contentSource}`);
}

export function getProjects() {
  return getSource().getProjects();
}

export function getCourses() {
  return getSource().getCourses();
}

export function getJournalEntries() {
  return getSource().getJournalEntries();
}

export function getPhotos() {
  return getSource().getPhotos();
}

export function getPhotoThemes() {
  return getSource().getPhotoThemes();
}

export function getPhotoWorkshops() {
  return getSource().getPhotoWorkshops();
}
