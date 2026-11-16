const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const H = require('../hospital-data.js');
const artifacts = fs.mkdtempSync(path.join(os.tmpdir(),'hospital-qa-'));
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/hospital.html');
  await page.screenshot({path:path.join(artifacts,'welcome.png'),fullPage:true});
  await page.getByLabel('Nombre y apellidos').fill('Ana <script>alert(1)</script>');
  await page.getByLabel('Curso / grupo').fill('1 DAW');
  await page.getByRole('button',{name:'Comenzar el diagnóstico →'}).click();
  for(let stage=0;stage<4;stage++){
   for(const q of H.questions.filter(q=>q.stage===stage)){
    const form=page.locator(`[data-question="${q.id}"]`);
    const answer=q.id===0 ? '0' : q.answer;
    if(q.id===0)await form.getByRole('button',{name:'Pista 1 · Orientación'}).click();
    if(q.options)await form.locator(`[value="${answer}"]`).check();
    else await form.getByRole('textbox').fill(answer);
    if(q.id===1){
     await page.reload();await page.getByRole('button',{name:'Continuar actividad'}).click();
     assert.ok(await form.locator(`[value="${answer}"]`).isChecked());
    }
    await form.getByRole('button',{name:'Comprobar respuesta',exact:true}).click();
    if(q.id===0){
     await form.locator(`[value="${q.answer}"]`).check();
     await form.getByRole('button',{name:'Comprobar reparación'}).click();
     assert.ok((await page.locator('#question-0').innerText()).includes('Reparación posterior comprobada'));
    }
   }
   await page.getByRole('button',{name:/Continuar al siguiente bloque/}).click();
  }
  await page.getByRole('button',{name:'Entregar las 8 respuestas'}).click();
  assert.ok((await page.locator('#block-error').innerText()).includes('Responde las ocho'));
  const finals=H.questions.filter(q=>q.stage===4);
  for(const q of finals)await page.locator(`[data-question="${q.id}"] [value="${q.answer}"]`).check();
  assert.equal(await page.locator('.feedback').count(),0);
  await page.reload();await page.getByRole('button',{name:'Continuar actividad'}).click();
  assert.ok(await page.locator(`[data-question="${finals[0].id}"] [value="${finals[0].answer}"]`).isChecked());
  await page.getByRole('button',{name:'Entregar las 8 respuestas'}).click();
  assert.equal(await page.locator('.feedback').count(),8);
  await page.getByRole('button',{name:/Ver mi plan/}).click();
  assert.ok((await page.locator('.score').allTextContents()).includes('10.00 / 10'));
  await page.getByRole('textbox',{name:/Mi plan/}).fill('He aprendido la diferencia entre padding y margin. Revisaré los límites de edad.');
  await page.getByRole('button',{name:'Cerrar la guardia'}).click();
  const pending=page.waitForEvent('download');
  await page.getByRole('button',{name:'Descargar informe (.html)'}).click();
  const download=await pending;const file=path.join(artifacts,'report.html');await download.saveAs(file);
  const html=fs.readFileSync(file,'utf8');assert.ok(html.includes('Ana &lt;script&gt;'));assert.ok(!html.includes('<script>'));assert.equal((html.match(/<article>/g)||[]).length,35);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('hospital-codigo-v1')));
  assert.ok(H.validState(saved));assert.equal(saved.results[0].answer,'0');assert.equal(saved.results[0].repaired,true);assert.equal(saved.results[0].hint,true);
  await page.screenshot({path:path.join(artifacts,'report.png'),fullPage:true});
  await page.reload();await page.getByRole('button',{name:'Ver informe',exact:true}).click();
  assert.equal(await page.getByRole('button',{name:'Descargar informe (.html)'}).isEnabled(),true);
  await page.setViewportSize({width:390,height:844});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:path.join(artifacts,'mobile.png'),fullPage:true});
  await page.goto('http://127.0.0.1:4173');
  await page.getByRole('link',{name:'Entrar al hospital →'}).click();
  await page.getByRole('button',{name:'Empezar otro intento'}).click();
  assert.ok(await page.getByRole('button',{name:'Sí, empezar uno nuevo'}).isVisible());
  assert.ok(await page.evaluate(()=>!!localStorage.getItem('hospital-codigo-v1')));
  const noStorage=await browser.newContext();await noStorage.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}});});
  const blocked=await noStorage.newPage();await blocked.goto('http://127.0.0.1:4173/hospital.html');
  await blocked.getByLabel('Nombre y apellidos').fill('Sin guardado');await blocked.getByLabel('Curso / grupo').fill('A');await blocked.getByRole('button',{name:'Comenzar el diagnóstico →'}).click();
  assert.ok((await blocked.locator('#storage-warning').innerText()).includes('No se puede guardar'));
  assert.deepEqual(errors,[]);
  console.log('Hospital: recorrido completo, pistas, reparación, recarga, simulacro, informe seguro, móvil y almacenamiento bloqueado OK. Artefactos: '+artifacts);
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
