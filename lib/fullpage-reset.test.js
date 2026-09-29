import test from "node:test";
import assert from "node:assert/strict";
import { resetFullPageState } from "./fullpage-reset.js";

test("resets stale full-page state before returning to the home page", () => {
  const calls = [];
  const fakeWindow = {
    scrollTo: (...args) => calls.push(["scrollTo", ...args]),
    requestAnimationFrame: (callback) => {
      calls.push(["raf"]);
      callback();
    },
  };
  const fakeDocument = {
    body: { classList: { remove: (name) => calls.push(["body.remove", name]) } },
    documentElement: { classList: { remove: (name) => calls.push(["html.remove", name]) } },
  };

  resetFullPageState(fakeWindow, fakeDocument);

  assert.deepEqual(calls, [
    ["body.remove", "fullpage-active"],
    ["html.remove", "fullpage-active"],
    ["scrollTo", { top: 0, left: 0, behavior: "auto" }],
    ["raf"],
    ["scrollTo", { top: 0, left: 0, behavior: "auto" }],
  ]);
});
