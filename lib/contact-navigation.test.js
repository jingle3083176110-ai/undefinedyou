import test from "node:test";
import assert from "node:assert/strict";
import { navigateToContact } from "./contact-navigation.js";

test("starts a clean navigation to the contact section", () => {
  const calls = [];
  const fakeWindow = {
    history: { scrollRestoration: "auto" },
    scrollTo: (value) => calls.push(value),
    location: { assign: (value) => calls.push(value) },
  };

  navigateToContact(fakeWindow);

  assert.equal(fakeWindow.history.scrollRestoration, "manual");
  assert.deepEqual(calls, [
    { top: 0, left: 0, behavior: "auto" },
    "/#contact",
  ]);
});
