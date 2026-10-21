import test from "node:test";
import assert from "node:assert/strict";
import {
  aggregate,
  challengeProgress,
  streak,
  validateSession,
  dayKey,
  isState,
} from "../src/utils/model.mjs";
const sample = (day, extras = {}) => ({
  id: day,
  skillId: "s",
  day,
  attempts: 10,
  successes: 6,
  seconds: 120,
  notes: "",
  effort: "Steady",
  ...extras,
});
test("challenge excludes sessions outside its date window and skill", () => {
  const c = {
    startDay: "2026-10-01",
    endDay: "2026-10-07",
    skillId: "s",
    metric: "successes",
    target: 10,
  };
  const sessions = [
    sample("2026-09-30"),
    sample("2026-10-02"),
    sample("2026-10-03", { skillId: "other" }),
    sample("2026-10-08"),
  ];
  assert.deepEqual(challengeProgress(c, sessions), {
    value: 6,
    percent: 60,
    complete: false,
  });
});
test("aggregate weights accuracy by attempts and sums seconds", () => {
  assert.deepEqual(
    aggregate([
      sample("a"),
      sample("b", { attempts: 100, successes: 50, seconds: 60 }),
    ]),
    { attempts: 110, successes: 56, minutes: 3, sessions: 2 },
  );
});
test("streak accepts yesterday and handles month boundaries", () => {
  assert.equal(
    streak([sample("2026-09-30"), sample("2026-10-01")], new Date(2026, 9, 2)),
    2,
  );
  assert.equal(streak([sample("2026-09-30")], new Date(2026, 9, 3)), 0);
});
test("session refuses impossible results", () => {
  assert.ok(validateSession({ attempts: 10, successes: 11, seconds: 20 }));
  assert.ok(validateSession({ attempts: 1, successes: 1, seconds: NaN }));
  assert.equal(
    validateSession({ attempts: 10, successes: 0, seconds: 60 }),
    null,
  );
});
test("day keys use local calendar, not UTC", () =>
  assert.equal(dayKey(new Date(2026, 9, 2, 0, 1)), "2026-10-02"));
test("backups reject orphan session references", () => {
  const value = {
    schema: 1,
    skills: [
      {
        id: "s",
        name: "Drill",
        goal: 10,
        duration: 5,
        sport: "Fitness",
        instructions: "",
        archived: false,
      },
    ],
    sessions: [sample("2026-10-01", { skillId: "missing" })],
    challenges: [],
  };
  assert.equal(isState(value), false);
  value.sessions[0].skillId = "s";
  assert.equal(isState(value), true);
});

test("malformed backups fail validation without throwing", () => {
  assert.equal(
    isState({ schema: 1, skills: [null], sessions: [], challenges: [] }),
    false,
  );
  assert.equal(
    isState({
      schema: 1,
      skills: [{ id: "x", name: 12 }],
      sessions: [],
      challenges: [],
    }),
    false,
  );
});

test("minute challenges count elapsed time and preserve legacy backups", () => {
  const base = {
    startDay: "2026-10-01",
    endDay: "2026-10-07",
    skillId: "s",
    metric: "minutes",
    target: 10,
  };
  const records = [sample("2026-10-02", { seconds: 180, successes: 8 })];
  assert.equal(challengeProgress(base, records).value, 3);
  assert.equal(
    challengeProgress({ ...base, metric: "minutos" }, records).value,
    3,
  );
});
