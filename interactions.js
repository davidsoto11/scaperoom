function answerWidget(q, result) {
  const draft =
    state.draft?.index === state.results.length &&
    Game.validAnswer(q, state.draft.answer)
      ? state.draft.answer
      : null;
  const answer = result?.answer ?? draft;
  if (q.kind === "order") {
    const order = answer ? Game.parts(answer) : q.initial;
    return `<p class="widget-help">Reconstruye el código con las flechas ↑ y ↓. También puedes usarlas con el teclado.</p><ol class="order-list">${order.map((id, i) => `<li data-item="${id}"><span class="line-number">${i + 1}</span><code>${escapeHTML(q.items[id])}</code><div><button type="button" data-move="-1" aria-label="Subir bloque ${i + 1}" ${i === 0 ? "disabled" : ""}>↑</button><button type="button" data-move="1" aria-label="Bajar bloque ${i + 1}" ${i === order.length - 1 ? "disabled" : ""}>↓</button></div></li>`).join("")}</ol>`;
  }
  if (q.kind) {
    const values = answer ? Game.parts(answer) : [];
    const fields =
      q.kind === "style"
        ? q.controls
            .map(
              (control, i) =>
                `<label>${escapeHTML(control.label)}<select data-part="${i}" required><option value="">Elige un valor…</option>${control.values.map((v) => `<option ${values[i] === v ? "selected" : ""} value="${escapeHTML(v)}">${escapeHTML(v)}</option>`).join("")}</select></label>`,
            )
            .join("")
        : q.fields
            .map(
              (label, i) =>
                `<label>${escapeHTML(label)}<input data-part="${i}" required maxlength="200" autocomplete="off" spellcheck="false" value="${escapeHTML(values[i] || "")}" placeholder="${q.kind === "trace" ? "Salida de consola" : "Completa el código"}"></label>`,
            )
            .join("");
    return `<div class="answer-matrix">${fields}</div>${q.template ? '<pre class="live-code" aria-label="Código reconstruido"></pre>' : ""}${q.kind === "trace" ? '<div class="console-preview"><span>TERMINAL / TU PREDICCIÓN</span><pre></pre></div>' : ""}${q.kind === "style" ? '<div class="lab-preview"><span class="preview-caption">LABORATORIO EN VIVO / TUS CAMBIOS</span><div class="style-preview"><span>AGENTE</span><span>LLAVE</span><span>SALIDA</span></div><pre class="live-css"></pre></div>' : ""}`;
  }
  if (q.options)
    return `<div class="options">${q.options.map((option, i) => `<label class="answer-option ${result && String(i) === q.answer ? "correct-option" : ""} ${result && String(i) === result.answer && !result.correct ? "wrong-option" : ""}"><input type="radio" name="answer" value="${i}" required ${answer !== null && String(i) === answer ? "checked" : ""}><span class="option-letter">${"ABC"[i]}</span><span class="option-text">${escapeHTML(option)}</span>${result && String(i) === q.answer ? '<span class="option-check" aria-label="Respuesta correcta">✓</span>' : ""}</label>`).join("")}</div>`;
  return `<label class="text-answer"><span>Tu respuesta</span><input name="answer" required maxlength="200" placeholder="${escapeHTML(q.placeholder)}" autocomplete="off" spellcheck="false" value="${escapeHTML(answer || "")}"></label>`;
}
function collectAnswer(q, form) {
  if (q.kind === "order")
    return JSON.stringify(
      [...form.querySelectorAll("[data-item]")].map((li) =>
        Number(li.dataset.item),
      ),
    );
  if (q.kind)
    return JSON.stringify(
      [...form.querySelectorAll("[data-part]")].map((field) =>
        field.value.trim(),
      ),
    );
  return String(new FormData(form).get("answer") || "").trim();
}
function wireAnswer(q, result) {
  const form = document.querySelector("#answer-form");
  function updatePreview() {
    const values = [...form.querySelectorAll("[data-part]")].map(
      (field) => field.value,
    );
    if (q.template)
      form.querySelector(".live-code").textContent = q.template.replace(
        /\{\{(\d+)\}\}/g,
        (_, i) => values[i] || "____",
      );
    if (q.kind === "trace")
      form.querySelector(".console-preview pre").textContent = values
        .map((v, i) => `${i + 1} > ${v || "…"}`)
        .join("\n");
    if (q.kind === "style") {
      const preview = form.querySelector(".style-preview");
      q.controls.forEach((control, i) => {
        if (control.values.includes(values[i]))
          preview.style.setProperty(control.property, values[i]);
      });
      form.querySelector(".live-css").textContent =
        ".panel {\n" +
        q.controls
          .map((control, i) => `  ${control.property}: ${values[i] || "____"};`)
          .join("\n") +
        "\n}";
    }
    if (!result) {
      state.draft = {
        index: state.results.length,
        answer: collectAnswer(q, form),
      };
      save();
    }
  }
  form.querySelectorAll("[data-move]").forEach((button) =>
    button.addEventListener("click", () => {
      const li = button.closest("li"),
        list = li.parentElement,
        direction = Number(button.dataset.move);
      const sibling =
        direction < 0 ? li.previousElementSibling : li.nextElementSibling;
      if (!sibling) return;
      if (direction < 0) list.insertBefore(li, sibling);
      else list.insertBefore(sibling, li);
      [...list.children].forEach((row, i) => {
        row.querySelector(".line-number").textContent = i + 1;
        const controls = row.querySelectorAll("button");
        controls[0].disabled = i === 0;
        controls[1].disabled = i === list.children.length - 1;
        controls[0].setAttribute("aria-label", `Subir bloque ${i + 1}`);
        controls[1].setAttribute("aria-label", `Bajar bloque ${i + 1}`);
      });
      updatePreview();
      (button.disabled
        ? li.querySelector("button:not(:disabled)")
        : button
      )?.focus();
      announce(
        `Bloque movido a la posición ${[...list.children].indexOf(li) + 1}.`,
      );
    }),
  );
  form.addEventListener("input", updatePreview);
  form.addEventListener("change", updatePreview);
  updatePreview();
}
const ROOM_OBJECTS = [
  [
    {
      name: "Terminal de archivos",
      icon: "⌘",
      title: "Protocolo de estructura",
      text: "HTML organiza el contenido. head contiene metadatos y body, el contenido visible. Identifica primero qué zona está dañada.",
    },
    {
      name: "Caja de herramientas",
      icon: "▣",
      title: "Kit de accesibilidad",
      text: "Una imagen necesita un alt útil. Las etiquetas semánticas dan significado a las zonas y los encabezados organizan la lectura.",
    },
    {
      name: "Panel de la puerta",
      icon: "⌁",
      title: "Conexiones del sistema",
      text: "href apunta al destino de un enlace; src indica la ruta de un recurso. Comprueba nombres de archivo y mayúsculas.",
    },
  ],
  [
    {
      name: "Terminal de estilos",
      icon: "⌘",
      title: "Regla de reparación",
      text: "Una regla tiene selector, propiedad y valor. Las clases empiezan con punto y los identificadores, con #.",
    },
    {
      name: "Caja de herramientas",
      icon: "▣",
      title: "Kit del modelo de caja",
      text: "Del centro hacia fuera: contenido, padding, border y margin. Cada capa tiene su función; no confundas espacio interior y exterior.",
    },
    {
      name: "Panel de la puerta",
      icon: "⌁",
      title: "Plano de distribución",
      text: "Flexbox empieza con display: flex. Comprueba después la dirección, la alineación y el gap. Una media query adapta el diseño al ancho.",
    },
  ],
  [
    {
      name: "Terminal de consola",
      icon: "⌘",
      title: "Bitácora del programa",
      text: "Lee de arriba abajo y anota el valor de cada variable después de una asignación. const no permite reasignar; let sí.",
    },
    {
      name: "Caja de herramientas",
      icon: "▣",
      title: "Detector de tipos",
      text: "Un texto numérico sigue siendo texto. Number() convierte textos numéricos y typeof permite conocer el tipo del valor.",
    },
    {
      name: "Panel de la puerta",
      icon: "⌁",
      title: "Protocolo de pruebas",
      text: "Prueba el valor anterior al límite, el propio límite y el siguiente. && exige ambas condiciones; || exige al menos una.",
    },
  ],
];
function sceneHTML(room) {
  const discovered = state.discovered || [];
  return `<section class="room-scene sector-${room}" aria-label="Sala explorable"><div class="scene-top"><span class="eyebrow">SECTOR 0${room + 1} / INSPECCIONA LA SALA</span><span>${discovered.filter((id) => id.startsWith(`${room}-`)).length}/3 objetos</span></div><div class="scene-stage ${Game.roomComplete(state.results, QUESTIONS, room) ? "restored" : ""}"><img src="assets/vault.svg" alt="Puesto de control con terminal, caja y puerta" width="620" height="510">${ROOM_OBJECTS[room].map((object, i) => `<button type="button" class="hotspot hotspot-${i} ${discovered.includes(`${room}-${i}`) ? "inspected" : ""}" data-object="${i}" aria-label="Inspeccionar ${object.name}" aria-pressed="${discovered.includes(`${room}-${i}`)}"><span>${object.icon}</span><span class="hotspot-label">${object.name}</span></button>`).join("")}<div class="scene-beam"></div></div><div id="object-detail" class="object-detail"><strong>Hay información oculta en la sala.</strong><p>Inspecciona los tres objetos para recuperar protocolos. Son apuntes de consulta: no descuentan puntos.</p></div><div class="scene-energy"><span>ENERGÍA DEL SECTOR</span><progress value="${state.results.filter((_, i) => QUESTIONS[i].room === room).length}" max="${Game.roomSize(QUESTIONS, room)}" aria-label="Energía recuperada del sector"></progress></div></section>`;
}
function wireScene(room) {
  document.querySelectorAll("[data-object]").forEach((button) =>
    button.addEventListener("click", () => {
      const i = Number(button.dataset.object),
        object = ROOM_OBJECTS[room][i],
        id = `${room}-${i}`;
      state.discovered ||= [];
      if (!state.discovered.includes(id)) {
        state.discovered.push(id);
        save();
      }
      button.classList.add("inspected");
      button.setAttribute("aria-pressed", "true");
      document.querySelector(".scene-top>span:last-child").textContent =
        `${state.discovered.filter((v) => v.startsWith(`${room}-`)).length}/3 objetos`;
      document.querySelector("#object-detail").innerHTML =
        `<strong>${escapeHTML(object.title)}</strong><p>${escapeHTML(object.text)}</p>`;
      announce(`${object.title}. ${object.text}`);
    }),
  );
}
function showRoomComplete(room) {
  screen = "checkpoint";
  const totals = Game.summary(state.results, QUESTIONS),
    next = ROOMS[room + 1];
  main.innerHTML = `<section class="checkpoint"><span class="eyebrow">SECTOR 0${room + 1} RESTAURADO</span><div class="fragment-orbit"><span>◆</span><i></i><i></i></div><h1 tabindex="-1">Fragmento recuperado:<br><em>${ROOMS[room].fragment}</em></h1><p>${ROOMS[room].name} vuelve a estar en línea. Has conseguido ${number(totals.rooms[room].earned)} de ${totals.rooms[room].max} puntos en esta sala.</p><div class="checkpoint-key">${ROOMS.map((r, i) => `<span class="${i <= room ? "lit" : ""}">${i <= room ? "◆" : "◇"} ${r.language}</span>`).join("")}</div><div class="checkpoint-brief"><span class="eyebrow">SIGUIENTE OBJETIVO</span><h2>${next ? next.name : "Proyecto de rescate final"}</h2><p>${next ? next.description + " Te esperan preguntas, reparaciones y pruebas prácticas." : "Usa lo aprendido para diseñar tu tarjeta de agente. Guarda el código y explica tus decisiones en el informe."}</p></div><button class="primary" id="continue-sector">${next ? "Entrar en la siguiente sala" : "Abrir el taller final"} <span>→</span></button></section>`;
  document.querySelector("#continue-sector").addEventListener("click", () => {
    next ? renderGame() : renderProject();
    focusTitle();
  });
  focusTitle();
}
const PROJECT_START = {
  html: '<main class="tarjeta">\n  <h1>Agente web</h1>\n  <p>Escribe aquí tu presentación como agente.</p>\n  <ul>\n    <li>HTML: estructura</li>\n    <li>CSS: diseño</li>\n    <li>JavaScript: comportamiento</li>\n  </ul>\n  <a class="boton" href="#objetivo">Ver mi objetivo</a>\n  <section id="objetivo">Mi objetivo de aprendizaje es…</section>\n</main>',
  css: "body {\n  background-color: #151521;\n  color: white;\n  font-family: sans-serif;\n  padding: 24px;\n}\n.tarjeta {\n  max-width: 420px;\n  margin: auto;\n  padding: 24px;\n  border-radius: 16px;\n  background-color: #302740;\n}\n.boton {\n  display: inline-block;\n  padding: 12px;\n  color: black;\n  background-color: #c7fa74;\n  border-radius: 8px;\n}\n@media (max-width: 600px) {\n  body { padding: 12px; }\n}",
  reflection: "",
};
function projectDocument(project, preview = false) {
  const template = document.createElement("template");
  template.innerHTML = project.html;
  template.content
    .querySelectorAll(
      "script,style,meta,base,link,iframe,object,embed,form,svg,math",
    )
    .forEach((node) => node.remove());
  template.content.querySelectorAll("*").forEach((node) => {
    [...node.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase(),
        value = attribute.value.trim();
      if (
        ![
          "class",
          "id",
          "alt",
          "title",
          "aria-label",
          "href",
          "src",
          "style",
        ].includes(name) ||
        (name === "href" && !value.startsWith("#")) ||
        (name === "src" &&
          !/^data:image\/(png|jpeg|gif|webp);base64,/i.test(value))
      )
        node.removeAttribute(attribute.name);
    });
    if (preview && node.getAttribute("href")?.startsWith("#"))
      node.setAttribute("href", "about:srcdoc" + node.getAttribute("href"));
  });
  // Sandbox and CSP keep student markup and styles isolated from the game and network.
  const policy =
    "default-src 'none'; style-src 'unsafe-inline'; img-src data:; form-action 'none'; base-uri 'none'";
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="${policy}"><title>Tarjeta del agente</title><style>${project.css.replace(/<\/style/gi, "< /style")}</style></head><body>${template.innerHTML}</body></html>`;
}
function renderProject() {
  if (QUESTIONS === LEGACY_QUESTIONS) {
    renderResults();
    return;
  }
  screen = "project";
  state.project ||= { ...PROJECT_START };
  const project = state.project;
  main.innerHTML = `<section class="mission-header"><div><span class="eyebrow">TALLER FINAL / 20 MINUTOS ORIENTATIVOS</span><h1 tabindex="-1">Construye tu <em>tarjeta de agente.</em></h1></div><span class="project-badge">36 RETOS COMPLETADOS ✓</span></section><div class="project-intro"><p>Ya has recuperado el sistema. Personaliza esta tarjeta: cambia el nombre y la presentación, añade una habilidad, elige tus colores y modifica el botón y el diseño móvil. Comprueba el resultado y explica una decisión de HTML, otra de CSS y una condición JavaScript que has aprendido.</p><p>La nota automática se calcula con los 36 retos. Este proyecto y tu explicación se adjuntan como evidencia de aprendizaje para el profesor, sin puntos automáticos adicionales.</p></div><form id="project-form"><div class="project-layout"><section class="project-editors"><label>HTML · estructura<textarea id="project-html" required minlength="40" maxlength="12000" spellcheck="false">${escapeHTML(project.html)}</textarea></label><label>CSS · diseño<textarea id="project-css" required minlength="20" maxlength="12000" spellcheck="false">${escapeHTML(project.css)}</textarea></label></section><section class="project-preview"><div class="preview-toolbar"><span>VISTA PREVIA AISLADA</span><button type="button" class="secondary" id="preview-width" aria-pressed="false">Probar ancho móvil</button></div><div class="iframe-wrap"><iframe title="Vista previa de tu tarjeta" sandbox=""></iframe></div><p>La vista previa admite HTML y CSS. Los scripts y las conexiones externas están bloqueados. Puedes usar un enlace interno como #objetivo.</p><button type="button" class="secondary" id="export-project">Descargar mi tarjeta (.html) ↓</button><div class="project-checklist"><h2>Comprueba tu trabajo</h2><ul><li>Mi nombre, presentación y habilidades están personalizados.</li><li>El enlace apunta al objetivo correcto.</li><li>He cambiado colores, padding y esquinas.</li><li>He revisado los anchos de escritorio y móvil.</li></ul></div></section></div><label class="reflection-label">Bitácora del agente · explica tus decisiones<textarea id="project-reflection" required minlength="40" maxlength="2000" placeholder="HTML: he usado… porque…\nCSS: he cambiado… para…\nJavaScript: la condición… se cumple cuando…">${escapeHTML(project.reflection)}</textarea></label><p id="project-status" role="status">Tu trabajo se guarda en este navegador mientras escribes.</p><div class="project-finish"><span>El proyecto y la bitácora aparecerán en tu informe.</span><button class="primary" type="submit">Conectar los fragmentos y salir <span>↗</span></button></div></form>`;
  const iframe = document.querySelector("iframe");
  function update() {
    state.project = {
      html: document.querySelector("#project-html").value,
      css: document.querySelector("#project-css").value,
      reflection: document.querySelector("#project-reflection").value,
    };
    save();
    iframe.srcdoc = projectDocument(state.project, true);
    document.querySelector("#project-status").textContent = storageAvailable
      ? "Proyecto guardado en este navegador."
      : "Sin guardado disponible. Descarga tu tarjeta y no cierres esta pestaña.";
  }
  let previewTimer;
  document.querySelector("#project-form").addEventListener("input", () => {
    state.project = {
      html: document.querySelector("#project-html").value,
      css: document.querySelector("#project-css").value,
      reflection: document.querySelector("#project-reflection").value,
    };
    save();
    clearTimeout(previewTimer);
    previewTimer = setTimeout(update, 300);
  });
  document
    .querySelector("#preview-width")
    .addEventListener("click", (event) => {
      const pressed = event.target.getAttribute("aria-pressed") !== "true";
      event.target.setAttribute("aria-pressed", pressed);
      event.target.textContent = pressed
        ? "Volver al ancho completo"
        : "Probar ancho móvil";
      document
        .querySelector(".iframe-wrap")
        .classList.toggle("narrow", pressed);
    });
  document.querySelector("#export-project").addEventListener("click", () => {
    update();
    downloadFile(
      projectDocument(state.project),
      `tarjeta-agente-${state.id}.html`,
    );
  });
  document
    .querySelector("#project-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      clearTimeout(previewTimer);
      update();
      if (!Game.validProject(state.project, true)) {
        announce(
          "Completa el HTML, el CSS y al menos 40 caracteres de explicación.",
        );
        return;
      }
      state.finished = Date.now();
      state.review = false;
      save();
      showEscape();
    });
  update();
}
function showEscape() {
  screen = "escape";
  main.innerHTML = `<section class="checkpoint escape-finale"><span class="eyebrow">LOS TRES FRAGMENTOS ESTÁN CONECTADOS</span><div class="escape-door" aria-hidden="true"><div></div><span>↗</span></div><h1 tabindex="-1">La salida es tuya.</h1><p>Has reconstruido la estructura, recuperado el diseño y reactivado la lógica.</p><button class="primary" id="open-exit">Abrir la puerta y recoger mi informe <span>↗</span></button></section>`;
  document.querySelector("#open-exit").addEventListener("click", (event) => {
    event.target.disabled = true;
    document.querySelector(".escape-finale").classList.add("door-open");
    const delay = matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 850;
    setTimeout(() => {
      renderResults();
      focusTitle();
    }, delay);
  });
  focusTitle();
}
function downloadFile(content, filename) {
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/html;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
