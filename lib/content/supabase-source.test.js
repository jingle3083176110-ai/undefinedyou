import test from "node:test";
import assert from "node:assert/strict";
import {
  getCourses,
  getJournalEntries,
  getPhotoThemes,
  getPhotos,
  getProjects,
} from "./supabase-source.js";

test("Supabase photos never expose private original paths", async () => {
  const previousFetch = globalThis.fetch;
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const previousKey = process.env.SUPABASE_SECRET_KEY;

  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SECRET_KEY = "test-secret";
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => [{
      id: "photo-1",
      storage_path: "https://example.supabase.co/storage/v1/object/public/photo-previews/one.webp",
      original_path: "private/originals/one.tiff",
      alt: "A private test photo",
      photo_date: "2026-09-28",
      location: "Suzhou",
      location_zh: "苏州",
      note: "Preview only",
      note_zh: "仅展示预览图",
      aspect: "landscape",
    }],
  });

  try {
    const [photo] = await getPhotos();

    assert.equal(photo.src, "https://example.supabase.co/storage/v1/object/public/photo-previews/one.webp");
    assert.equal(Object.hasOwn(photo, "originalPath"), false);
    assert.equal(Object.hasOwn(photo, "original_path"), false);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousKey === undefined) delete process.env.SUPABASE_SECRET_KEY;
    else process.env.SUPABASE_SECRET_KEY = previousKey;
  }
});

test("Supabase content only selects and returns public fields, including ordered collection photos", async () => {
  const previousFetch = globalThis.fetch;
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const previousKey = process.env.SUPABASE_SECRET_KEY;
  const requests = [];

  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SECRET_KEY = "test-secret";
  globalThis.fetch = async (url) => {
    const request = String(url);
    requests.push(request);
    const rows = request.includes("/projects?") ? [{
      slug: "project", title: "Project", descriptions: ["Public"], year: "2026", preview_url: "",
      code_url: "", thumbnail_url: "", images: [], technologies: [], categories: [], featured: true,
      internal_only: "do not leak",
    }] : request.includes("/courses?") ? [{
      code: "TEST", title: "Course", term_id: "term", term_year: "2026", term_name: "Term", term_name_zh: "学期",
      institution: "University", instructor: "Teacher", description: "Public", notes_url: "", internal_only: "do not leak",
    }] : request.includes("/journal_entries?") ? [{
      slug: "entry", entry_date: "2026-09-28", title: "Entry", photo_url: "", short_note: "Public", location: "", tags: [],
      internal_only: "do not leak",
    }] : request.includes("/photo_collections?") ? [{
      id: "collection-id", slug: "theme", title: "Theme", title_zh: "主题", intro: "Public", intro_zh: "公开",
      date_range: "", location: "", location_zh: "", cover_photo_id: "photo-2", internal_only: "do not leak",
      collection_photos: [
        { photo_id: "photo-1", sort_order: 1, internal_only: "do not leak" },
        { photo_id: "photo-2", sort_order: 0, internal_only: "do not leak" },
      ],
    }] : [{
      id: "photo-1", storage_path: "/preview.webp", alt: "Preview", photo_date: "2026-09-28", location: "", location_zh: "",
      note: "", note_zh: "", aspect: "landscape", original_path: "private/original.tiff", internal_only: "do not leak",
    }];
    return { ok: true, json: async () => rows };
  };

  try {
    const [project] = await getProjects();
    const [course] = await getCourses();
    const [entry] = await getJournalEntries();
    const [photo] = await getPhotos();
    const [theme] = await getPhotoThemes();

    for (const item of [project, course, entry, photo, theme]) {
      assert.equal(Object.hasOwn(item, "internal_only"), false);
    }
    assert.deepEqual(theme.imageIds, ["photo-2", "photo-1"]);
    assert.ok(requests.every((request) => !request.includes("select=*")));
  } finally {
    globalThis.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousKey === undefined) delete process.env.SUPABASE_SECRET_KEY;
    else process.env.SUPABASE_SECRET_KEY = previousKey;
  }
});
