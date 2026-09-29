import test from "node:test";
import assert from "node:assert/strict";
import {
  getProjects,
  getCourses,
  getJournalEntries,
  getPhotos,
  getPhotoThemes,
  getPhotoWorkshops,
  contentSource,
} from "./repository.js";

test("local repository exposes the existing structured content", async () => {
  assert.equal(contentSource, "local");
  assert.equal((await getProjects()).length, 1);
  assert.equal((await getCourses()).length, 19);
  assert.deepEqual((await getJournalEntries()).map((entry) => entry.slug), ["a-placeholder-fragment", "reading-note"]);
  assert.equal((await getPhotos()).length, 69);
  assert.deepEqual((await getPhotoThemes()).map((theme) => theme.slug), ["landscape", "people", "food"]);
  assert.equal((await getPhotoWorkshops()).length, 3);
});

test("repository keeps stable project and journal identifiers", async () => {
  const projects = await getProjects();
  const entries = await getJournalEntries();
  assert.equal(projects[0].slug, "puji");
  assert.ok(entries.every((entry) => entry.slug && entry.date));
});
