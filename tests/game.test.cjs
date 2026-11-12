const test = require("node:test");
const assert = require("node:assert/strict");
const Game = require("../game.js");
const { ROOMS, QUESTIONS, LEGACY_QUESTIONS } = require("../questions.js");
const results = QUESTIONS.map((q) => ({
  answer: q.answer,
  correct: true,
  hint: false,
  at: 2000,
}));
const state = {
  version: Game.VERSION,
  id: "CF-test",
  name: "Ana García",
  group: "1 DAW",
  started: 1000,
  finished: 2000,
  results,
  hint: false,
  review: false,
  discovered: ["0-0"],
  project: {
    html: "<main><h1>Ana</h1><p>Mi tarjeta de agente web.</p></main>",
    css: "body { color: white; padding: 20px; }",
    reflection:
      "He usado main para el contenido y padding para dejar espacio interior. En JavaScript uso && para exigir dos condiciones.",
  },
};
test("36 retos, 12 por sala y 18 actividades prácticas con soluciones válidas", () => {
  assert.equal(QUESTIONS.length, 36);
  assert.equal(ROOMS.length, 3);
  assert.equal(QUESTIONS.filter((q) => q.kind).length, 18);
  for (let room = 0; room < 3; room++)
    assert.equal(Game.roomSize(QUESTIONS, room), 12);
  for (const q of QUESTIONS) {
    assert.ok(q.hint && q.explanation && q.prompt);
    assert.ok(Game.validAnswer(q, q.answer), q.title);
    assert.ok(Game.correct(q, q.answer), q.title);
  }
});
test("pleno 10, todos con pista 7,5, todos mal 0 y puntuación por salas", () => {
  const totals = Game.summary(results, QUESTIONS);
  assert.equal(totals.grade, 10);
  assert.equal(totals.earned, 36);
  assert.deepEqual(
    totals.rooms.map((r) => r.earned),
    [12, 12, 12],
  );
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
  const mixed = results.map((r) => ({ ...r }));
  mixed[0].hint = true;
  mixed[1] = { ...mixed[1], correct: false, hint: true };
  assert.equal(Game.summary(mixed, QUESTIONS).earned, 34.75);
  assert.equal(Game.summary(mixed, QUESTIONS).rooms[0].earned, 10.75);
});
test("normalización, matrices, orden y validación de valores permitidos", () => {
  assert.equal(Game.normalize(" HREF "), "href");
  for (const q of QUESTIONS.filter((q) => q.kind)) {
    const values = Game.parts(q.answer);
    if (q.kind === "order") {
      assert.equal(Game.correct(q, JSON.stringify(q.initial)), false);
      assert.equal(
        Game.validAnswer(q, JSON.stringify(values.map(() => 0))),
        false,
      );
    } else {
      assert.ok(
        Game.correct(
          q,
          JSON.stringify(values.map((v) => " " + v.toUpperCase() + " ")),
        ),
      );
      const wrong = [...values];
      wrong[0] = "incorrecto";
      assert.equal(Game.correct(q, JSON.stringify(wrong)), false);
    }
    assert.equal(Game.correct(q, "broken-json"), false);
    assert.equal(Game.validAnswer(q, "null"), false);
  }
  const style = QUESTIONS.find((q) => q.kind === "style");
  assert.equal(
    Game.validAnswer(style, '["url(https://evil.test)","white","20px"]'),
    false,
  );
  const choice = QUESTIONS.find((q) => q.options);
  assert.equal(Game.validAnswer(choice, "__proto__"), false);
});
test("progreso y proyecto incompleto se recuperan sin permitir informes incompletos", () => {
  assert.ok(Game.validState(state, QUESTIONS));
  assert.ok(
    Game.validState(
      { ...state, results: results.slice(0, 5), finished: null },
      QUESTIONS,
    ),
  );
  assert.ok(
    Game.validState(
      {
        ...state,
        finished: null,
        project: { html: "", css: "", reflection: "" },
      },
      QUESTIONS,
    ),
  );
  for (const bad of [
    null,
    {},
    { ...state, version: 99 },
    { ...state, review: true, results: [], finished: null },
    { ...state, name: "" },
    { ...state, results: [...results, results[0]] },
    { ...state, started: "ayer" },
    { ...state, finished: 500 },
    { ...state, results: results.slice(0, 3) },
    { ...state, discovered: ["x"] },
    { ...state, discovered: ["0-0", "0-0"] },
    { ...state, project: { html: "", css: "", reflection: "" } },
    { ...state, results: [{ ...results[0], correct: false }] },
  ])
    assert.equal(Game.validState(bad, QUESTIONS), false);
});
test("una sala se desbloquea solo tras su último reto y se conservan los intentos v1", () => {
  assert.equal(Game.roomComplete(results.slice(0, 11), QUESTIONS, 0), false);
  assert.equal(Game.roomComplete(results.slice(0, 12), QUESTIONS, 0), true);
  assert.equal(Game.roomComplete(results.slice(0, 12), QUESTIONS, 1), false);
  const old = {
    ...state,
    version: 1,
    results: LEGACY_QUESTIONS.map((q) => ({
      answer: q.answer,
      correct: true,
      hint: false,
      at: 2000,
    })),
  };
  assert.ok(Game.validState(old, LEGACY_QUESTIONS, 1));
  assert.equal(Game.summary(old.results, LEGACY_QUESTIONS).grade, 10);
});
