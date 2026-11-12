// shortcut: client-side grades are editable; use server-side evaluation for certified exams.
const Game = (() => {
  const VERSION = 2;
  const normalize = (value) => String(value).trim().toLowerCase();
  const points = (result) => (result.correct ? (result.hint ? 0.75 : 1) : 0);
  const roomSize = (questions, room) =>
    questions.filter((q) => q.room === room).length;
  const roomComplete = (results, questions, room) =>
    results.filter((_, i) => questions[i].room === room).length ===
    roomSize(questions, room);
  function parts(answer) {
    try {
      const value = JSON.parse(answer);
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }
  function correct(q, answer) {
    if (!q.kind) return normalize(answer) === normalize(q.answer);
    const actual = parts(answer),
      expected = parts(q.answer);
    return (
      actual.length === expected.length &&
      actual.every(
        (value, i) =>
          typeof value === typeof expected[i] &&
          normalize(value) === normalize(expected[i]),
      )
    );
  }
  function answerLabel(q, answer) {
    if (q.kind === "order")
      return parts(answer)
        .map((i) => q.items[i] || "?")
        .join("\n↓\n");
    if (q.kind)
      return parts(answer)
        .map(
          (value, i) => `${q.fields?.[i] || q.controls?.[i]?.label}: ${value}`,
        )
        .join("\n");
    return q.options ? q.options[answer] : answer;
  }
  function summary(results, questions) {
    const earned = results.reduce((total, r) => total + points(r), 0);
    return {
      earned,
      grade: (earned / questions.length) * 10,
      correct: results.filter((r) => r.correct).length,
      hints: results.filter((r) => r.hint).length,
      rooms: ROOMS_IDS.map((room) => ({
        earned: results.reduce(
          (total, r, i) => total + (questions[i].room === room ? points(r) : 0),
          0,
        ),
        max: roomSize(questions, room),
      })),
    };
  }
  const ROOMS_IDS = [0, 1, 2];
  function validAnswer(q, answer) {
    if (typeof answer !== "string" || answer.length > 2000) return false;
    if (!q.kind) return !q.options || Object.hasOwn(q.options, answer);
    const values = parts(answer);
    if (values.length !== parts(q.answer).length) return false;
    if (q.kind === "order")
      return (
        new Set(values).size === q.items.length &&
        values.every((i) => Number.isInteger(i) && i >= 0 && i < q.items.length)
      );
    return values.every(
      (v, i) =>
        typeof v === "string" &&
        v.length <= 200 &&
        (q.kind !== "style" || q.controls[i].values.includes(v)),
    );
  }
  function validProject(project, complete = false) {
    return (
      project &&
      typeof project.html === "string" &&
      project.html.length <= 12000 &&
      typeof project.css === "string" &&
      project.css.length <= 12000 &&
      typeof project.reflection === "string" &&
      project.reflection.length <= 2000 &&
      (!complete ||
        (project.html.trim().length >= 40 &&
          project.css.trim().length >= 20 &&
          project.reflection.trim().length >= 40))
    );
  }
  function validState(state, questions, version = VERSION) {
    return (
      state?.version === version &&
      typeof state.id === "string" &&
      typeof state.name === "string" &&
      state.name.trim().length > 1 &&
      state.name.length <= 100 &&
      typeof state.group === "string" &&
      state.group.trim().length > 0 &&
      state.group.length <= 60 &&
      Number.isFinite(state.started) &&
      state.started > 0 &&
      (state.finished === null ||
        (Number.isFinite(state.finished) && state.finished >= state.started)) &&
      typeof state.hint === "boolean" &&
      typeof state.review === "boolean" &&
      Array.isArray(state.results) &&
      state.results.length <= questions.length &&
      (state.finished === null || state.results.length === questions.length) &&
      (version !== 1 ||
        (state.finished !== null) ===
          (state.results.length === questions.length)) &&
      (version === 1 ||
        (Array.isArray(state.discovered) &&
          state.discovered.length <= 9 &&
          new Set(state.discovered).size === state.discovered.length &&
          state.discovered.every((id) => /^[0-2]-[0-2]$/.test(id)) &&
          validProject(state.project, state.finished !== null))) &&
      (!state.review || state.results.length > 0) &&
      state.results.every(
        (r, i) =>
          r &&
          validAnswer(questions[i], r.answer) &&
          typeof r.hint === "boolean" &&
          typeof r.correct === "boolean" &&
          r.correct === correct(questions[i], r.answer) &&
          Number.isFinite(r.at) &&
          r.at >= state.started,
      )
    );
  }
  return {
    VERSION,
    normalize,
    points,
    summary,
    validState,
    correct,
    answerLabel,
    parts,
    validAnswer,
    validProject,
    roomSize,
    roomComplete,
  };
})();
if (typeof module !== "undefined") module.exports = Game;
