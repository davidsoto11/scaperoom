(() => {
  'use strict';
  const H = Hospital;
  // shortcut: la corrección local es editable; usar Moodle para una evaluación certificada.
  const KEY = 'hospital-codigo-v1';
  const main = document.querySelector('main');
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let state = null;
  let storageWarning = '';
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (H.validState(parsed)) state = parsed;
      else storageWarning = 'El intento guardado no es compatible o está incompleto. Puedes empezar uno nuevo.';
    }
  } catch {
    storageWarning = 'No se ha podido recuperar el guardado. Mantén esta pestaña abierta y descarga el informe al terminar.';
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch { storageWarning = 'No se puede guardar en este navegador. Mantén la pestaña abierta y descarga el informe al terminar.'; }
    const warning = document.querySelector('#storage-warning');
    if (warning) { warning.textContent = storageWarning; warning.hidden = !storageWarning; }
  }
  function announce(message) { document.querySelector('#status').textContent = message; }
  function warning() { return `<p id="storage-warning" class="warning" ${storageWarning ? '' : 'hidden'}>${esc(storageWarning)}</p>`; }
  function focusHeading() { main.querySelector('h1').focus(); }
  function sourceLinks() {
    return `<nav class="sources" aria-label="Apuntes">${Object.entries(H.sources).map(([name,path]) => `<a target="_blank" rel="noopener" href="${encodeURI(path)}">${esc(name)} ↗</a>`).join('')}</nav>`;
  }
  function welcome() {
    main.innerHTML = `<section class="hero"><p class="eyebrow">Guardia de repaso · 60 minutos</p><h1 tabindex="-1">Una web averiada.<br>Tu turno de repararla.</h1><p class="lead">La venta de entradas del festival ha dejado de funcionar. Recupera su estructura, su diseño y su lógica, y comprueba qué llevas preparado para el examen.</p><span class="pill">32 preguntas tipo test</span><span class="pill">3 huecos de código</span><span class="pill">A tu ritmo</span></section>${warning()}
      <div class="grid"><section class="panel"><p class="eyebrow">01 · Detecta</p><h2>Piensa antes de pulsar</h2><p>Lee el código y predice el resultado. Los fallos del diagnóstico te orientan.</p></section><section class="panel"><p class="eyebrow">02 · Repara</p><h2>Aprende del error</h2><p>Consulta pistas y apuntes, lee la explicación y vuelve a probar. Se conserva tu primer intento.</p></section><section class="panel"><p class="eyebrow">03 · Comprueba</p><h2>Simulacro final</h2><p>Ocho preguntas nuevas sin pistas. La corrección se muestra al entregar el bloque completo.</p></section></div>
      <div class="start"><section class="panel"><h2>Tu hoja de ruta</h2><ol>${H.stages.map(s=>`<li><strong>${s.minutes} min</strong> · ${s.label}</li>`).join('')}</ol><p class="muted">Los tiempos son orientativos. El reloj no bloquea ni penaliza. Si terminas un bloque antes, explica un fallo y prueba otro caso antes de continuar.</p>${sourceLinks()}</section><section class="panel"><h2>${state ? 'Tu guardia está guardada' : 'Empieza la guardia'}</h2>${state ? `<p><strong>${esc(state.name)}</strong> · ${esc(state.group)}</p><p>${H.summary(state.results).answered} de ${H.questions.length} respuestas guardadas.</p><div class="actions"><button class="primary" id="resume">${state.finished ? 'Ver informe' : 'Continuar actividad'}</button><button id="new">Empezar otro intento</button></div><div id="reset" hidden><p class="warning">Se sustituirá el intento guardado en este navegador. Descarga el informe antes si quieres conservarlo.</p><button id="confirm-new">Sí, empezar uno nuevo</button></div>` : startForm()}<p class="muted">Los datos se guardan solo en este navegador. No se envían al profesor: descarga el informe y súbelo a Moodle. En un equipo compartido, inicia tu propio intento.</p></section></div>`;
    document.querySelector('#resume')?.addEventListener('click', render);
    document.querySelector('#new')?.addEventListener('click', () => { document.querySelector('#reset').hidden = false; });
    document.querySelector('#confirm-new')?.addEventListener('click', () => { state = null; welcome(); document.querySelector('#name').focus(); });
    bindStart();
  }
  function startForm() {
    return `<form id="start" class="fields"><label>Nombre y apellidos<input id="name" name="name" type="text" autocomplete="name" required maxlength="100"></label><label>Curso / grupo<input name="group" type="text" required maxlength="60"></label><button class="primary">Comenzar el diagnóstico →</button><p class="error" id="start-error" role="alert"></p></form>`;
  }
  function bindStart() {
    document.querySelector('#start')?.addEventListener('submit', event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const name = form.get('name').trim(), group = form.get('group').trim();
      if (!name || !group) { document.querySelector('#start-error').textContent = 'Escribe tu nombre y tu grupo.'; return; }
      state = {version:1,name,group,started:Date.now(),finished:null,stage:0,results:{},drafts:{},hints:[],reflection:''};
      save(); render();
    });
  }
  function feedback(q) {
    const r = state.results[q.id];
    if (!r) return '';
    const right = H.correct(q,r.answer);
    return `<div class="feedback ${right ? '' : 'wrong'}"><strong>${right ? 'Primer intento correcto' : 'Primer intento para repasar'}</strong><p>Tu primera respuesta: ${esc(label(q,r.answer))}.</p><p>Solución: <strong>${esc(label(q,q.answer))}</strong></p><p>${esc(q.explanation)}</p>${r.hint ? '<p>Consultaste una pista antes de responder.</p>' : ''}${r.repaired && !right ? '<p>✓ Reparación posterior comprobada. Tu primer resultado se conserva.</p>' : ''}</div>`;
  }
  function label(q,a) { return q.options ? q.options[Number(a)] : a; }
  function questionCard(q) {
    const r = state.results[q.id];
    const retry = r && q.stage < 4 && !H.correct(q,r.answer) && !r.repaired;
    const locked = r && !retry;
    const draft = state.drafts[q.id] ?? r?.answer ?? '';
    return `<article class="card" id="question-${q.id}" aria-labelledby="title-${q.id}"><p class="eyebrow">${esc(q.topic)} · ${q.options ? 'Tipo test' : 'Reparación de una palabra'}</p><h2 id="title-${q.id}">${esc(q.title)}</h2><p>${esc(q.prompt)}</p>${q.code ? `<pre><code>${esc(q.code)}</code></pre>` : ''}<form data-question="${q.id}"><fieldset ${locked ? 'disabled' : ''}><legend>${retry ? 'Vuelve a probar la reparación' : 'Elige o escribe tu respuesta'}</legend>${q.options ? q.options.map((option,i)=>`<label class="option"><input type="radio" name="answer" value="${i}" ${draft === String(i) ? 'checked' : ''} required><span>${String.fromCharCode(65+i)} · ${esc(option)}</span></label>`).join('') : `<label>Palabra que falta<input type="text" name="answer" maxlength="120" value="${esc(draft)}" autocomplete="off" autocapitalize="off" spellcheck="false" required></label>`}</fieldset>${q.stage < 4 && !locked ? `<div class="actions"><button class="primary" type="submit">${retry ? 'Comprobar reparación' : 'Comprobar respuesta'}</button>${!r ? `<button type="button" data-hint="${q.id}" aria-expanded="${state.hints.includes(q.id)}" aria-controls="hint-${q.id}">Pista 1 · Orientación</button>` : ''}</div>` : ''}<p class="error" data-error role="alert"></p></form>${q.stage < 4 ? `<div id="hint-${q.id}" ${state.hints.includes(q.id) ? '' : 'hidden'}><p>${esc(q.hint)}</p><details><summary>Pista 2 · Dónde buscar</summary><p>Abre los apuntes de ${esc(q.topic)} y localiza la regla de este ejercicio. Vuelve al código y descarta una opción explicando por qué falla.</p><a target="_blank" rel="noopener" href="${encodeURI(H.sources[q.topic])}">Consultar apuntes de ${esc(q.topic)} ↗</a></details></div>` : ''}${feedback(q)}</article>`;
  }
  function render() {
    const stage = H.stages[state.stage];
    main.innerHTML = `<div class="session"><p class="eyebrow">Paciente 001 · Web de entradas</p><span>${esc(state.name)} · <span id="clock" class="clock"></span></span></div><ol class="route" aria-label="Ruta de la clase">${H.stages.map((s,i)=>`<li ${i === state.stage ? 'aria-current="step"' : ''}>${i < state.stage ? '✓ ' : `${i+1}. `}${s.title}<small>${s.minutes} min orientativos</small></li>`).join('')}</ol><label class="sr-only" for="progress">Respuestas completadas</label><progress id="progress" max="${H.questions.length}" value="${H.summary(state.results).answered}"></progress><p class="muted">${H.summary(state.results).answered} / ${H.questions.length} respuestas comprobadas</p>${warning()}<h1 tabindex="-1">${esc(stage.label)}</h1><p class="lead">${esc(stage.intro)}</p>`;
    if (state.stage === 5) renderReport();
    else {
      const qs = H.questions.filter(q=>q.stage === state.stage);
      const complete = qs.every(q=>state.results[q.id]);
      main.insertAdjacentHTML('beforeend', `${state.stage < 4 ? sourceLinks() : '<p class="case">Modo simulacro: una respuesta correcta vale un punto, los errores no restan. Nota orientativa sobre 10. Resuelve este bloque sin consultar los apuntes.</p>'}${state.stage === 0 ? '' : state.stage < 4 ? '<p class="case">Protocolo: lee → predice → comprueba → explica. Las pistas no restan puntos; el informe indica si las utilizaste. La puntuación de práctica cuenta el primer intento.</p>' : ''}${qs.map(questionCard).join('')}<section class="panel"><h2>${complete ? 'Bloque completado' : 'Antes de continuar'}</h2><p>${complete ? 'Revisa las explicaciones. Si has terminado antes del tiempo orientativo, cambia un dato del código y predice qué pasaría.' : state.stage === 4 ? 'Puedes cambiar tus elecciones. Entrega cuando hayas respondido las ocho preguntas.' : 'Responde todos los ejercicios. Puedes avanzar aunque haya errores; las reparaciones posteriores son opcionales.'}</p><div class="actions">${state.stage === 4 && !complete ? '<button id="submit-exam" class="primary">Entregar las 8 respuestas</button>' : `<button id="next" class="primary" ${complete ? '' : 'disabled'}>${state.stage === 4 ? 'Ver mi plan de repaso' : 'Continuar al siguiente bloque'} →</button>`}</div><p id="block-error" class="error" role="alert"></p></section>`);
      bindQuestions();
      document.querySelector('#next')?.addEventListener('click',()=>{state.stage++;save();render();});
      document.querySelector('#submit-exam')?.addEventListener('click',()=>{
        const missing = qs.find(q=>!H.validAnswer(q,state.drafts[q.id]));
        if (missing) { document.querySelector('#block-error').textContent = 'Responde las ocho preguntas antes de entregar.'; document.querySelector(`#question-${missing.id} input`).focus(); return; }
        qs.forEach(q=>{state.results[q.id]={answer:state.drafts[q.id],hint:false,repaired:false};});
        save(); render(); announce('Simulacro entregado. Ya puedes consultar la corrección.');
      });
    }
    updateClock();focusHeading();
  }
  function bindQuestions(root = main) {
    root.querySelectorAll('[data-question]').forEach(form=>{
      const q = H.questions[Number(form.dataset.question)];
      form.addEventListener('input',()=>{
        const value = new FormData(form).get('answer');
        if (H.validAnswer(q,value)) state.drafts[q.id]=value;
        else delete state.drafts[q.id];
        save();
      });
      form.addEventListener('submit',event=>{
        event.preventDefault();
        if (q.stage === 4) return;
        const answer = new FormData(form).get('answer');
        if (!H.validAnswer(q,answer)) { form.querySelector('[data-error]').textContent='Escribe una respuesta antes de comprobar.'; return; }
        const r = state.results[q.id];
        if (r) {
          if (r.repaired || H.correct(q,r.answer)) return;
          if (!H.correct(q,answer)) { form.querySelector('[data-error]').textContent='Todavía no. Revisa la solución y vuelve a probar.'; return; }
          r.repaired=true;
        } else state.results[q.id]={answer,hint:state.hints.includes(q.id),repaired:false};
        state.drafts[q.id]=answer;
        save();
        // Actualizar la tarjeta conserva el foco y evita saltar al inicio del bloque.
        const card = document.querySelector(`#question-${q.id}`);
        card.outerHTML=questionCard(q);
        const completed = H.questions.filter(x=>x.stage===state.stage).every(x=>state.results[x.id]);
        document.querySelector('#next').disabled=!completed;
        document.querySelector('#progress').value=H.summary(state.results).answered;
        document.querySelector('#progress').nextElementSibling.textContent=`${H.summary(state.results).answered} / ${H.questions.length} respuestas comprobadas`;
        bindQuestions(document.querySelector(`#question-${q.id}`));
        const heading=document.querySelector(`#title-${q.id}`);heading.tabIndex=-1;heading.focus();
        announce(H.correct(q,answer) ? 'Respuesta correcta.' : 'Revisa la explicación y prueba a reparar el error.');
      });
    });
    bindHints(root);
  }
  function bindHints(root) {
    root.querySelectorAll('[data-hint]').forEach(button=>button.addEventListener('click',()=>{
      const id=Number(button.dataset.hint);
      if (!state.hints.includes(id)) state.hints.push(id);
      document.querySelector(`#hint-${id}`).hidden=false;
      button.setAttribute('aria-expanded','true');save();announce('Pista disponible debajo de la respuesta.');
    }));
  }
  function topicRows() {
    return Object.keys(H.sources).map(topic=>{
      const qs=H.questions.filter(q=>q.topic===topic && q.stage>0);
      const right=qs.filter(q=>state.results[q.id] && H.correct(q,state.results[q.id].answer)).length;
      return `<tr><th scope="row">${esc(topic)}</th><td>${right} / ${qs.length}</td><td>${right === qs.length ? 'Consolidado · prueba otro ejemplo' : 'Repasar · '+esc(qs.find(q=>!state.results[q.id] || !H.correct(q,state.results[q.id].answer)).title)}</td></tr>`;
    }).join('');
  }
  function reportContent() {
    const exam=H.summary(state.results,4), diagnostic=H.summary(state.results,0);
    const practiceQs=H.questions.filter(q=>q.stage>0 && q.stage<4);
    const practice=practiceQs.filter(q=>H.correct(q,state.results[q.id].answer)).length;
    return `<p><strong>${esc(state.name)}</strong> · ${esc(state.group)}</p><p>Inicio: ${date(state.started)}${state.finished ? ` · Fin: ${date(state.finished)}` : ''}</p><div class="grid"><section class="panel"><h2>Diagnóstico</h2><p class="score">${diagnostic.right} / ${diagnostic.total}</p><p>Punto de partida, sin nota.</p></section><section class="panel"><h2>Tratamiento</h2><p class="score">${practice} / ${practiceQs.length}</p><p>Aciertos en el primer intento. Pistas en toda la actividad: ${Object.values(state.results).filter(r=>r.hint).length}. Reparaciones en toda la actividad: ${Object.values(state.results).filter(r=>r.repaired).length}.</p></section><section class="panel"><h2>Simulacro</h2><p class="score">${exam.grade.toFixed(2)} / 10</p><p>${exam.right} de ${exam.total} aciertos. Los errores no restan.</p></section></div><h2>Tu siguiente paso</h2><p>Estos resultados incluyen práctica y simulacro, sin el diagnóstico. Prioriza los temas con fallos: lee su explicación, tapa la solución y resuelve un ejemplo cambiando un dato.</p><div class="table-wrap"><table><thead><tr><th>Tema</th><th>Primeros aciertos</th><th>Recomendación</th></tr></thead><tbody>${topicRows()}</tbody></table></div>`;
  }
  function renderReport() {
    main.insertAdjacentHTML('beforeend',`${reportContent()}${sourceLinks()}<section class="panel"><h2>Últimos 5 minutos</h2><p>Escribe una regla que hayas entendido, un error que corregiste y qué practicarás antes del examen. Si todo salió bien, explica qué caso límite revisarías.</p><form id="finish"><label>Mi plan de repaso (mínimo 30 caracteres)<textarea name="reflection" required minlength="30" maxlength="2000">${esc(state.reflection)}</textarea></label><div class="actions"><button class="primary">${state.finished ? 'Guardar mi plan actualizado' : 'Cerrar la guardia'}</button><button id="download" type="button" ${state.finished ? '' : 'disabled'}>Descargar informe (.html)</button><button id="home" type="button">Volver al inicio</button></div><p id="finish-message" role="status">${state.finished ? 'Guardia cerrada. Descarga el informe y súbelo a Moodle.' : 'Completa el plan y cierra la guardia para habilitar la descarga.'}</p></form></section><details><summary>Revisar todas mis respuestas y soluciones</summary>${H.questions.map(q=>`<article class="card"><p class="eyebrow">${esc(H.stages[q.stage].title)} · ${esc(q.topic)}</p><h3>${esc(q.title)}</h3><p>${esc(q.prompt)}</p>${q.code ? `<pre><code>${esc(q.code)}</code></pre>` : ''}${feedback(q)}</article>`).join('')}</details>`);
    document.querySelector('textarea').addEventListener('input',event=>{state.reflection=event.target.value;if(state.reflection.trim().length<30){state.finished=null;document.querySelector('#download').disabled=true;}save();});
    document.querySelector('#finish').addEventListener('submit',event=>{
      event.preventDefault();
      if(state.reflection.trim().length<30){document.querySelector('#finish-message').textContent='Escribe al menos 30 caracteres, sin contar espacios exteriores.';return;}
      state.finished=state.finished||Date.now();save();document.querySelector('#download').disabled=false;document.querySelector('#finish-message').textContent='Guardia cerrada. Descarga el informe y súbelo a Moodle.';updateClock();
    });
    document.querySelector('#download').addEventListener('click',download);
    document.querySelector('#home').addEventListener('click',()=>{welcome();focusHeading();});
  }
  function date(at) { return esc(new Date(at).toLocaleString('es-ES',{timeZone:'Europe/Madrid'}))+' (Madrid)'; }
  function updateClock() {
    const clock=document.querySelector('#clock');
    if(!clock||!state)return;
    const seconds=Math.max(0,Math.floor(((state.finished||Date.now())-state.started)/1000));
    clock.textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')} transcurridos`;
    clock.title='Tiempo desde el inicio, incluidas pausas y pestaña cerrada. No penaliza ni bloquea.';
  }
  function download() {
    if(!state.finished)return;
    const content=`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hospital de código · Informe</title><style>body{font:16px/1.6 system-ui;max-width:960px;margin:30px auto;padding:20px;color:#17252d}pre{white-space:pre-wrap;background:#eee;padding:16px}article,section{border:1px solid #ccc;padding:18px;margin:18px 0;break-inside:avoid}table{border-collapse:collapse;width:100%}th,td{text-align:left;border-bottom:1px solid #ccc;padding:10px}.score{font-size:28px}h1,h2,h3{line-height:1.2}</style></head><body><h1>Hospital de código · Informe de repaso</h1>${reportContent()}<p>Duración transcurrida: ${Math.floor((state.finished-state.started)/60000)} minutos, incluidas pausas.</p><h2>Mi plan de repaso</h2><p style="white-space:pre-wrap">${esc(state.reflection)}</p><h2>Respuestas y correcciones</h2>${H.questions.map(q=>`<article><p>${esc(H.stages[q.stage].label)} · ${esc(q.topic)}</p><h3>${esc(q.title)}</h3><p>${esc(q.prompt)}</p>${q.code ? `<pre><code>${esc(q.code)}</code></pre>` : ''}${q.options ? `<ol type="A">${q.options.map(o=>`<li>${esc(o)}</li>`).join('')}</ol>` : ''}${feedback(q)}</article>`).join('')}<p>Actividad formativa. Corrección local, sin verificación docente. Este informe puede editarse. Para guardar en PDF, abre este archivo y usa Imprimir → Guardar como PDF.</p></body></html>`;
    const url=URL.createObjectURL(new Blob([content],{type:'text/html;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='hospital-codigo-informe.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    announce('Informe descargado. Recuerda subirlo a Moodle.');
  }
  setInterval(updateClock,1000);
  welcome();
})();
