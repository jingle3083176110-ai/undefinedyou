import test from "node:test";
import assert from "node:assert/strict";
import { courseTerms, getCourseCount } from "./courses.js";

test("course archive contains all four terms and 21 courses", () => {
  assert.equal(courseTerms.length, 4);
  assert.equal(getCourseCount(), 21);
});

test("each course has the fields needed by the expandable course row", () => {
  for (const term of courseTerms) {
    for (const course of term.courses) {
      assert.ok(course.code);
      assert.ok(course.title);
      assert.equal(typeof course.institution, "string");
      assert.equal(typeof course.instructor, "string");
      assert.equal(typeof course.description, "string");
      assert.equal(typeof course.notesUrl, "string");
    }
  }
});
