import test from "node:test";
import assert from "node:assert/strict";
import { labelForUi, formatDay } from "../src/utils/labels.mjs";
import { validateSession } from "../src/utils/model.mjs";
test("Turkish labels preserve stored enum values", () => {
  const stored = { effort: "Steady", attempts: 10, successes: 7, seconds: 60 };
  assert.equal(labelForUi(stored.effort), "Orta");
  assert.equal(stored.effort, "Steady");
  assert.equal(validateSession(stored), null);
});
test("custom labels never resolve inherited object properties", () => {
  assert.equal(labelForUi("constructor"), "constructor");
  assert.equal(labelForUi("toString"), "toString");
  assert.equal(labelForUi("Antrenmanım"), "Antrenmanım");
});
test("Turkish dates retain their underlying sortable day key", () => {
  const key = "2026-10-19";
  assert.equal(formatDay(key), "19.10.2026");
  assert.equal(key, "2026-10-19");
});
