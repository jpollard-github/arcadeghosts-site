import test from "node:test";
import assert from "node:assert/strict";
import {
  getAmbientTimeModeForHour,
  normalizeAmbientTimeMode,
} from "../../app/ambient/ambient-time";

test("normalizeAmbientTimeMode accepts supported query values", () => {
  assert.equal(normalizeAmbientTimeMode("morning"), "morning");
  assert.equal(normalizeAmbientTimeMode(" afternoon "), "afternoon");
  assert.equal(normalizeAmbientTimeMode("evening"), "evening");
  assert.equal(normalizeAmbientTimeMode("late-night"), "late-night");
  assert.equal(normalizeAmbientTimeMode("latenight"), "late-night");
  assert.equal(normalizeAmbientTimeMode("storm"), null);
});

test("getAmbientTimeModeForHour maps local hours into ambient bands", () => {
  assert.equal(getAmbientTimeModeForHour(7), "morning");
  assert.equal(getAmbientTimeModeForHour(13), "afternoon");
  assert.equal(getAmbientTimeModeForHour(19), "evening");
  assert.equal(getAmbientTimeModeForHour(2), "late-night");
  assert.equal(getAmbientTimeModeForHour(23), "late-night");
});
