const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const artifacts = fs.mkdtempSync(path.join(os.tmpdir(), "codigo-de-fuga-qa-"));
const { QUESTIONS } = require("../questions.js");
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:4173");
  await page.screenshot({
    path: artifacts + "/welcome-desktop.png",
    fullPage: true,
  });
  await page
    .getByLabel("Nombre y apellidos")
    .fill("Ana García <script>alert(1)</script>");
  await page.getByLabel("Curso / grupo").fill("1.º DAW A");
  await page.getByRole("button", { name: /Entrar en el escape/ }).click();
  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    await page.getByRole("heading", { name: q.title, exact: true }).waitFor();
    if (q.options)
      await page
        .locator(`input[name="answer"][value="${i === 1 ? "0" : q.answer}"]`)
        .check();
    else
      await page
        .locator('input[name="answer"]')
        .fill(`  ${q.answer.toUpperCase()}  `);
    if (i === 0 || i === 1 || i === 7)
      await page.getByRole("button", { name: /Pedir pista/ }).click();
    if (i === 7)
      assert.equal(
        await page.locator('input[name="answer"]').inputValue(),
        "  .AVISO  ",
      );
    if (i === 0)
      await page.screenshot({
        path: artifacts + "/question-desktop.png",
        fullPage: true,
      });
    await page.getByRole("button", { name: /Validar respuesta/ }).click();
    if (i === 0) {
      await page.reload();
      await page.getByRole("button", { name: /Continuar misión/ }).click();
      await page.locator(".feedback").waitFor();
      assert.equal(
        await page.locator(".feedback strong").first().textContent(),
        "Acceso validado. +0,75 pt",
      );
    }
    await page
      .getByRole("button", {
        name: /Siguiente reto|Entrar en la siguiente sala|Abrir la salida/,
      })
      .click();
  }
  await page.getByRole("heading", { name: /Has encontrado/ }).waitFor();
  assert.equal(await page.locator(".grade").textContent(), "9,17/ 10");
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("codigo-de-fuga-v1")),
  );
  assert.equal(saved.results.length, 18);
  assert.equal(saved.results.filter((r) => r.hint).length, 3);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Descargar informe/ }).click();
  const download = await downloadPromise;
  await download.saveAs(artifacts + "/report.html");
  const html = fs.readFileSync(artifacts + "/report.html", "utf8");
  assert.ok(html.includes("9,17 / 10"));
  assert.ok(html.includes("Ana García &lt;script&gt;alert(1)&lt;/script&gt;"));
  assert.equal((html.match(/<article>/g) || []).length, 18);
  assert.ok(!html.includes("<script>"));
  await page.screenshot({
    path: artifacts + "/results-desktop.png",
    fullPage: true,
  });
  await page.reload();
  await page.getByRole("button", { name: /Ver mi resultado/ }).click();
  assert.equal(await page.locator(".grade").textContent(), "9,17/ 10");
  await page.context().addInitScript(() => {
    window.print = () => {
      window.printCalled = true;
    };
  });
  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: /Guardar como PDF/ }).click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  assert.equal(await popup.locator("article").count(), 18);
  assert.equal(await popup.evaluate(() => window.printCalled), true);
  await popup.pdf({
    path: artifacts + "/report.pdf",
    format: "A4",
    printBackground: true,
  });
  await popup.close();
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await mobile.goto("http://127.0.0.1:4173");
  assert.ok(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await mobile.screenshot({
    path: artifacts + "/welcome-mobile.png",
    fullPage: true,
  });
  await mobile.getByLabel("Nombre y apellidos").fill("Luis Pérez");
  await mobile.getByLabel("Curso / grupo").fill("2 B");
  await mobile.getByRole("button", { name: /Entrar en el escape/ }).click();
  assert.ok(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await mobile.screenshot({
    path: artifacts + "/question-mobile.png",
    fullPage: true,
  });
  await mobile.locator('input[value="0"]').check();
  await mobile.getByRole("button", { name: /Validar/ }).click();
  assert.equal(
    await mobile.locator(".feedback strong").first().textContent(),
    "Acceso validado. +1,00 pt",
  );
  for (const width of [320, 768, 1024]) {
    await mobile.setViewportSize({ width, height: 900 });
    await mobile.evaluate(
      (s) => localStorage.setItem("codigo-de-fuga-v1", JSON.stringify(s)),
      saved,
    );
    await mobile.reload();
    await mobile.getByRole("button", { name: /Ver mi resultado/ }).click();
    assert.ok(
      await mobile.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Results overflow at ${width}px`,
    );
  }
  // Blocked storage must not prevent starting the mission.
  const blocked = await browser.newPage();
  await blocked.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage blocked");
      },
    });
  });
  await blocked.goto("http://127.0.0.1:4173");
  await blocked.getByLabel("Nombre y apellidos").fill("Sin Almacenamiento");
  await blocked.getByLabel("Curso / grupo").fill("A");
  await blocked.getByRole("button", { name: /Entrar en el escape/ }).click();
  assert.ok(
    (await blocked.locator("#save-status").textContent()).includes(
      "Sin guardado",
    ),
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: partida completa, nota mixta 9,17, pistas, recarga, informe HTML, PDF, móvil, escape de HTML y almacenamiento bloqueado.",
  );
  await browser.close();
  console.log("Artefactos de prueba:", artifacts);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
