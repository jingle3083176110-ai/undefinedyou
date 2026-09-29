import { NextResponse } from "next/server.js";
import {
  getProjects,
  getCourses,
  getJournalEntries,
  getPhotos,
  getPhotoThemes,
  getPhotoWorkshops,
} from "../../../lib/content/repository.js";

function publicPhoto(photo) {
  const { original_path, originalPath, ...publicPhoto } = photo;
  return publicPhoto;
}

function publicContent(content) {
  return {
    ...content,
    photos: content.photos.map(publicPhoto),
  };
}

async function loadContent() {
  const [projects, courses, journalEntries, photos, photoThemes, photoWorkshops] = await Promise.all([
    getProjects(),
    getCourses(),
    getJournalEntries(),
    getPhotos(),
    getPhotoThemes(),
    getPhotoWorkshops(),
  ]);

  return { projects, courses, journalEntries, photos, photoThemes, photoWorkshops };
}

export async function createContentResponse(contentLoader = loadContent) {
  const content = publicContent(await contentLoader());
  return NextResponse.json(content, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}

export async function GET() {
  return createContentResponse();
}
