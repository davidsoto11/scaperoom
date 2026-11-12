/* Retos basados exclusivamente en los cuatro apuntes incluidos en el repositorio. */
const ROOMS = [
  {
    id: "html",
    name: "El archivo perdido",
    language: "HTML",
    symbol: "</>",
    color: "#f5b38b",
    fragment: "ESTRUCTURA",
    description: "Reconstruye el esqueleto de la web.",
    source: "introduccionhtml (1).html",
  },
  {
    id: "css",
    name: "El laboratorio de estilo",
    language: "CSS",
    symbol: "{ }",
    color: "#bba8f1",
    fragment: "ESTILO",
    description: "Devuelve la forma y el color al sistema.",
    source: "2clase (1).html",
  },
  {
    id: "js",
    name: "El núcleo lógico",
    language: "JavaScript",
    symbol: "JS",
    color: "#c7fa74",
    fragment: "LÓGICA",
    description: "Reactiva el programa y abre la salida.",
    source: "clase-01-javascript (3).html",
    extraSource: "clase-02-javascript (1).html",
  },
];
const QUESTIONS = [
  {
    room: 0,
    title: "Una web sin esqueleto",
    story:
      "El sistema ha olvidado para qué sirve cada lenguaje. Recupera su estructura.",
    prompt: "¿Qué función cumple HTML en una página web?",
    options: [
      "Define el contenido y su estructura.",
      "Decide los colores y la distribución.",
      "Realiza cálculos y toma decisiones.",
    ],
    answer: "0",
    hint: "En la analogía del cuerpo humano, HTML es el esqueleto.",
    explanation:
      "HTML es un lenguaje de marcado: estructura títulos, párrafos, imágenes y enlaces. CSS aporta estilo y JavaScript, comportamiento.",
  },
  {
    room: 0,
    title: "Dos compartimentos",
    story:
      "Los metadatos y el contenido visible han acabado mezclados. Hay que separarlos.",
    prompt:
      "¿Qué pareja sitúa correctamente el título de la pestaña y el contenido visible?",
    options: [
      "<body> → título de pestaña · <head> → contenido",
      "<head> → título de pestaña · <body> → contenido",
      "<footer> → título de pestaña · <title> → contenido",
    ],
    answer: "1",
    hint: "El título de la pestaña es un metadato, no un encabezado visible.",
    explanation:
      "<title> se coloca dentro de <head>. El contenido visible de la página se escribe dentro de <body>.",
  },
  {
    room: 0,
    title: "Un destino para el enlace",
    story:
      "La puerta de salida es un enlace, pero le falta el atributo que indica su destino.",
    prompt: "Escribe SOLO el nombre del atributo que falta.",
    code: '<a ____="salida.html">Salir de la sala</a>',
    answer: "href",
    hint: "Es el atributo de los enlaces; src se utiliza para la ruta de una imagen.",
    explanation:
      "href indica el destino de un enlace <a>. En este caso apunta al archivo salida.html.",
    placeholder: "Nombre del atributo",
  },
  {
    room: 0,
    title: "Una imagen para todos",
    story:
      "Una cámara ha capturado una pista. La pista también debe poder entenderse sin ver la imagen.",
    prompt:
      "¿Qué atributo proporciona una descripción alternativa de una imagen?",
    options: ["href", "alt", "class"],
    answer: "1",
    hint: "Su nombre es una abreviatura de “alternativo”.",
    explanation:
      "alt proporciona un texto alternativo para lectores de pantalla y cuando la imagen no se puede cargar.",
    code: '<img src="llave.png" ____="Llave verde de la sala">',
  },
  {
    room: 0,
    title: "El orden de las pistas",
    story:
      "Tres pasos deben ejecutarse en un orden concreto. El registro necesita una lista numerada.",
    prompt: "¿Qué código representa una lista ordenada?",
    options: [
      "<ul><li>Primera pista</li></ul>",
      "<p><li>Primera pista</li></p>",
      "<ol><li>Primera pista</li></ol>",
    ],
    answer: "2",
    hint: "La “o” del nombre de la etiqueta viene de ordered.",
    explanation:
      "<ol> crea una lista ordenada; cada elemento se escribe con <li>. <ul> crea una lista sin numerar.",
  },
  {
    room: 0,
    title: "El corazón de la página",
    story:
      "Último bloqueo del archivo: el navegador necesita reconocer el contenido principal.",
    prompt:
      "Escribe el nombre de la etiqueta semántica del contenido principal, sin < >.",
    answer: "main",
    hint: "No es header, nav ni footer. Su nombre significa “principal” en inglés.",
    explanation:
      "<main> identifica el contenido principal. Normalmente hay uno por documento. ¡Primer fragmento recuperado!",
    placeholder: "Nombre de la etiqueta",
  },
  {
    room: 1,
    title: "Conecta el laboratorio",
    story:
      "El HTML existe, pero la sala ha perdido todos sus estilos. Reconecta el archivo correcto.",
    prompt: "¿Qué línea conecta styles.css desde <head>?",
    options: [
      '<script src="styles.css"></script>',
      '<link rel="stylesheet" href="styles.css">',
      '<a href="styles.css">Estilos</a>',
    ],
    answer: "1",
    hint: 'Una hoja de estilos se conecta con link y rel="stylesheet".',
    explanation:
      '<link rel="stylesheet" href="styles.css"> carga la hoja de estilos. La ruta y el nombre deben coincidir con el archivo.',
  },
  {
    room: 1,
    title: "El selector secreto",
    story:
      "Solo las tarjetas con la clase aviso deben iluminarse. El selector ha desaparecido.",
    prompt:
      "Escribe el selector para la clase aviso, incluido su símbolo inicial.",
    code: "____ {\n  color: gold;\n}",
    answer: ".aviso",
    hint: "Las clases empiezan con un punto; los identificadores, con #.",
    explanation:
      '.aviso selecciona los elementos con class="aviso". #aviso seleccionaría un identificador.',
    placeholder: "Selector CSS",
  },
  {
    room: 1,
    title: "Espacio para respirar",
    story:
      "El mensaje está pegado al borde del panel. Necesitamos espacio por dentro de la caja.",
    prompt: "¿Qué propiedad añade espacio entre el contenido y el borde?",
    options: ["margin", "border-radius", "padding"],
    answer: "2",
    hint: "margin separa la caja de otras cajas, por fuera.",
    explanation:
      "padding es el espacio interior. margin es exterior y border-radius redondea las esquinas.",
  },
  {
    room: 1,
    title: "Duelo de colores",
    story:
      "Dos reglas compiten por el mismo título. Averigua cuál gana en la cascada.",
    prompt: "¿De qué color se verá el título?",
    code: '.titulo { color: gold; }\n#principal { color: tomato; }\n\n<h1 id="principal" class="titulo">Salida</h1>',
    options: [
      "Dorado (gold)",
      "Rojo anaranjado (tomato)",
      "Blanco, porque las reglas se anulan",
    ],
    answer: "1",
    hint: "Un selector de identificador tiene más especificidad que uno de clase.",
    explanation:
      "#principal tiene más especificidad que .titulo, por eso se aplica tomato. En estas reglas no hay !important ni estilos en línea.",
  },
  {
    room: 1,
    title: "Alinea los controles",
    story:
      "Los controles de la puerta están desordenados. Reactiva la fila flexible.",
    prompt: "Escribe el valor de display que activa Flexbox.",
    code: ".controles {\n  display: ____;\n  justify-content: space-between;\n  align-items: center;\n  gap: 1rem;\n}",
    answer: "flex",
    hint: "Es la primera parte del nombre Flexbox, en minúsculas.",
    explanation:
      "display: flex activa Flexbox en el contenedor. justify-content reparte los elementos en el eje principal y gap añade separación.",
    placeholder: "Valor de display",
  },
  {
    room: 1,
    title: "La sala también es móvil",
    story:
      "La salida debe funcionar en una pantalla pequeña. El último cambio afecta al diseño responsive.",
    prompt: "¿Cuándo se aplica esta regla?",
    code: "@media (max-width: 600px) {\n  .menu { flex-direction: column; }\n}",
    options: [
      "Cuando la ventana mide 600 px de ancho o menos.",
      "Solo cuando mide exactamente 600 px.",
      "Cuando la ventana mide más de 600 px.",
    ],
    answer: "0",
    hint: "max-width indica un ancho máximo, incluido el límite.",
    explanation:
      "La media query se activa con anchos de hasta 600 px, incluidos. Cambia la dirección del menú a columna. ¡Segundo fragmento recuperado!",
  },
  {
    room: 2,
    title: "Enciende la consola",
    story:
      "El núcleo necesita cargar app.js y enviar un mensaje de diagnóstico.",
    prompt:
      "¿Qué pareja conecta el archivo y muestra un mensaje en la consola?",
    options: [
      '<link href="app.js"> y print("Hola")',
      '<script src="app.js"></script> y console.log("Hola");',
      '<a href="app.js"> y console.write("Hola");',
    ],
    answer: "1",
    hint: "El archivo JavaScript se conecta con script. Los apuntes muestran los mensajes con console.log().",
    explanation:
      "script con src carga app.js. console.log() escribe en la consola del navegador, no en el contenido de la página.",
  },
  {
    room: 2,
    title: "Un marcador que cambia",
    story:
      "La energía empieza en 0 y debe subir a 10. El programa se detiene al intentar reasignarla.",
    prompt: "Sustituye const por la palabra que permite reasignar puntos.",
    code: "const puntos = 0;\npuntos = 10;\nconsole.log(puntos);",
    answer: "let",
    hint: "Tiene tres letras. Se usa cuando el valor de una variable va a cambiar.",
    explanation:
      "let permite reasignar la variable. Una variable declarada con const no puede recibir un nuevo valor.",
    placeholder: "Palabra reservada",
  },
  {
    room: 2,
    title: "Números disfrazados",
    story:
      "Los precios llegaron como texto. El código convierte ambos datos antes de calcular.",
    prompt: "¿Qué número aparece en la consola?",
    code: 'const precioUno = "12";\nconst precioDos = "8";\nconsole.log(Number(precioUno) + Number(precioDos));',
    answer: "20",
    hint: "Number() convierte cada texto numérico. Sin esa conversión se concatenarían.",
    explanation:
      'Number("12") + Number("8") da 20. Si se sumaran los textos directamente, el resultado sería "128".',
    placeholder: "Resultado numérico",
  },
  {
    room: 2,
    title: "La prueba del límite",
    story:
      "La cerradura compara la edad. Mucho cuidado con el valor exacto de la frontera.",
    prompt: "¿Qué precio muestra este programa?",
    code: "const edad = 18;\nlet precioEntrada = 10;\nif (edad < 18) {\n  precioEntrada = 6;\n}\nconsole.log(precioEntrada);",
    options: ["6", "10", "18"],
    answer: "1",
    hint: "18 < 18 es falso. El operador < no incluye el límite.",
    explanation:
      "La condición es falsa, así que se conserva el precio inicial de 10. Solo las personas menores de 18 pagan 6.",
  },
  {
    room: 2,
    title: "Dos requisitos, una puerta",
    story:
      "Para cruzar hacen falta al menos 12 años Y una altura mínima de 140 cm.",
    prompt: "¿Qué operador debe sustituir a ____ para exigir ambos requisitos?",
    code: 'if (edad >= 12 ____ altura >= 140) {\n  console.log("Puedes subir");\n}',
    options: ["||", "===", "&&"],
    answer: "2",
    hint: "El operador OR (||) permite que se cumpla solo una condición. Aquí deben cumplirse las dos.",
    explanation:
      "&& exige que ambas comparaciones sean verdaderas. || exige al menos una y === compara igualdad estricta.",
  },
  {
    room: 2,
    title: "La última decisión",
    story:
      "La salida está a un paso. El precio depende de varias franjas de edad.",
    prompt: "¿Qué precio se muestra para una persona de 16 años?",
    code: "const edad = 16;\nlet precio = 0;\nif (edad < 6) {\n  precio = 0;\n} else if (edad < 16) {\n  precio = 5;\n} else {\n  precio = 8;\n}\nconsole.log(precio);",
    answer: "8",
    hint: "16 no es menor que 6 ni menor que 16. Continúa hasta la última rama.",
    explanation:
      "Ambas condiciones son falsas, así que se ejecuta else y el precio es 8. ¡Tercer fragmento recuperado: el sistema vuelve a estar en línea!",
    placeholder: "Resultado numérico",
  },
];
if (typeof module !== "undefined") module.exports = { ROOMS, QUESTIONS };
