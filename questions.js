/* Contenido basado en los cuatro apuntes originales; v1 conserva sus preguntas. */
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
const LEGACY_QUESTIONS = [
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
const PRACTICAL_QUESTIONS = [
  {
    room: 0,
    kind: "order",
    title: "Reconstruye el documento",
    story:
      "El archivo maestro se ha fragmentado en seis bloques. Reordénalos con las flechas del panel.",
    prompt:
      "Coloca los bloques para obtener un documento HTML5 con el título en head y el contenido en body.",
    items: [
      "<!DOCTYPE html>",
      '<html lang="es">',
      "<head><title>Agente web</title></head>",
      "<body>",
      "<main><h1>Acceso recuperado</h1></main>",
      "</body></html>",
    ],
    initial: [3, 0, 5, 2, 1, 4],
    answer: "[0,1,2,3,4,5]",
    hint: "Empieza con DOCTYPE y html; head va antes de body. Cierra el documento al final.",
    explanation:
      "DOCTYPE declara HTML5. html envuelve head y body; el contenido principal queda dentro de body.",
  },
  {
    room: 0,
    kind: "blanks",
    title: "Repara el panel de navegación",
    story:
      "El menú de la sala tiene tres conexiones rotas. Completa cada hueco y observa el código reparado.",
    prompt:
      "Rellena los atributos de un enlace, una imagen y un identificador.",
    template:
      '<a {{0}}="#salida">Ir a la salida</a>\n<img {{1}}="llave.png" alt="Llave verde">\n<section {{2}}="salida">Puerta</section>',
    fields: [
      "Destino del enlace",
      "Ruta de la imagen",
      "Identificador de la sección",
    ],
    answer: '["href","src","id"]',
    hint: "href es el destino de un enlace, src es la ruta de un recurso e id identifica un elemento.",
    explanation:
      'El enlace apunta a #salida, la imagen usa src y la sección se identifica con id="salida".',
  },
  {
    room: 0,
    kind: "order",
    title: "El recorrido semántico",
    story:
      "Un lector de pantalla necesita encontrar las zonas del puesto de control en un orden lógico.",
    prompt:
      "Ordena los bloques: cabecera, navegación, contenido principal y pie.",
    items: [
      "<header>Estación de rescate</header>",
      "<nav>Enlaces de la estación</nav>",
      "<main>Objetivo de la misión</main>",
      "<footer>Autoría del agente</footer>",
    ],
    initial: [2, 3, 0, 1],
    answer: "[0,1,2,3]",
    hint: "La cabecera presenta, nav permite moverse, main contiene la misión y footer cierra la página.",
    explanation:
      "Las etiquetas semánticas expresan el significado de cada zona. El orden propuesto sigue la lectura de arriba abajo.",
  },
  {
    room: 0,
    kind: "blanks",
    title: "Un mensaje legible en cualquier pantalla",
    story:
      "El mensaje de emergencia muestra caracteres extraños y no se adapta al móvil.",
    prompt:
      "Completa los valores de los metadatos. Escribe los dos nombres pedidos.",
    template:
      '<meta charset="{{0}}">\n<meta name="{{1}}" content="width=device-width, initial-scale=1.0">',
    fields: [
      "Codificación para acentos y eñes",
      "Nombre del metadato para el ancho del dispositivo",
    ],
    answer: '["UTF-8","viewport"]',
    hint: "La codificación es UTF-8. El otro metadato se llama viewport.",
    explanation:
      "UTF-8 permite representar acentos y eñes. viewport ayuda a que el ancho inicial de la página se adapte al dispositivo.",
  },
  {
    room: 0,
    kind: "blanks",
    title: "La ficha del agente",
    story:
      "Diseña el esqueleto de la tarjeta que usarás en la misión final. El navegador espera etiquetas coherentes.",
    prompt: "Escribe los nombres de las etiquetas sin los signos < >.",
    template:
      "<main>\n  <{{0}}>Agente web</{{0}}>\n  <{{1}}>Estoy aprendiendo a programar.</{{1}}>\n  <ul><{{2}}>Resolver problemas</{{2}}></ul>\n</main>",
    fields: [
      "Encabezado principal",
      "Párrafo de presentación",
      "Elemento de una lista",
    ],
    answer: '["h1","p","li"]',
    hint: "El encabezado principal es h1, un párrafo usa p y cada elemento de lista usa li.",
    explanation:
      "h1 presenta el título principal; p contiene el párrafo y li se coloca dentro de ul u ol.",
  },
  {
    room: 0,
    kind: "blanks",
    title: "El puente entre archivos",
    story:
      "La sala está reconstruida. Falta conectar el diseño y el comportamiento antes de salir.",
    prompt:
      "Completa la relación de la hoja de estilos, el atributo de ruta del script y su nombre de archivo.",
    template:
      '<link rel="{{0}}" href="styles.css">\n<script {{1}}="{{2}}"></script>',
    fields: [
      "Relación de la hoja CSS",
      "Atributo de ruta del script",
      "Archivo JavaScript llamado app.js",
    ],
    answer: '["stylesheet","src","app.js"]',
    hint: 'El enlace usa rel="stylesheet" y el script se carga mediante src="app.js".',
    explanation:
      "link carga la hoja de estilos y script carga JavaScript. Ambos nombres de archivo deben coincidir con los del proyecto.",
  },
  {
    room: 1,
    kind: "style",
    title: "Devuelve el color al sistema",
    story:
      "El panel de identificación ha perdido el tema de seguridad. Usa los mandos y observa la tarjeta.",
    prompt: "Consigue fondo negro, texto blanco y esquinas de 20 px.",
    controls: [
      {
        label: "Fondo",
        property: "background-color",
        values: ["tomato", "black", "gold"],
      },
      {
        label: "Texto",
        property: "color",
        values: ["black", "gold", "white"],
      },
      {
        label: "Esquinas",
        property: "border-radius",
        values: ["0px", "8px", "20px"],
      },
    ],
    answer: '["black","white","20px"]',
    hint: "background-color controla el fondo, color el texto y border-radius las esquinas.",
    explanation:
      "El tema utiliza background-color: black; color: white; border-radius: 20px. Cada propiedad cambia una parte distinta.",
  },
  {
    room: 1,
    kind: "order",
    title: "Dentro y fuera de la caja",
    story:
      "El escáner necesita atravesar las capas de una caja CSS desde el centro hacia fuera.",
    prompt: "Ordena las capas desde el contenido hasta el espacio exterior.",
    items: ["content", "padding", "border", "margin"],
    initial: [3, 1, 0, 2],
    answer: "[0,1,2,3]",
    hint: "El contenido está en el centro; lo siguen el espacio interior, el borde y el espacio exterior.",
    explanation:
      "El orden es content → padding → border → margin. padding queda dentro del borde y margin, fuera.",
  },
  {
    room: 1,
    kind: "style",
    title: "Una fila de controles",
    story:
      "El laboratorio tiene tres botones apilados y sin separación. Reconstruye la barra de mandos.",
    prompt:
      "Activa Flexbox, reparte el espacio con space-between y añade 16 px entre controles.",
    controls: [
      {
        label: "Distribución",
        property: "display",
        values: ["block", "flex", "inline-block"],
      },
      {
        label: "Reparto horizontal",
        property: "justify-content",
        values: ["flex-start", "center", "space-between"],
      },
      {
        label: "Separación",
        property: "gap",
        values: ["0px", "8px", "16px"],
      },
    ],
    answer: '["flex","space-between","16px"]',
    hint: "display activa Flexbox; justify-content distribuye el espacio del eje principal y gap separa los elementos.",
    explanation:
      "display: flex crea la fila. space-between reparte el espacio libre entre elementos y gap establece la separación mínima.",
  },
  {
    room: 1,
    kind: "blanks",
    title: "La clase que responde",
    story:
      "Un botón debe cambiar de aspecto cuando pase el ratón. Repara las propiedades y la pseudo-clase.",
    prompt:
      "Completa el selector de estado, la propiedad de fondo y la propiedad que suaviza el cambio.",
    template: ".boton { {{0}}: 0.3s; }\n.boton:{{1}} {\n  {{2}}: tomato;\n}",
    fields: [
      "Propiedad para una transición suave",
      "Pseudo-clase al pasar el cursor",
      "Propiedad de color de fondo",
    ],
    answer: '["transition","hover","background-color"]',
    hint: "La regla inicial usa transition. El estado es :hover y el fondo se modifica con background-color.",
    explanation:
      "transition suaviza el cambio. .boton:hover selecciona el botón al pasar el cursor y background-color modifica su fondo.",
  },
  {
    room: 1,
    kind: "style",
    title: "Prepara la pantalla estrecha",
    story:
      "En el móvil, los controles deben colocarse en columna y alinearse al centro.",
    prompt:
      "Con Flexbox ya activado, elige columna, alineación central y 24 px de espacio interior.",
    controls: [
      {
        label: "Dirección",
        property: "flex-direction",
        values: ["row", "row-reverse", "column"],
      },
      {
        label: "Alineación transversal",
        property: "align-items",
        values: ["stretch", "flex-start", "center"],
      },
      {
        label: "Espacio interior",
        property: "padding",
        values: ["0px", "8px", "24px"],
      },
    ],
    answer: '["column","center","24px"]',
    hint: "flex-direction decide fila o columna. align-items controla el eje transversal y padding el espacio interior.",
    explanation:
      "column apila los controles, align-items: center los centra horizontalmente en esa columna y padding separa el contenido del borde.",
  },
  {
    room: 1,
    kind: "blanks",
    title: "El plano responsive",
    story:
      "La última regla del laboratorio debe cambiar el menú solo en pantallas de hasta 600 px.",
    prompt: "Completa la consulta de medios y la dirección del menú.",
    template: "@{{0}} ({{1}}: 600px) {\n  .menu { flex-direction: {{2}}; }\n}",
    fields: [
      "Nombre de la regla @",
      "Condición de ancho máximo",
      "Dirección vertical",
    ],
    answer: '["media","max-width","column"]',
    hint: "La regla empieza con @media, comprueba max-width y cambia la dirección a column.",
    explanation:
      "@media (max-width: 600px) aplica el bloque hasta 600 px incluidos. flex-direction: column coloca el menú en vertical.",
  },
  {
    room: 2,
    kind: "trace",
    title: "Rastrea el marcador",
    story:
      "La consola ha perdido sus registros. Ejecuta mentalmente cada actualización del marcador.",
    prompt: "Escribe las cuatro salidas de consola en su orden.",
    code: "let puntos = 0;\nconsole.log(puntos);\npuntos = puntos + 10;\nconsole.log(puntos);\npuntos = puntos + 5;\nconsole.log(puntos);\npuntos = puntos - 3;\nconsole.log(puntos);",
    fields: ["Salida 1", "Salida 2", "Salida 3", "Salida 4"],
    answer: '["0","10","15","12"]',
    hint: "Cada asignación utiliza el valor que puntos tenía justo antes: 0, luego +10, después +5 y finalmente −3.",
    explanation:
      "La consola muestra 0, 10, 15 y 12. La variable se declara una vez con let y después se actualiza.",
  },
  {
    room: 2,
    kind: "trace",
    title: "Texto o número: el detector",
    story:
      "Cuatro señales se parecen, pero sus tipos y operaciones son diferentes.",
    prompt: "Reconstruye las cuatro salidas. Escribe los textos sin comillas.",
    code: 'console.log(typeof "23.5");\nconsole.log(typeof false);\nconsole.log("12" + "8");\nconsole.log(Number("12") + Number("8"));',
    fields: [
      'Tipo de "23.5"',
      "Tipo de false",
      "Suma de los textos",
      "Suma tras convertir",
    ],
    answer: '["string","boolean","128","20"]',
    hint: "Las comillas hacen que 23.5 sea texto. false es lógico. + concatena textos y suma números.",
    explanation:
      "Las salidas son string, boolean, 128 y 20. El aspecto de un dato no determina su tipo: las comillas sí cambian cómo se interpreta.",
  },
  {
    room: 2,
    kind: "trace",
    title: "Calibra el cálculo",
    story:
      "El núcleo calcula un área, un perímetro y dos expresiones. El orden de operaciones importa.",
    prompt: "Calcula los cuatro resultados del programa.",
    code: "const base = 8;\nconst altura = 5;\nconsole.log(base * altura);\nconsole.log(2 * (base + altura));\nconsole.log(2 + 3 * 4);\nconsole.log((2 + 3) * 4);",
    fields: ["Área", "Perímetro", "Sin paréntesis", "Con paréntesis"],
    answer: '["40","26","14","20"]',
    hint: "La multiplicación se calcula antes de la suma, salvo que los paréntesis indiquen otro orden.",
    explanation:
      "El área es 40 y el perímetro 26. 2 + 3 × 4 vale 14; (2 + 3) × 4 vale 20.",
  },
  {
    room: 2,
    kind: "trace",
    title: "Compra bajo vigilancia",
    story:
      "El sistema ofrece envío gratuito desde 20 €. Comprueba la lógica en tres compras distintas.",
    prompt:
      "Escribe el total final cuando cantidad vale 1, 3 y 4, respectivamente.",
    code: "const precio = 5;\nconst subtotal = precio * cantidad;\nlet envio = 3;\nif (subtotal >= 20) {\n  envio = 0;\n}\nconsole.log(subtotal + envio);",
    fields: ["cantidad = 1", "cantidad = 3", "cantidad = 4"],
    answer: '["8","18","20"]',
    hint: "Con 1 y 3 unidades no se llega a 20 €, así que se añaden 3 €. Con 4 unidades se alcanza el límite.",
    explanation:
      "Los totales son 8, 18 y 20. Es importante probar un subtotal igual al límite, porque >= lo incluye.",
  },
  {
    room: 2,
    kind: "trace",
    title: "Puertas AND, OR e igualdad",
    story:
      "La seguridad utiliza tres tipos de comparación. Simula cada salida sin confundir sus operadores.",
    prompt: "Escribe true o false para cada línea.",
    code: 'console.log(12 >= 12 && 139 >= 140);\nconsole.log(12 >= 30 || true);\nconsole.log(5 === "5");\nconsole.log(5 !== 3);',
    fields: [
      "AND (&&)",
      "OR (||)",
      "Igualdad estricta",
      "Desigualdad estricta",
    ],
    answer: '["false","true","false","true"]',
    hint: "&& exige ambos requisitos; || exige al menos uno; === compara valor y tipo.",
    explanation:
      'La primera es falsa porque 139 no llega a 140. OR es verdadera por true. 5 y "5" tienen distinto tipo, y 5 es distinto de 3.',
  },
  {
    room: 2,
    kind: "trace",
    title: "Auditoría de las edades límite",
    story:
      "Última batería del núcleo: verifica todas las fronteras antes de devolver el servicio.",
    prompt: "Introduce el precio que corresponde a cada edad de prueba.",
    code: "let precio = 0;\nif (edad < 6) {\n  precio = 0;\n} else if (edad < 16) {\n  precio = 5;\n} else {\n  precio = 8;\n}\nconsole.log(precio);",
    fields: ["edad = 5", "edad = 6", "edad = 15", "edad = 16"],
    answer: '["0","5","5","8"]',
    hint: "Menores de 6: 0 €. De 6 a 15: 5 €. Desde 16: 8 €.",
    explanation:
      "Las fronteras dan 0, 5, 5 y 8. Una cadena if / else if / else ejecuta solo la primera rama cuya condición se cumple.",
  },
];
const EXPANDED_QUESTIONS = ROOMS.flatMap((_, room) => {
  const base = LEGACY_QUESTIONS.filter((q) => q.room === room);
  const practical = PRACTICAL_QUESTIONS.filter((q) => q.room === room);
  return base.flatMap((q, i) => [
    {
      ...q,
      explanation: q.explanation.replace(
        / ¡(?:Primer|Segundo|Tercer) fragmento recuperado.*$/,
        "",
      ),
    },
    practical[i],
  ]);
});
let QUESTIONS = EXPANDED_QUESTIONS;
if (typeof module !== "undefined")
  module.exports = { ROOMS, QUESTIONS, LEGACY_QUESTIONS, EXPANDED_QUESTIONS };
