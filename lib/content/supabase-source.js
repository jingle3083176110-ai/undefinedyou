function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase content source requires NEXT_PUBLIC_SUPABASE_URL and an API key.");
  return { endpoint: `${url.replace(/\/$/, "")}/rest/v1`, key };
}

async function select(table, query) {
  const { endpoint, key } = config();
  const response = await fetch(`${endpoint}/${table}?${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    next: { revalidate: 60 },
  });
  if (!response.ok) throw new Error(`Supabase ${table} query failed: ${response.status} ${await response.text()}`);
  return response.json();
}

export async function getProjects() {
  const rows = await select("projects", "select=slug,title,descriptions,year,preview_url,code_url,thumbnail_url,images,technologies,categories,featured&published=eq.true&order=featured.desc,updated_at.desc");
  return rows.map((project) => ({
    slug: project.slug,
    title: project.title,
    desc: project.descriptions,
    year: project.year,
    preview: project.preview_url,
    code: project.code_url,
    thumbnail: project.thumbnail_url,
    images: project.images,
    tech: project.technologies,
    category: project.categories,
    featured: project.featured,
    show: true,
  }));
}

export async function getCourses() {
  const rows = await select("courses", "select=code,title,term_id,term_year,term_name,term_name_zh,institution,instructor,description,notes_url&published=eq.true&order=term_id,code");
  return rows.map((course) => ({
    code: course.code,
    title: course.title,
    institution: course.institution,
    instructor: course.instructor,
    description: course.description,
    notesUrl: course.notes_url,
    term: { id: course.term_id, year: course.term_year, name: course.term_name, nameZh: course.term_name_zh },
  }));
}

export async function getJournalEntries() {
  const rows = await select("journal_entries", "select=slug,entry_date,title,photo_url,short_note,location,tags&published=eq.true&order=entry_date.desc");
  return rows.map((entry) => ({
    slug: entry.slug,
    date: entry.entry_date || "",
    title: entry.title,
    photo: entry.photo_url,
    shortNote: entry.short_note,
    location: entry.location,
    tags: entry.tags,
  }));
}

export async function getPhotos() {
  const rows = await select("photos", "select=id,storage_path,alt,photo_date,location,location_zh,note,note_zh,aspect&published=eq.true&order=photo_date.desc.nullslast");
  return rows.map(({ original_path, ...photo }) => ({
    id: photo.id, src: photo.storage_path, alt: photo.alt, date: photo.photo_date || "",
    location: photo.location, locationZh: photo.location_zh, note: photo.note, noteZh: photo.note_zh,
    aspect: photo.aspect,
  }));
}

async function getCollections(type) {
  const rows = await select("photo_collections", `select=id,slug,title,title_zh,intro,intro_zh,date_range,location,location_zh,cover_photo_id,collection_photos(photo_id,sort_order)&collection_type=eq.${type}&published=eq.true&order=slug`);
  return rows.map((item) => ({
    slug: item.slug, title: item.title, titleZh: item.title_zh, intro: item.intro, introZh: item.intro_zh,
    dateRange: item.date_range, location: item.location, locationZh: item.location_zh,
    imageIds: (item.collection_photos || []).sort((a, b) => a.sort_order - b.sort_order).map((photo) => photo.photo_id), coverId: item.cover_photo_id,
  }));
}

export const getPhotoThemes = () => getCollections("theme");
export const getPhotoWorkshops = () => getCollections("workshop");
