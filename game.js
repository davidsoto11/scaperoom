// shortcut: client-side grades are editable; use server-side evaluation for certified exams.
const Game = (() => {
  const VERSION = 1;
  const normalize = (value) => String(value).trim().toLowerCase();
  const points = (result) => (result.correct ? (result.hint ? 0.75 : 1) : 0);
  function summary(results, questions) {
    const earned = results.reduce((total, result) => total + points(result), 0);
    return {
      earned,
      grade: (earned / questions.length) * 10,
      correct: results.filter((r) => r.correct).length,
      hints: results.filter((r) => r.hint).length,
      rooms: [0, 1, 2].map((room) => ({
        earned: results.reduce(
          (total, r, i) => total + (questions[i].room === room ? points(r) : 0),
          0,
        ),
        max: questions.filter((q) => q.room === room).length,
      })),
    };
  }
  function validState(state, questions) {
    return (
      state?.version === VERSION &&
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
      (state.finished !== null) ===
        (state.results.length === questions.length) &&
      (!state.review || state.results.length > 0) &&
      state.results.every(
        (r, i) =>
          r &&
          typeof r.answer === "string" &&
          r.answer.length <= 200 &&
          typeof r.hint === "boolean" &&
          typeof r.correct === "boolean" &&
          r.correct ===
            (normalize(r.answer) === normalize(questions[i].answer)) &&
          (!questions[i].options ||
            questions[i].options[r.answer] !== undefined) &&
          Number.isFinite(r.at) &&
          r.at >= state.started,
      )
    );
  }
  return { VERSION, normalize, points, summary, validState };
})();
if (typeof module !== "undefined") module.exports = Game;
