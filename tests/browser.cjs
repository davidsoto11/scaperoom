const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { QUESTIONS, LEGACY_QUESTIONS } = require("../questions.js");
const Game = require("../game.js");
const artifacts = fs.mkdtempSync(path.join(os.tmpdir(), "codigo-de-fuga-v2-"));
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:4173");
  await page.screenshot({
    path: path.join(artifacts, "welcome.png"),
    fullPage: true,
    animations: "disabled",
  });
  await page
    .getByLabel("Nombre y apellidos")
    .fill("Ana García <script>alert(1)</script>");
  await page.getByLabel("Curso / grupo").fill("1 DAW");
  await page.getByRole("button", { name: /Entrar en el escape/ }).click();
  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    await page.getByRole("heading", { name: q.title, exact: true }).waitFor();
    if (i % 12 === 0) {
      for (let object = 0; object < 3; object++)
        await page.locator(`[data-object="${object}"]`).click();
      assert.ok(
        (await page.locator(".scene-top").textContent()).includes(
          "3/3 objetos",
        ),
      );
      await page.locator('[data-object="0"]').click();
    }
    if (q.kind === "order") {
      const desired = Game.parts(q.answer);
      for (let target = 0; target < desired.length; target++) {
        const id = desired[target];
        while (
          (await page
            .locator(".order-list li")
            .evaluateAll(
              (rows, id) =>
                rows.findIndex((li) => Number(li.dataset.item) === id),
              id,
            )) > target
        )
          await page.locator(`[data-item="${id}"] [data-move="-1"]`).click();
      }
    } else if (q.kind) {
      const values = Game.parts(q.answer);
      for (let n = 0; n < values.length; n++) {
        if (q.kind === "style")
          await page.locator(`[data-part="${n}"]`).selectOption(values[n]);
        else await page.locator(`[data-part="${n}"]`).fill(values[n]);
      }
      if (q.kind === "style") {
        for (let n = 0; n < q.controls.length; n++)
          assert.equal(
            await page
              .locator(".style-preview")
              .evaluate(
                (el, p) => el.style.getPropertyValue(p),
                q.controls[n].property,
              ),
            values[n],
          );
        await page.screenshot({
          path: path.join(artifacts, `lab-${i}.png`),
          fullPage: true,
          animations: "disabled",
        });
      }
    } else if (q.options)
      await page
        .locator(`input[name="answer"][value="${i === 2 ? "0" : q.answer}"]`)
        .check();
    else
      await page
        .locator('input[name="answer"]')
        .fill(` ${q.answer.toUpperCase()} `);
    if ([0, 2, 15].includes(i))
      await page.getByRole("button", { name: /Pedir pista/ }).click();
    if (i === 1) {
      await page.reload();
      await page.getByRole("button", { name: /Continuar misión/ }).click();
      assert.deepEqual(
        await page
          .locator("[data-item]")
          .evaluateAll((rows) => rows.map((r) => Number(r.dataset.item))),
        Game.parts(q.answer),
      );
    }
    await page.getByRole("button", { name: /Validar respuesta/ }).click();
    if (i === 0) {
      await page.reload();
      await page.getByRole("button", { name: /Continuar misión/ }).click();
      assert.ok(
        (await page.locator(".feedback").textContent()).includes("+0,75 pt"),
      );
    }
    await page
      .getByRole("button", {
        name: /Siguiente reto|Entrar en la siguiente sala|Recuperar el último/,
      })
      .click();
    if ((i + 1) % 12 === 0) {
      await page
        .getByRole("heading", { name: /Fragmento recuperado/ })
        .waitFor();
      await page.screenshot({
        path: path.join(artifacts, `checkpoint-${q.room}.png`),
        fullPage: true,
        animations: "disabled",
      });
      await page
        .getByRole("button", {
          name: /Entrar en la siguiente sala|Abrir el taller final/,
        })
        .click();
    }
  }
  await page.getByRole("heading", { name: /Construye tu/ }).waitFor();
  assert.equal(await page.locator("#project-reflection").inputValue(), "");
  await page
    .locator("#project-html")
    .fill(
      '<main class="tarjeta"><h1>Ana, agente web</h1><p>Rescato páginas con HTML y CSS.</p><a href="#objetivo">Objetivo</a><section id="objetivo">Practicar condiciones.</section></main>',
    );
  await page
    .locator("#project-reflection")
    .fill(
      "HTML: uso main para identificar el contenido principal. CSS: padding añade espacio interior. JavaScript: && exige que se cumplan dos condiciones.",
    );
  await page
    .locator("#project-css")
    .fill(
      "body { background-color: #151521; color: white; padding: 24px; } .tarjeta { border-radius: 20px; padding: 24px; background-color: purple; } @media (max-width:600px) {body {padding:8px;}}",
    );
  await page.waitForTimeout(400);
  await page
    .frameLocator("iframe")
    .getByRole("heading", { name: "Ana, agente web" })
    .waitFor();
  await page
    .frameLocator("iframe")
    .getByRole("link", { name: "Objetivo" })
    .click();
  await page
    .frameLocator("iframe")
    .getByRole("heading", { name: "Ana, agente web" })
    .waitFor();
  await page.getByRole("button", { name: "Probar ancho móvil" }).click();
  assert.equal(
    await page.locator("#preview-width").getAttribute("aria-pressed"),
    "true",
  );
  await page.screenshot({
    path: path.join(artifacts, "project.png"),
    fullPage: true,
    animations: "disabled",
  });
  await page.reload();
  await page.getByRole("button", { name: /Continuar misión/ }).click();
  assert.ok(
    (await page.locator("#project-reflection").inputValue()).includes(
      "HTML: uso main",
    ),
  );
  const cardDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: /Descargar mi tarjeta/ }).click();
  await (await cardDownload).saveAs(path.join(artifacts, "card.html"));
  await page.getByRole("button", { name: /Conectar los fragmentos/ }).click();
  await page.getByRole("button", { name: /Abrir la puerta/ }).click();
  await page.getByRole("heading", { name: /Has encontrado/ }).waitFor();
  const expected = (((36 - 1 - 0.5) / 36) * 10).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  assert.equal(await page.locator(".grade").textContent(), expected + "/ 10");
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("codigo-de-fuga-v2")),
  );
  assert.equal(saved.results.length, 36);
  assert.equal(saved.discovered.length, 9);
  assert.ok(Game.validState(saved, QUESTIONS));
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Descargar informe/ }).click();
  await (await downloadPromise).saveAs(path.join(artifacts, "report.html"));
  const report = fs.readFileSync(path.join(artifacts, "report.html"), "utf8");
  assert.ok(report.includes(expected + " / 10"));
  assert.equal((report.match(/<article>/g) || []).length, 36);
  assert.ok(report.includes("36/36 retos completados"));
  assert.ok(report.includes("HTML: uso main"));
  assert.ok(
    report.includes("Ana García &lt;script&gt;alert(1)&lt;/script&gt;"),
  );
  assert.ok(!report.includes("<script>"));
  await page.context().addInitScript(() => {
    window.print = () => {
      window.printCalled = true;
    };
  });
  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: /Guardar como PDF/ }).click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  assert.equal(await popup.evaluate(() => window.printCalled), true);
  await popup.pdf({ path: path.join(artifacts, "report.pdf"), format: "A4" });
  await popup.close();
  await page.reload();
  await page.getByRole("button", { name: /Ver mi resultado/ }).click();
  assert.equal(await page.locator(".grade").textContent(), expected + "/ 10");
  await page.screenshot({
    path: path.join(artifacts, "results.png"),
    fullPage: true,
    animations: "disabled",
  });
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  for (const width of [320, 390, 768, 1024]) {
    await mobile.setViewportSize({ width, height: 900 });
    await mobile.goto("http://127.0.0.1:4173");
    const variants = [
      { ...saved, finished: null, results: [], review: false, draft: null },
      {
        ...saved,
        finished: null,
        results: saved.results.slice(0, 13),
        review: false,
        draft: null,
      },
      {
        ...saved,
        finished: null,
        results: saved.results.slice(0, 16),
        review: false,
        draft: null,
      },
      { ...saved, finished: null, review: false, draft: null },
      saved,
    ];
    for (let variant = 0; variant < variants.length; variant++) {
      await mobile.evaluate(
        (s) => localStorage.setItem("codigo-de-fuga-v2", JSON.stringify(s)),
        variants[variant],
      );
      await mobile.reload();
      await mobile
        .getByRole("button", { name: /Continuar misión|Ver mi resultado/ })
        .click();
      assert.ok(
        await mobile.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `Overflow ${width}, variant ${variant}`,
      );
      if (width === 390)
        await mobile.screenshot({
          path: path.join(artifacts, `mobile-${variant}.png`),
          fullPage: true,
          animations: "disabled",
        });
    }
  }
  // Preview must not execute scripts or load external assets from learner markup.
  const isolation = await browser.newPage();
  const external = [];
  isolation.on("request", (r) => {
    if (
      !r.url().startsWith("http://127.0.0.1:4173") &&
      !r.url().startsWith("data:") &&
      !r.url().startsWith("about:")
    )
      external.push(r.url());
  });
  await isolation.goto("http://127.0.0.1:4173");
  await isolation.evaluate(
    (s) => localStorage.setItem("codigo-de-fuga-v2", JSON.stringify(s)),
    { ...saved, finished: null },
  );
  await isolation.reload();
  await isolation.getByRole("button", { name: /Continuar misión/ }).click();
  await isolation
    .locator("#project-html")
    .fill(
      '<main><h1>Prueba segura</h1><script>parent.document.body.innerHTML="ROTO"</script><img src="https://example.com/no.png" onerror="alert(1)"><iframe src="https://example.com"></iframe><a href="https://example.com">Fuera</a><meta http-equiv="refresh" content="0;url=https://example.com"></main>',
    );
  await isolation.waitForTimeout(500);
  assert.equal(
    await isolation
      .frameLocator("iframe")
      .locator('script, iframe, meta[http-equiv="refresh"]')
      .count(),
    0,
  );
  assert.equal(
    await isolation.frameLocator("iframe").getByRole("link").count(),
    0,
  );
  assert.deepEqual(external, []);
  // Old attempts keep their original questions and scores.
  const legacyPage = await browser.newPage();
  await legacyPage.goto("http://127.0.0.1:4173");
  const old = {
    ...saved,
    version: 1,
    results: LEGACY_QUESTIONS.map((q) => ({
      answer: q.answer,
      correct: true,
      hint: false,
      at: saved.started + 1,
    })),
    finished: saved.finished,
  };
  await legacyPage.evaluate(
    (s) => localStorage.setItem("codigo-de-fuga-v1", JSON.stringify(s)),
    old,
  );
  await legacyPage.reload();
  await legacyPage.getByRole("button", { name: /Ver mi resultado/ }).click();
  assert.equal(await legacyPage.locator(".grade").textContent(), "10,00/ 10");
  assert.ok(
    (await legacyPage.locator(".grade-card").textContent()).includes(
      "18 puntos",
    ),
  );
  const blocked = await browser.newPage();
  await blocked.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("blocked");
      },
    });
  });
  await blocked.goto("http://127.0.0.1:4173");
  await blocked.getByLabel("Nombre y apellidos").fill("Sin almacenamiento");
  await blocked.getByLabel("Curso / grupo").fill("A");
  await blocked.getByRole("button", { name: /Entrar en el escape/ }).click();
  assert.ok(
    (await blocked.locator("#save-status").textContent()).includes(
      "Sin guardado",
    ),
  );
  assert.deepEqual(errors, []);
  await browser.close();
  console.log(
    "PASS: 36 retos, objetos, laboratorios, orden, borradores, proyecto, exportación, PDF, legado, sandbox y móvil. Artefactos:",
    artifacts,
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
