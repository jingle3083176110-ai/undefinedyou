import { getProjects, getCourses, getJournalEntries, getPhotos, getPhotoThemes, getPhotoWorkshops } from "../lib/content/local-source.js";
import { collectionPhotoRows } from "./content-import-utils.mjs";

const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!baseUrl || !secretKey) {
  throw new Error("请先设置 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SECRET_KEY，再运行导入。");
}

const endpoint = `${baseUrl.replace(/\/$/, "")}/rest/v1`;

async function replaceRows(table, rows) {
  const conflict = table === "photos" ? "id" : table === "courses" ? "code" : table === "collection_photos" ? "collection_id,photo_id" : "slug";
  if (!rows.length) return;
  const response = await fetch(`${endpoint}/${table}?on_conflict=${conflict}`, {
    method: "POST",
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(rows),
  });
  if (!response.ok) throw new Error(`${table}: ${response.status} ${await response.text()}`);
}

async function fetchRows(table, query) {
  const response = await fetch(`${endpoint}/${table}?${query}`, { headers: { apikey: secretKey, Authorization: `Bearer ${secretKey}` } });
  if (!response.ok) throw new Error(`${table}: ${response.status} ${await response.text()}`);
  return response.json();
}

const projects = getProjects().map((item) => ({
  slug: item.slug,
  title: item.title,
  descriptions: item.desc || [],
  year: item.year || "",
  preview_url: item.preview || "",
  code_url: item.code || "",
  thumbnail_url: item.thumbnail || "",
  images: item.images || [],
  technologies: item.tech || [],
  categories: item.category || [],
  featured: Boolean(item.featured),
  published: Boolean(item.show),
}));

const courses = getCourses().map((item) => ({
  code: item.code,
  title: item.title,
  term_id: item.term.id,
  term_year: item.term.year,
  term_name: item.term.name,
  term_name_zh: item.term.nameZh,
  institution: item.institution || "",
  instructor: item.instructor || "",
  description: item.description || "",
  notes_url: item.notesUrl || "",
  published: true,
}));

const journalEntries = getJournalEntries().map((item) => ({
  slug: item.slug,
  entry_date: item.date || null,
  title: item.title,
  photo_url: item.photo || "",
  short_note: item.shortNote || "",
  location: item.location || "",
  tags: item.tags || [],
  published: true,
}));

const photos = getPhotos().map((item) => ({
  id: item.id,
  storage_path: item.src,
  alt: item.alt || "",
  photo_date: item.date || null,
  location: item.location || "",
  location_zh: item.locationZh || "",
  note: item.note || "",
  note_zh: item.noteZh || "",
  aspect: item.aspect || "landscape",
  published: true,
}));

const sourceCollections = [
  ...getPhotoThemes().map((item) => ({ ...item, collection_type: "theme" })),
  ...getPhotoWorkshops().map((item) => ({ ...item, collection_type: "workshop" })),
];

const collections = sourceCollections.map((item) => ({
  slug: item.slug,
  collection_type: item.collection_type,
  title: item.title,
  title_zh: item.titleZh || "",
  intro: item.intro || "",
  intro_zh: item.introZh || "",
  date_range: item.dateRange || "",
  location: item.location || "",
  location_zh: item.locationZh || "",
  cover_photo_id: item.coverId || item.imageIds?.[0] || "",
  published: true,
}));

await replaceRows("projects", projects);
await replaceRows("courses", courses);
await replaceRows("journal_entries", journalEntries);
await replaceRows("photos", photos);
await replaceRows("photo_collections", collections);

const collectionRows = await fetchRows("photo_collections", "select=id,slug");
const collectionIds = new Map(collectionRows.map((row) => [row.slug, row.id]));
const collectionPhotos = collectionPhotoRows(sourceCollections, collectionIds);
await replaceRows("collection_photos", collectionPhotos);

console.log(JSON.stringify({
  projects: projects.length,
  courses: courses.length,
  journalEntries: journalEntries.length,
  photos: photos.length,
  collections: collections.length,
  collectionPhotos: collectionPhotos.length,
}, null, 2));
