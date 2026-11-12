const test = require("node:test");
const assert = require("node:assert/strict");
const Game = require("../game.js");
const { ROOMS, QUESTIONS } = require("../questions.js");
const results = QUESTIONS.map((q) => ({
  answer: q.answer,
  correct: true,
  hint: false,
  at: 2000,
}));
const state = {
  version: 1,
  id: "CF-test",
  name: "Ana García",
  group: "1 DAW",
  started: 1000,
  finished: 2000,
  results,
  hint: false,
  review: false,
};
test("los 18 retos cubren las tres salas y tienen respuestas válidas", () => {
  assert.equal(QUESTIONS.length, 18);
  assert.equal(ROOMS.length, 3);
  for (let room = 0; room < 3; room++)
    assert.equal(QUESTIONS.filter((q) => q.room === room).length, 6);
  for (const q of QUESTIONS) {
    assert.ok(q.hint && q.explanation && q.prompt);
    if (q.options) assert.ok(q.options[q.answer]);
  }
});
test("el pleno da un 10 y cada sala tiene seis puntos", () => {
  const totals = Game.summary(results, QUESTIONS);
  assert.equal(totals.grade, 10);
  assert.equal(totals.earned, 18);
  assert.equal(totals.correct, 18);
  assert.deepEqual(
    totals.rooms.map((r) => r.earned),
    [6, 6, 6],
  );
});
test("las pistas descuentan solo del acierto de su reto", () => {
  const mixed = results.map((r) => ({ ...r }));
  mixed[0].hint = true;
  mixed[1] = { ...mixed[1], correct: false, hint: true };
  const totals = Game.summary(mixed, QUESTIONS);
  assert.equal(totals.earned, 16.75);
  assert.equal(totals.hints, 2);
  assert.equal(totals.rooms[0].earned, 4.75);
  assert.equal(totals.grade, (16.75 / 18) * 10);
  assert.equal(
    Game.summary(
      results.map((r) => ({ ...r, hint: true })),
      QUESTIONS,
    ).grade,
    7.5,
  );
  assert.equal(
    Game.summary(
      results.map((r) => ({ ...r, correct: false })),
      QUESTIONS,
    ).grade,
    0,
  );
});
test("las respuestas escritas toleran espacios y mayúsculas", () => {
  assert.equal(Game.normalize("  HREF  "), "href");
  assert.equal(Game.normalize(" .aviso "), ".aviso");
  assert.notEqual(Game.normalize("aviso"), ".aviso");
});
test("el progreso guardado se valida antes de recuperarlo", () => {
  assert.ok(Game.validState(state, QUESTIONS));
  assert.ok(
    Game.validState(
      { ...state, results: results.slice(0, 3), finished: null },
      QUESTIONS,
    ),
  );
  for (const bad of [
    null,
    {},
    { ...state, version: 99 },
    { ...state, review: true, results: [], finished: null },
    { ...state, finished: null },
    { ...state, name: "" },
    { ...state, results: [...results, results[0]] },
    { ...state, started: "ayer" },
    { ...state, finished: 500 },
    { ...state, results: results.slice(0, 3) },
    { ...state, results: [{ ...results[0], correct: false }] },
  ])
    assert.equal(Game.validState(bad, QUESTIONS), false);
});
