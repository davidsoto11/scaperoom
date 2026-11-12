const main = document.querySelector("#main");
let STORAGE_KEY = "codigo-de-fuga-v2";
let state = null;
let storageAvailable = true;
let screen = "welcome";
try {
  let stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const legacy = localStorage.getItem("codigo-de-fuga-v1");
    if (legacy) {
      const previous = JSON.parse(legacy);
      if (Game.validState(previous, LEGACY_QUESTIONS, 1)) {
        stored = legacy;
        QUESTIONS = LEGACY_QUESTIONS;
        STORAGE_KEY = "codigo-de-fuga-v1";
      }
    }
  }
  if (stored) {
    const parsed = JSON.parse(stored);
    if (
      Game.validState(
        parsed,
        QUESTIONS,
        QUESTIONS === LEGACY_QUESTIONS ? 1 : Game.VERSION,
      ) &&
      typeof parsed.review === "boolean"
    )
      state = parsed;
  }
} catch {
  storageAvailable = false;
}
const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const number = (value) =>
  value.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const answerLabel = Game.answerLabel;
function announce(message) {
  document.querySelector("#announcer").textContent = message;
}
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    storageAvailable = false;
    announce(
      "No se puede guardar el progreso en este navegador. Mantén abierta esta pestaña hasta descargar el informe.",
    );
  }
}
function focusTitle() {
  (
    main.querySelector(".challenge-body h2") || main.querySelector("h1, h2")
  )?.focus();
}
function elapsed() {
  const seconds = Math.max(
    0,
    Math.floor(((state.finished || Date.now()) - state.started) / 1000),
  );
  return `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}
function welcome() {
  screen = "welcome";
  main.innerHTML = `
    <section class="hero">
      <div class="hero-copy"><span class="eyebrow"><span class="pill-dot"></span> TU PRÓXIMA MISIÓN EMPIEZA AQUÍ</span>
        <h1 tabindex="-1">La web está<br>bloqueada.<br><em>Tú tienes el código.</em></h1>
        <p class="hero-description">Un fallo ha cerrado el sistema. Entra en las tres salas, resuelve los retos y recupera la llave de salida. Tus conocimientos de desarrollo web son la única pista.</p>
        <div class="hero-tags"><span>${QUESTIONS.length} retos</span><span>3 salas</span><span>Sesión de 2 h</span></div>
        ${
          state
            ? `<div class="resume-card"><span class="eyebrow">${QUESTIONS === LEGACY_QUESTIONS ? "MISIÓN ANTERIOR CONSERVADA · 18 RETOS" : "MISIÓN GUARDADA"}</span><h2>${escapeHTML(state.name)}</h2><p>${state.results.length} de ${QUESTIONS.length} retos completados · ${escapeHTML(state.group)}</p><button class="primary" id="resume">${state.finished ? "Ver mi resultado" : "Continuar misión"} <span>↗</span></button><button class="text-button" id="new-attempt">Empezar otro intento</button></div>`
            : `
        <form id="start-form" class="start-form">
          <div class="form-row"><label>Nombre y apellidos<input name="student" autocomplete="name" placeholder="¿Quién acepta la misión?" required minlength="2" maxlength="100"></label><label class="group-field">Curso / grupo<input name="group" placeholder="Ej. 1.º DAW A" required maxlength="60"></label></div>
          <button class="primary" type="submit">Entrar en el escape room <span>↗</span></button>
          <p class="privacy">Tus datos y tu progreso se guardan solo en este navegador. Al terminar, descarga el informe y entrégalo en Moodle.</p>
        </form>`
        }
      </div>
      <div class="hero-art"><div class="art-top"><span class="terminal-dot"></span><span>SYS.RECOVERY / SECTOR 03</span><span class="art-top-right">● LIVE</span></div><div class="art-inner"><span class="orbit-label label-html">&lt;/&gt; HTML</span><span class="orbit-label label-css">{ } CSS</span><img src="assets/vault.svg" alt="Sala digital isométrica con una terminal, una llave y una puerta de seguridad" width="620" height="510"><span class="orbit-label label-js">JS · NÚCLEO</span><div class="art-status"><span class="live-dot"></span> ESPERANDO A UN AGENTE<span class="blink">_</span></div></div><div class="art-bottom"><span>ACCESO RESTRINGIDO</span><span>3 FRAGMENTOS → 1 SALIDA</span></div></div>
    </section>
    <section class="mission-path" aria-label="Las tres salas"><div class="path-heading"><span class="eyebrow">EL PLAN DE ESCAPE</span><span>Aprende. Conecta. Escapa. ↴</span></div><div class="room-cards">${ROOMS.map((r, i) => `<article class="room-card" style="--room-color:${r.color}"><span class="room-number">0${i + 1} / ${r.language}</span><div class="room-card-title"><span class="language-icon">${escapeHTML(r.symbol)}</span><h2>${r.name}</h2><span class="card-arrow">↗</span></div><p>${r.description}</p><span class="room-bottom">${Game.roomSize(QUESTIONS, i)} RETOS <span>FRAGMENTO 0${i + 1}</span></span></article>`).join("")}</div></section>
    <section class="briefing"><span class="briefing-icon">i</span><div><h2>Antes de cruzar la puerta</h2><p>Cada reto vale <strong>1 punto</strong>. Si usas su pista, el máximo es <strong>0,75</strong>. Una respuesta incorrecta vale <strong>0</strong>. Solo hay una respuesta por reto, pero siempre podrás avanzar y ver la explicación. La nota final es <strong>puntos ÷ ${QUESTIONS.length} × 10</strong>. El tiempo no penaliza.</p></div><span class="briefing-badge">MISIÓN<br>FORMATIVA</span></section>
    ${QUESTIONS !== LEGACY_QUESTIONS ? `<section class="session-plan"><div><span class="eyebrow">UNA SESIÓN / 120 MINUTOS ORIENTATIVOS</span><h2>Hay tiempo para explorar y crear.</h2><p>La misión va a tu ritmo. Si terminas pronto, amplía tu tarjeta: añade enlaces, un segundo tema y un efecto :hover.</p></div><ol><li><strong>10 min</strong> Preparación y exploración</li><li><strong>30 min</strong> HTML: recuperar la estructura</li><li><strong>30 min</strong> CSS: reparar el laboratorio</li><li><strong>30 min</strong> JavaScript: probar el núcleo</li><li><strong>20 min</strong> Proyecto, reflexión y entrega</li></ol></section>` : '<p class="notice">Tu intento anterior se conserva. Puedes terminarlo y descargar su informe, o empezar una nueva misión de 36 retos.</p>'}
    ${!storageAvailable ? '<p class="notice">El guardado local no está disponible. No cierres ni recargues la pestaña hasta descargar el informe.</p>' : ""}`;
  document.querySelector("#start-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const name = data.get("student").trim();
    const group = data.get("group").trim();
    if (name.length < 2 || !group) {
      announce("Escribe tu nombre y un curso o grupo válidos.");
      return;
    }
    state = {
      version: Game.VERSION,
      id: `CF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      name,
      group,
      started: Date.now(),
      finished: null,
      results: [],
      hint: false,
      review: false,
      discovered: [],
      project: { ...PROJECT_START },
    };
    save();
    renderGame();
    focusTitle();
  });
  document.querySelector("#resume")?.addEventListener("click", () => {
    state.finished ? renderResults() : renderGame();
    focusTitle();
  });
  document.querySelector("#new-attempt")?.addEventListener("click", newAttempt);
}
function newAttempt() {
  if (
    !confirm(
      "¿Empezar un nuevo intento? Se borrará el progreso de este navegador. Descarga primero tu informe si ya has terminado.",
    )
  )
    return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    storageAvailable = false;
  }
  state = null;
  QUESTIONS = EXPANDED_QUESTIONS;
  STORAGE_KEY = "codigo-de-fuga-v2";
  welcome();
  focusTitle();
}
function renderGame() {
  screen = "game";
  const index = state.review ? state.results.length - 1 : state.results.length;
  if (index >= QUESTIONS.length) {
    QUESTIONS === LEGACY_QUESTIONS || state.finished
      ? renderResults()
      : renderProject();
    return;
  }
  const q = QUESTIONS[index];
  const room = ROOMS[q.room];
  const result = state.review ? state.results[index] : null;
  const completed = state.results.length;
  const roomDone =
    state.review &&
    (index === QUESTIONS.length - 1 || QUESTIONS[index + 1].room !== q.room);
  const hinted = result ? result.hint : state.hint;
  main.innerHTML = `
    <section class="mission-header"><div><span class="eyebrow">MISIÓN EN CURSO / ${escapeHTML(state.group)}</span><h1 tabindex="-1">Operación: <em>recuperar la web.</em></h1></div><div class="agent"><span class="agent-avatar">${escapeHTML(state.name[0].toUpperCase())}</span><div><strong>${escapeHTML(state.name)}</strong><span id="save-status">${storageAvailable ? "Progreso guardado en este navegador" : "Sin guardado: mantén esta pestaña abierta"}</span></div></div></section>
    <div class="progress-strip"><span>${String(completed).padStart(2, "0")} <span class="muted">/ ${QUESTIONS.length} RETOS</span></span><progress value="${completed}" max="${QUESTIONS.length}" aria-label="Retos completados">${completed}/${QUESTIONS.length}</progress><span class="time" aria-label="Tiempo transcurrido">◷ <span id="timer">${elapsed()}</span></span></div>
    <div class="game-layout"><aside class="mission-sidebar"><span class="eyebrow">MAPA DEL SISTEMA</span><ol class="room-map">${ROOMS.map(
      (r, i) => {
        const count = state.results.filter(
          (_, n) => QUESTIONS[n].room === i,
        ).length;
        return `<li class="${i === q.room ? "current" : ""} ${count === Game.roomSize(QUESTIONS, i) ? "complete" : ""}" style="--room-color:${r.color}" ${i === q.room ? 'aria-current="step"' : ""}><span class="map-icon">${count === Game.roomSize(QUESTIONS, i) ? "✓" : escapeHTML(r.symbol)}</span><div><span class="map-label">SALA 0${i + 1} · ${r.language}</span><strong>${r.name}</strong><span class="map-count">${count === Game.roomSize(QUESTIONS, i) ? "Fragmento recuperado" : `${count}/${Game.roomSize(QUESTIONS, i)} retos resueltos`}</span></div></li>`;
      },
    ).join(
      "",
    )}</ol>${sceneHTML(q.room)}<div class="key-box"><span class="eyebrow">TU LLAVE DE SALIDA</span><div class="key-pieces">${ROOMS.map((r, i) => `<span class="${Game.roomComplete(state.results, QUESTIONS, i) ? "found" : ""}" aria-label="Fragmento ${i + 1} ${Game.roomComplete(state.results, QUESTIONS, i) ? "recuperado" : "pendiente"}">${Game.roomComplete(state.results, QUESTIONS, i) ? "◆" : "◇"}</span>`).join("")}</div><p>Completa cada sala para recuperar un fragmento.</p></div><a class="notes-link" href="${encodeURI(room.source)}" target="_blank" rel="noopener">↗ Consultar apuntes de ${room.language}</a>${room.extraSource ? `<a class="notes-link" href="${encodeURI(room.extraSource)}" target="_blank" rel="noopener">↗ Apuntes de decisiones (clase 02)</a>` : ""}<p class="sidebar-note">Los apuntes están permitidos. Las pistas del juego descuentan 0,25 puntos solo en su reto.</p></aside>
    <section class="challenge-panel" style="--room-color:${room.color}"><div class="panel-top"><span><span class="terminal-dot"></span> ${room.language.toUpperCase()} / ACCESO 0${index - QUESTIONS.findIndex((item) => item.room === q.room) + 1}</span><span>RETO ${String(index + 1).padStart(2, "0")}</span></div><div class="challenge-body"><span class="challenge-tag">${escapeHTML(room.name)} <span>· ${result ? number(Game.points(result)) : hinted ? "0,75" : "1,00"} PT</span></span><h2 tabindex="-1">${q.title}</h2><p class="story">${q.story}</p>${q.code ? `<pre class="code-block"><span class="code-caption">CÓDIGO INTERCEPTADO</span><code>${escapeHTML(q.code)}</code></pre>` : ""}
    <form id="answer-form"><fieldset ${result ? "disabled" : ""}><legend>${escapeHTML(q.prompt)}</legend>${answerWidget(q, result)}</fieldset>
    ${result ? `<div class="feedback ${result.correct ? "success" : "incorrect"}" role="status"><div class="feedback-symbol">${result.correct ? "✓" : "↳"}</div><div><strong>${result.correct ? "Acceso validado." : "El sistema te enseña la clave."} <span>+${number(Game.points(result))} pt</span></strong><p>${escapeHTML(q.explanation)}</p>${!result.correct ? `<p class="answer-record">Respuesta correcta: <strong>${escapeHTML(answerLabel(q, q.answer))}</strong></p>` : ""}</div></div>${roomDone ? `<div class="fragment-banner">◆ FRAGMENTO 0${q.room + 1} RECUPERADO <strong>${room.fragment}</strong></div>` : ""}<button type="button" id="next" class="primary">${index === QUESTIONS.length - 1 ? (QUESTIONS === LEGACY_QUESTIONS ? "Abrir la salida y ver mi nota" : "Recuperar el último fragmento") : roomDone ? "Entrar en la siguiente sala" : "Siguiente reto"} <span>→</span></button>` : `<div id="hint-area">${hinted ? `<div class="hint"><strong>✦ Pista activada · máximo 0,75 puntos</strong><p>${escapeHTML(q.hint)}</p></div>` : ""}</div><div class="challenge-actions"><button type="button" id="hint" class="secondary" ${hinted ? "disabled" : ""}>✦ ${hinted ? "Pista utilizada" : "Pedir pista (−0,25 pt)"}</button><button type="submit" class="primary">Validar respuesta <span>→</span></button></div><p class="answer-warning">Una única respuesta por reto. Revisa antes de validar.</p>`}</form>
    </div><div class="panel-bottom"><span>${roomDone ? "FRAGMENTO DESBLOQUEADO" : "CONEXIÓN SEGURA CON EL NÚCLEO"}</span><span>● ● ●</span></div></section></div>`;
  wireAnswer(q, result);
  wireScene(q.room);
  document.querySelector("#answer-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.review) return;
    const answer = collectAnswer(q, event.target);
    if (!answer) {
      announce("Escribe una respuesta antes de validar.");
      return;
    }
    state.results.push({
      answer,
      correct: Game.correct(q, answer),
      hint: state.hint,
      at: Date.now(),
    });
    state.review = true;
    state.draft = null;
    if (
      state.results.length === QUESTIONS.length &&
      QUESTIONS === LEGACY_QUESTIONS
    )
      state.finished = Date.now();
    save();
    renderGame();
    document
      .querySelector(".feedback")
      .scrollIntoView({ block: "nearest", behavior: "instant" });
    document.querySelector("#next").focus();
  });
  document.querySelector("#hint")?.addEventListener("click", () => {
    state.hint = true;
    save();
    // Preserve an answer already typed or selected when revealing a hint.
    document.querySelector("#hint-area").innerHTML =
      `<div class="hint" role="status"><strong>✦ Pista activada · máximo 0,75 puntos</strong><p>${escapeHTML(q.hint)}</p></div>`;
    const button = document.querySelector("#hint");
    button.disabled = true;
    button.textContent = "✦ Pista utilizada";
    document.querySelector(".challenge-tag span").textContent = "· 0,75 PT";
    document.querySelector("#save-status").textContent = storageAvailable
      ? "Progreso guardado en este navegador"
      : "Sin guardado: mantén esta pestaña abierta";
  });
  document.querySelector("#next")?.addEventListener("click", () => {
    state.review = false;
    state.hint = false;
    save();
    state.finished
      ? renderResults()
      : roomDone
        ? showRoomComplete(q.room)
        : renderGame();
    focusTitle();
  });
}
function renderResults() {
  screen = "results";
  const totals = Game.summary(state.results, QUESTIONS);
  main.innerHTML = `<section class="results-header"><span class="eyebrow"><span class="live-dot"></span> SISTEMA RESTAURADO / MISIÓN COMPLETADA</span><div class="results-icon">↗</div><h1 tabindex="-1">Has encontrado<br><em>el código de salida.</em></h1><p>${escapeHTML(state.name)}, has recorrido las tres salas. Ahora descarga tu informe y súbelo a la tarea de Moodle.</p></section>
  <section class="results-grid"><div class="grade-card"><span class="eyebrow">TU NOTA FINAL</span><div class="grade">${number(totals.grade)}<span>/ 10</span></div><p>${number(totals.earned)} de ${QUESTIONS.length} puntos posibles</p><span class="grade-status">${totals.grade >= 5 ? "OBJETIVO CONSEGUIDO" : "SIGUE PRACTICANDO"}</span></div><div class="report-card"><span class="eyebrow">ÚLTIMO PASO / ENTREGA EN MOODLE</span><h2>Tu misión, en un informe.</h2><p>Incluye tu nombre, grupo, fecha, tiempo, nota por sala, pistas y todas las respuestas corregidas.</p><div class="report-actions"><button id="download" class="primary">Descargar informe (.html) <span>↓</span></button><button id="print" class="secondary">Guardar como PDF ↗</button></div><p class="privacy">Sube el archivo descargado a Moodle. Si la tarea requiere PDF, pulsa «Guardar como PDF» y elige «Guardar como PDF» en el diálogo de impresión.</p><p id="download-status" role="status"></p></div></section>
  <div class="result-stats"><span><strong>${totals.correct}/${QUESTIONS.length}</strong> respuestas correctas</span><span><strong>${totals.hints}</strong> pistas utilizadas</span><span><strong>${elapsed()}</strong> tiempo total</span><span><strong>3/3</strong> fragmentos recuperados</span></div>
  <section class="breakdown"><div class="path-heading"><h2>Tu recorrido, sala a sala.</h2><span class="eyebrow">LA NOTA COMPLETA</span></div><div class="room-cards">${ROOMS.map((room, i) => `<article class="room-card" style="--room-color:${room.color}"><span class="room-number">0${i + 1} / ${room.language}</span><div class="room-card-title"><span class="language-icon">${escapeHTML(room.symbol)}</span><h3>${room.name}</h3></div><div class="room-score">${number(totals.rooms[i].earned)} <span>/ ${totals.rooms[i].max} pt</span></div><progress value="${totals.rooms[i].earned}" max="${totals.rooms[i].max}" aria-label="Puntos de ${room.language}"></progress></article>`).join("")}</div></section>
  ${state.version === 2 ? `<section class="project-summary"><span class="eyebrow">PROYECTO FINAL GUARDADO</span><h2>Tu tarjeta y tu bitácora acompañan al informe.</h2><p>${escapeHTML(state.project.reflection)}</p><button class="secondary" id="download-card">Descargar mi tarjeta (.html) ↓</button><span>${state.discovered.length}/9 objetos inspeccionados · 36 retos + proyecto final</span></section>` : ""}<section class="review-section"><h2>El registro de tu misión</h2><p class="muted">Cada respuesta suma aprendizaje. Despliega un reto para revisar su explicación.</p>${state.results.map((r, i) => `<details class="review-item"><summary><span class="review-number">${String(i + 1).padStart(2, "0")}</span><span>${escapeHTML(QUESTIONS[i].title)}</span><span class="review-score ${r.correct ? "right" : ""}">${number(Game.points(r))} / 1 <span>${r.correct ? "✓" : "↳"}</span></span></summary><div class="review-content"><p><strong>${escapeHTML(QUESTIONS[i].prompt)}</strong></p>${QUESTIONS[i].code || QUESTIONS[i].template ? `<pre><code>${escapeHTML(QUESTIONS[i].code || QUESTIONS[i].template)}</code></pre>` : ""}<p class="answer-record">Tu respuesta: <strong>${escapeHTML(answerLabel(QUESTIONS[i], r.answer))}</strong></p><p class="answer-record">Respuesta correcta: <strong>${escapeHTML(answerLabel(QUESTIONS[i], QUESTIONS[i].answer))}</strong></p><p>${escapeHTML(QUESTIONS[i].explanation)}</p><p class="muted">Pista: ${r.hint ? "utilizada (−0,25 pt si aciertas)" : "no utilizada"}</p></div></details>`).join("")}</section><div class="end-note"><span>Los datos siguen guardados en este navegador. El informe se genera localmente y no es una certificación verificada.</span><button id="new-attempt" class="text-button">Borrar datos y empezar otro intento ↗</button></div>`;
  document
    .querySelector("#download-card")
    ?.addEventListener("click", () =>
      downloadFile(
        projectDocument(state.project),
        `tarjeta-agente-${state.id}.html`,
      ),
    );
  document.querySelector("#download").addEventListener("click", downloadReport);
  document.querySelector("#print").addEventListener("click", printReport);
  document.querySelector("#new-attempt").addEventListener("click", newAttempt);
}
function reportHTML() {
  const totals = Game.summary(state.results, QUESTIONS);
  const date = (timestamp) =>
    new Date(timestamp).toLocaleString("es-ES", { timeZone: "Europe/Madrid" });
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Informe · Código de fuga · ${escapeHTML(state.name)}</title><style>
  *{box-sizing:border-box}body{font:15px/1.6 system-ui,sans-serif;color:#202330;background:#f0eff5;margin:0;padding:40px 20px}main{max-width:900px;margin:auto;background:white;padding:48px;border-radius:16px}header{border-bottom:3px solid #75619c;padding-bottom:20px}.eyebrow{letter-spacing:2px;font-size:11px;color:#685880}h1{font-size:36px;line-height:1.1}h2{margin-top:32px}h3{margin:0}.grade{font-size:48px;font-weight:800;color:#5c457e}.meta{display:grid;grid-template-columns:1fr 1fr;gap:12px}.meta p{margin:0}table{border-collapse:collapse;width:100%;margin:20px 0}th,td{text-align:left;border-bottom:1px solid #d9d5e2;padding:10px}th{background:#f1edf6}article{border:1px solid #d9d5e2;padding:20px;margin:16px 0;border-radius:8px;break-inside:avoid}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f1edf6;padding:16px}p,td{overflow-wrap:anywhere}.answer-record{white-space:pre-wrap}.correct{color:#306124}.wrong{color:#99412c}.small{font-size:12px;color:#61616b}button{padding:12px 20px;background:#30253f;color:white;border:0;border-radius:6px;cursor:pointer}footer{border-top:1px solid #d9d5e2;margin-top:30px;padding-top:16px}@media(max-width:600px){main{padding:24px}.meta{grid-template-columns:1fr}h1{font-size:28px}}@media print{body{background:white;padding:0;font-size:10pt}main{padding:0;max-width:none}button{display:none}h1{font-size:24pt}article{padding:12px}thead{display:table-header}@page{size:A4;margin:16mm}}
  </style></head><body><main><header><p class="eyebrow">CÓDIGO DE FUGA / INFORME DE ACTIVIDAD · V${state.version}</p><h1>Escape room de desarrollo web</h1><p>HTML · CSS · JavaScript</p></header><h2>Identificación del alumno</h2><div class="meta"><p><strong>Nombre:</strong> ${escapeHTML(state.name)}</p><p><strong>Curso / grupo:</strong> ${escapeHTML(state.group)}</p><p><strong>Inicio:</strong> ${date(state.started)}</p><p><strong>Finalización:</strong> ${date(state.finished)}</p><p><strong>Duración:</strong> ${elapsed()} (minutos:segundos)</p><p><strong>Referencia del intento:</strong> ${escapeHTML(state.id)}</p></div><p class="small">Fechas en horario de Madrid.</p><h2>Calificación final</h2><div class="grade">${number(totals.grade)} / 10</div><p><strong>${number(totals.earned)} / ${QUESTIONS.length} puntos</strong> · ${totals.correct} respuestas correctas · ${totals.hints} pistas utilizadas · ${QUESTIONS.length}/${QUESTIONS.length} retos completados</p><p>Cada acierto vale 1 punto, o 0,75 si se usa la pista. Las respuestas incorrectas valen 0. Nota = (puntos obtenidos ÷ ${QUESTIONS.length}) × 10. El tiempo no penaliza. Redondeo mostrado a dos decimales.</p><table><thead><tr><th scope="col">Sala</th><th scope="col">Puntos</th><th scope="col">Equivalente / 10</th></tr></thead><tbody>${ROOMS.map((r, i) => `<tr><th scope="row">${r.language} · ${r.name}</th><td>${number(totals.rooms[i].earned)} / ${totals.rooms[i].max}</td><td>${number((totals.rooms[i].earned / totals.rooms[i].max) * 10)}</td></tr>`).join("")}</tbody></table><h2>Registro completo de respuestas</h2>${state.results
    .map((r, i) => {
      const q = QUESTIONS[i];
      return `<article><p class="eyebrow">RETO ${i + 1} / ${ROOMS[q.room].language}</p><h3>${escapeHTML(q.title)}</h3><p>${escapeHTML(q.prompt)}</p>${q.code || q.template ? `<pre><code>${escapeHTML(q.code || q.template)}</code></pre>` : ""}<p class="answer-record"><strong>Respuesta del alumno:</strong> ${escapeHTML(answerLabel(q, r.answer))}</p><p class="answer-record"><strong>Respuesta correcta:</strong> ${escapeHTML(answerLabel(q, q.answer))}</p><p class="${r.correct ? "correct" : "wrong"}"><strong>${r.correct ? "Correcta" : "Incorrecta"} · ${number(Game.points(r))} / 1 punto</strong> · Pista ${r.hint ? "utilizada" : "no utilizada"}</p>${r.hint ? `<p><strong>Pista consultada:</strong> ${escapeHTML(q.hint)}</p>` : ""}<p>${escapeHTML(q.explanation)}</p></article>`;
    })
    .join(
      "",
    )} ${state.version === 2 ? `<h2>Proyecto final · evidencia para el profesor</h2><p>El proyecto y la reflexión no añaden puntos a la nota automática de los 36 retos.</p><h3>HTML</h3><pre><code>${escapeHTML(state.project.html)}</code></pre><h3>CSS</h3><pre><code>${escapeHTML(state.project.css)}</code></pre><h3>Bitácora del agente</h3><p style="white-space:pre-wrap">${escapeHTML(state.project.reflection)}</p><p>Objetos inspeccionados: ${state.discovered.length} / 9.</p>` : ""}<footer><p><strong>Entrega:</strong> sube este informe a la tarea correspondiente de Moodle.</p><p class="small">Informe generado en el navegador a partir del intento del alumno. No tiene firma digital ni verificación de identidad o integridad por un servidor. El identificador es una referencia del intento, no un código de verificación.</p><button onclick="window.print()">Imprimir / Guardar como PDF</button></footer></main></body></html>`;
}
function downloadReport() {
  const blob = new Blob([reportHTML()], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const filename =
    state.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "alumno";
  link.download = `informe-codigo-de-fuga-${filename}-${state.id}.html`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  document.querySelector("#download-status").textContent =
    "Descarga solicitada. Busca el informe en tus descargas y súbelo a Moodle.";
}
function printReport() {
  const report = window.open("", "_blank");
  if (!report) {
    document.querySelector("#download-status").textContent =
      "Permite las ventanas emergentes o descarga el informe HTML y ábrelo para guardarlo como PDF.";
    return;
  }
  report.opener = null;
  report.document.write(reportHTML());
  report.document.close();
  report.addEventListener(
    "load",
    () => {
      report.focus();
      report.print();
    },
    { once: true },
  );
}
setInterval(() => {
  const timer = document.querySelector("#timer");
  if (timer && screen === "game") timer.textContent = elapsed();
}, 1000);
welcome();
