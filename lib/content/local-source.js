import fs from "node:fs";
import path from "node:path";
import { courseTerms } from "../courses.js";
import { galleryPhotos, photoThemes, photoWorkshops } from "../photos.js";

function readJson(relativePath) {
  const source = fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
  return JSON.parse(source);
}

export function getProjects() {
  return readJson("json/data.json").Projects;
}

export function getCourses() {
  return courseTerms.flatMap((term) => term.courses.map((course) => ({ ...course, term: { id: term.id, year: term.year, name: term.term, nameZh: term.termZh } })));
}

export function getJournalEntries() {
  return readJson("json/journal.json").Entries;
}

export function getPhotos() {
  return galleryPhotos;
}

export function getPhotoThemes() {
  return photoThemes;
}

export function getPhotoWorkshops() {
  return photoWorkshops;
}
