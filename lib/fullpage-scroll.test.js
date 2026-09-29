import test from "node:test";
import assert from "node:assert/strict";
import { isBrowserZoomed } from "./fullpage-scroll.js";

test("recognizes browser zoom so full-page wheel interception can be bypassed", () => {
  assert.equal(isBrowserZoomed({ scale: 1, innerWidth: 1502, outerWidth: 1502 }), false);
  assert.equal(isBrowserZoomed({ scale: 1.01, innerWidth: 1502, outerWidth: 1502 }), false);
  assert.equal(isBrowserZoomed({ scale: 1.5, innerWidth: 1502, outerWidth: 1502 }), true);
  assert.equal(isBrowserZoomed({ scale: 1, innerWidth: 751, outerWidth: 1502 }), true);
  assert.equal(isBrowserZoomed(), false);
});
