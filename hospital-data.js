/* Datos independientes del escape room: sus intentos conservan su formato original. */
const Hospital = (() => {
  const sources = {
    HTML: 'introduccionhtml (1).html',
    CSS: '2clase (1).html',
    JS: 'clase-01-javascript (3).html',
    Decisiones: 'clase-02-javascript (1).html',
  };
  const stages = [
    { title: 'Triaje', minutes: 5, label: 'Diagnóstico inicial', intro: 'La web de entradas está averiada. Comprueba qué recuerdas antes de consultar los apuntes. Los errores sirven para orientar el repaso.' },
    { title: 'Estructura', minutes: 10, label: 'Consulta de HTML', intro: 'Primero recupera el contenido. Lee el fragmento, predice el problema y elige la reparación. Después explica en voz baja por qué funciona.' },
    { title: 'Estilo', minutes: 12, label: 'Consulta de CSS', intro: 'La web ya tiene contenido, pero el diseño falla. Distingue el selector, la propiedad y el valor. Antes de responder, dibuja mentalmente la caja.' },
    { title: 'Lógica', minutes: 18, label: 'Consulta de JavaScript', intro: 'Repara el precio y el acceso a las entradas. Sigue los valores línea a línea y prueba siempre un caso a cada lado del límite.' },
    { title: 'Alta médica', minutes: 10, label: 'Simulacro individual', intro: 'Ocho preguntas nuevas, sin pistas. Responde todas antes de entregar: la corrección aparece al final del bloque. Puedes revisar tus elecciones antes de entregarlo.' },
    { title: 'Plan de repaso', minutes: 5, label: 'Informe y entrega', intro: 'Revisa tus primeros intentos, anota qué debes practicar y descarga el informe para entregarlo en Moodle.' },
  ];
  const questions = [];
  function q(stage, topic, title, prompt, code, options, answer, explanation, hint) {
    questions.push({ id: questions.length, stage, topic, title, prompt, code, options, answer: String(answer), explanation, hint: hint || 'Busca la regla en los apuntes y comprueba un ejemplo antes de elegir.' });
  }
  q(0,'HTML','Cada cosa en su lugar','¿Dónde debe ir el título visible de la página?','<h1>Entradas al festival</h1>', ['Dentro de head','Dentro de body','Dentro de title'],1,'body contiene lo visible. title, en head, da nombre a la pestaña.');
  q(0,'HTML','El destino del enlace','¿Qué atributo indica a dónde lleva un enlace?','', ['src','href','alt'],1,'href indica el destino de a. src indica un recurso, y alt describe una imagen.');
  q(0,'CSS','Seleccionar una clase','¿Qué selector corresponde a este elemento?','<p class="aviso">Últimas entradas</p>', ['aviso','#aviso','.aviso'],2,'Una clase se selecciona con punto. Un id se selecciona con #.');
  q(0,'CSS','Respirar por dentro','¿Qué propiedad separa el texto del borde de su tarjeta?','', ['margin','color','padding'],2,'padding deja espacio interior; margin separa la caja de otras cajas.');
  q(0,'JS','Una suma sospechosa','¿Qué muestra la consola?','console.log("10" + "5");', ['15','105','Error'],1,'Con dos textos, + concatena: produce el texto "105".');
  q(0,'Decisiones','Justo en el límite','¿Qué muestra la consola?','const edad = 16;\nif (edad < 16) {\n  console.log("Reducida");\n} else {\n  console.log("General");\n}', ['Reducida','General','Los dos mensajes'],1,'16 < 16 es falso. El valor exacto del límite entra en else.');

  q(1,'HTML','Historia clínica','¿Qué reparación coloca los metadatos y el contenido en su sitio?','<head>\n  <h1>Festival</h1>\n</head>\n<body>\n  <title>Venta de entradas</title>\n</body>', ['Mover h1 a body y title a head','Moverlo todo a head','Cambiar h1 por title'],0,'title pertenece a head. h1 es el encabezado visible dentro de body.','Distingue el nombre de la pestaña del título que se ve dentro de la página.');
  q(1,'HTML','Enlace roto','¿Cómo lleva el enlace a la sección de precios?','<a href="#precio">Ver precios</a>\n<section id="precios">...</section>', ['Cambiar href por src','Usar href="#precios"','Usar class="precio" en section'],1,'El fragmento después de # debe coincidir exactamente con el id de destino.','Compara letra por letra el destino y el identificador.');
  q(1,'HTML','Imagen sin descripción','¿Qué atributo aporta una alternativa textual útil?','<img src="cartel.png">', ['title="imagen"','href="Cartel"','alt="Cartel del festival: sábado a las 18 h"'],2,'alt describe el contenido relevante de la imagen, también cuando no puede verse.','Piensa en quien no puede ver la imagen.');
  q(1,'HTML','Orden de tratamiento','¿Qué estructura representa una lista de pasos numerados?','', ['<ol><li>Elegir entrada</li><li>Pagar</li></ol>','<p><li>Elegir entrada</li></p>','<ul><p>Elegir entrada</p></ul>'],0,'ol representa una lista ordenada y cada elemento se escribe con li. ul se usa cuando el orden no importa.','La elección depende de si el orden de los elementos importa.');
  q(1,'HTML','Una reparación pequeña','Completa SOLO el nombre de la etiqueta para el contenido principal. Escribe una palabra sin < ni >.','<____>\n  <h1>Festival</h1>\n  <p>Compra tus entradas.</p>\n</____>',null,'main','main identifica el contenido principal. header, nav y footer tienen otras funciones.','Es la etiqueta semántica del contenido principal.');
  q(1,'HTML','Conectar el tratamiento','Los archivos están en la misma carpeta. ¿Qué carga correctamente el CSS?','Archivo disponible: estilos.css', ['<script src="estilos.css"></script>','<link rel="stylesheet" href="styles.css">','<link rel="stylesheet" href="estilos.css">'],2,'La hoja externa se conecta con link en head; href debe coincidir con el nombre real del archivo.','Comprueba el tipo de etiqueta y la ruta.');

  q(2,'CSS','Diagnóstico del selector','¿Qué selector colorea todos los elementos con class="entrada"?','entrada { color: purple; }', ['.entrada','#entrada','<entrada>'],0,'El selector de clase es .entrada. Sin punto se buscaría una etiqueta llamada entrada.','Revisa el símbolo que precede al nombre de una clase.');
  q(2,'CSS','Dos espacios distintos','¿Qué regla crea 16 px dentro de la tarjeta y 24 px fuera?','', ['margin: 16px; padding: 24px;','padding: 16px; margin: 24px;','gap: 16px; border: 24px;'],1,'padding separa el contenido del borde y margin crea espacio exterior.','Dibuja contenido → padding → borde → margin.');
  q(2,'CSS','La regla que gana','¿De qué color se ve el párrafo? No hay otras reglas.','<p class="aviso">Quedan 5 entradas</p>\n\np { color: blue; }\n.aviso { color: red; }\np { color: green; }', ['Verde: es la última regla','Azul: es la primera regla','Rojo: la clase tiene más especificidad'],2,'La clase tiene más especificidad que la etiqueta. El orden decide entre reglas de igual prioridad.','Antes de mirar el orden, compara la especificidad de los selectores.');
  q(2,'CSS','Poner las entradas en fila','Completa SOLO el valor que activa Flexbox.',' .entradas {\n  display: ____;\n  gap: 16px;\n}',null,'flex','display: flex activa Flexbox. gap separa los elementos; justify-content distribuye en el eje principal y align-items alinea en el transversal.','Es el valor de display que activa Flexbox.');
  q(2,'CSS','Guardia de móvil','Con una ventana de 500 px, ¿cómo se colocan los elementos?',' .entradas { display: flex; }\n@media (max-width: 600px) {\n  .entradas { flex-direction: column; }\n}', ['En columna','En fila siempre','La regla solo se aplica a más de 600 px'],0,'500 es menor o igual que 600, por lo que se aplica la media query y la dirección pasa a columna.','max-width incluye anchos iguales o inferiores al límite.');
  q(2,'CSS','Acabado de la tarjeta','¿Qué pareja redondea las esquinas y cambia el fondo al pasar el ratón?','', ['margin y .boton:click','border-radius y .boton:hover','font-size y #hover'],1,'border-radius redondea las esquinas; :hover aplica estilos al pasar el cursor. transition permite suavizar el cambio.','Busca una propiedad de esquinas y una pseudo-clase.');

  q(3,'JS','Preparar el quirófano','¿Cómo ejecutas app.js desde el HTML, con ambos archivos en la misma carpeta?','', ['<link href="app.js">','<script href="app.js"></script>','<script src="app.js"></script>'],2,'script usa src. Guarda los archivos, recarga la página y revisa la consola para ver los resultados.','La etiqueta carga un script y el atributo indica su origen.');
  q(3,'JS','Un precio que cambia','¿Qué cambio permite reasignar el precio?','const precio = 10;\nprecio = 6;\nconsole.log(precio);', ['Cambiar const por let','Poner comillas en 6','Declarar otra const precio'],0,'let permite reasignar una variable. const no permite reasignación y aquí provoca un error.','El dato cambia durante la ejecución.');
  q(3,'JS','Del texto al número','Completa SOLO el nombre de la función, respetando su mayúscula inicial.','const precio = "12";\nconst extra = "3";\nconsole.log(____(precio) + Number(extra));',null,'Number','Number convierte el texto numérico en número: 12 + 3 = 15. Sin conversión, los textos se concatenan.','La misma función ya aparece en la segunda conversión.');
  q(3,'JS','Seguir las constantes','¿Qué muestra la consola?','const precio = 8;\nconst cantidad = 3;\nconst subtotal = precio * cantidad;\nlet total = subtotal;\ntotal = total + 2;\nconsole.log(total);', ['24','26','832'],1,'8 × 3 = 24 y después se suman 2: total vale 26.','Anota el valor de subtotal antes de actualizar total.');
  q(3,'Decisiones','El orden de los tramos','Se quiere que desde 9 aparezca Excelente y desde 5 Aprobado. ¿Cómo se repara?','const nota = 9;\nif (nota >= 5) {\n  console.log("Aprobado");\n} else if (nota >= 9) {\n  console.log("Excelente");\n}', ['Cambiar else if por else','Añadir ; después del if','Comprobar primero nota >= 9 y después nota >= 5'],2,'En una cadena se ejecuta el primer bloque verdadero. El tramo más alto debe comprobarse antes para que no lo capture >= 5.','¿Qué condición verdadera se encuentra primero para una nota de 9?');
  q(3,'Decisiones','Dos requisitos de acceso','Para entrar hacen falta al menos 12 años Y 140 cm de altura. ¿Qué condición sirve?','', ['edad >= 12 && altura >= 140','edad >= 12 || altura >= 140','edad > 12 && altura > 140'],0,'&& exige los dos requisitos. >= incluye los valores exactos 12 y 140.','La regla exige ambos requisitos e incluye los límites.');
  q(3,'Decisiones','Una alternativa basta','El envío es gratis desde 30 € O si se es socio. ¿Qué condición sirve?','', ['importe >= 30 && esSocio === true','importe >= 30 || esSocio === true','importe > 30 || esSocio === "true"'],1,'|| acepta cualquiera de los dos requisitos, también cuando ambos se cumplen. true sin comillas es un booleano.','Una compra de 12 € de una persona socia también debe pasar.');
  q(3,'Decisiones','Prueba de fronteras','¿Qué precios salen para las edades 5, 6, 15 y 16, en ese orden?','let precio = 0;\nif (edad < 6) {\n  precio = 0;\n} else if (edad < 16) {\n  precio = 5;\n} else {\n  precio = 8;\n}', ['0, 0, 5, 5','0, 5, 8, 8','0, 5, 5, 8'],2,'5 entra en el primer tramo; 6 y 15 en el segundo; 16 en else. Probar los límites descubre errores de < frente a <=.','Resuelve cada edad desde el primer if, sin saltar directamente al segundo.');

  q(3,'JS','Asignar o comparar','¿Qué expresión comprueba que puntos vale el número 8 y devuelve true o false?','const puntos = 8;', ['puntos = 8','puntos === 8','puntos === "8"'],1,'=== compara valor y tipo. = asigna; el número 8 y el texto "8" no son iguales con ===.','Distingue guardar un dato de comparar un dato.');

  q(4,'HTML','01 · Estructura semántica','¿Qué etiqueta corresponde al bloque principal de navegación?','', ['<nav>','<main>','<footer>'],0,'nav identifica la navegación; main, el contenido principal; footer, el pie.');
  q(4,'HTML','02 · Recursos y atributos','¿Qué imagen tiene una ruta y una alternativa textual correctamente indicadas?','', ['<img href="sala.png" title="Sala">','<img src="sala.png" alt="Plano de la sala con las salidas">','<image src="sala.png">'],1,'img carga con src y ofrece texto alternativo con alt.');
  q(4,'CSS','03 · Empate en la cascada','¿De qué color queda el texto? No hay otras reglas.',' .entrada { color: purple; }\n.entrada { color: orange; }', ['Morado','El navegador mezcla ambos','Naranja'],2,'Con la misma especificidad, gana la declaración posterior.');
  q(4,'CSS','04 · Unidades','¿Qué unidad depende del tamaño base de letra del documento?','', ['rem','px','vh'],0,'rem depende del tamaño de letra raíz; px es una unidad fija de CSS y vh depende de la altura de la ventana.');
  q(4,'JS','05 · Tipos','¿Qué muestra la consola?','const disponible = "false";\nconsole.log(typeof disponible);', ['boolean','string','false'],1,'Las comillas convierten "false" en texto: su tipo es string.');
  q(4,'JS','06 · Conversión y operaciones','¿Qué muestra la consola?','const unidades = "4";\nconst precio = 3;\nconsole.log(Number(unidades) * precio + 1);', ['13','121','43'],0,'Number("4") vale 4. Primero 4 × 3 = 12 y después + 1 = 13.');
  q(4,'Decisiones','07 · Dos requisitos','¿Qué muestra la consola?','const edad = 12;\nconst altura = 139;\nif (edad >= 12 && altura >= 140) {\n  console.log("Adelante");\n} else {\n  console.log("Espera");\n}', ['Adelante','Los dos mensajes','Espera'],2,'La edad cumple, la altura no. && requiere que ambas comparaciones sean verdaderas.');
  q(4,'Decisiones','08 · Prioridad de decisiones','¿Qué muestra la consola?','const llueve = true;\nconst temperatura = 22;\nif (llueve === true) {\n  console.log("Cancelada");\n} else if (temperatura >= 18 && temperatura <= 28) {\n  console.log("Exterior");\n} else {\n  console.log("Interior");\n}', ['Exterior','Cancelada','Interior'],1,'La primera condición se cumple. La cadena termina ahí, aunque la temperatura sea adecuada.');

  function correct(question, answer) {
    // Los nombres de JavaScript distinguen mayúsculas; solo se ignora el espacio exterior.
    return String(answer).trim() === question.answer;
  }
  function summary(results, stage) {
    const selected = questions.filter(q => stage === undefined || q.stage === stage);
    const answered = selected.filter(q => results[q.id]);
    const right = answered.filter(q => correct(q, results[q.id].answer)).length;
    return { total: selected.length, answered: answered.length, right, grade: selected.length ? right / selected.length * 10 : 0 };
  }
  function validAnswer(question, answer) {
    return typeof answer === 'string' && answer.trim().length > 0 && answer.length <= 120 && (!question.options || question.options.some((_, i) => String(i) === answer));
  }
  function validState(s) {
    return s && s.version === 1 && typeof s.name === 'string' && s.name.trim().length > 0 && s.name.length <= 100 && typeof s.group === 'string' && s.group.trim().length > 0 && s.group.length <= 60 && Number.isFinite(s.started) && s.started > 0 && s.started <= Date.now() && Number.isInteger(s.stage) && s.stage >= 0 && s.stage <= 5 && s.results && typeof s.results === 'object' && !Array.isArray(s.results) && Object.entries(s.results).every(([id,r]) => questions[id] && r && validAnswer(questions[id],r.answer) && typeof r.hint === 'boolean' && typeof r.repaired === 'boolean') && questions.filter(q => q.stage < s.stage).every(q => s.results[q.id]) && s.drafts && typeof s.drafts === 'object' && !Array.isArray(s.drafts) && Object.entries(s.drafts).every(([id,a]) => questions[id] && validAnswer(questions[id],a)) && Array.isArray(s.hints) && s.hints.every(id => Number.isInteger(id) && questions[id] && questions[id].stage < 4) && typeof s.reflection === 'string' && s.reflection.length <= 2000 && (s.finished === null || Number.isFinite(s.finished) && s.finished >= s.started && s.finished <= Date.now() && s.stage === 5 && s.reflection.trim().length >= 30) && (s.stage !== 4 || [0,8].includes(questions.filter(q => q.stage === 4 && s.results[q.id]).length));
  }
  return { sources, stages, questions, correct, summary, validAnswer, validState };
})();
if (typeof module !== 'undefined') module.exports = Hospital;
