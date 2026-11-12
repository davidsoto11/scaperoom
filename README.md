# Código de fuga

Escape room educativo en español sobre HTML, CSS y JavaScript. Una misión con **3 salas y 18 retos**, basada en los cuatro apuntes HTML de esta carpeta. Funciona sin servidor, librerías ni servicios externos, también en móvil.

## Jugar

Abre `index.html` en un navegador o visita la URL de GitHub Pages del repositorio. Para probar con un servidor local:

```sh
python3 -m http.server 4173
```

Abre http://localhost:4173. No hace falta instalar paquetes.

El alumno escribe su nombre y grupo, responde a los retos en orden y obtiene tres fragmentos de una llave. Cada respuesta se valida una sola vez y muestra su explicación. Los errores no bloquean la siguiente sala. El tiempo es informativo y no penaliza. Se pueden consultar los apuntes desde cada sala.

## Nota

- Acierto sin pista: **1 punto**.
- Acierto con pista: **0,75 puntos**.
- Respuesta incorrecta: **0 puntos**, también si se consultó la pista.
- Cada sala tiene 6 retos y vale 6 puntos.
- **Nota sobre 10 = puntos obtenidos / 18 × 10**, mostrada con dos decimales.
- No se exige aprobar para completar la misión y descargar el informe.

Las respuestas escritas ignoran los espacios al principio y al final y las mayúsculas. Los símbolos que forman parte de la respuesta, como el punto de `.aviso`, sí importan.

## Entrega en Moodle

Al completar los 18 retos, el alumno pulsa **Descargar informe (.html)**. El archivo se puede abrir sin conexión e incluye:

- Nombre, grupo, referencia del intento y fechas en horario de Madrid.
- Tiempo total, nota sobre 10 y puntos totales.
- Puntuación y equivalente sobre 10 por sala.
- Los 18 enunciados, código cuando corresponde, respuestas del alumno, soluciones, explicaciones, pistas consultadas y puntos de cada reto.

Configura la tarea de Moodle para aceptar `.html` o PDF. El botón **Guardar como PDF** abre el informe en otra pestaña y el diálogo de impresión: el alumno elige «Guardar como PDF». Si el navegador bloquea la pestaña, puede abrir el HTML descargado y pulsar su botón de impresión. El informe HTML es el archivo descargable directo; el PDF se guarda mediante el navegador.

Los datos se guardan únicamente en `localStorage` de este sitio y navegador. No se envían a GitHub ni a un profesor. El alumno debe descargar y subir el informe a Moodle manualmente. El botón para empezar otro intento borra el intento guardado; conviene descargar antes el informe, sobre todo en equipos compartidos. Si el navegador bloquea el almacenamiento, se puede jugar y descargar, pero hay que mantener la pestaña abierta.

**Límite de evaluación:** esta es una actividad formativa en un sitio estático. Las soluciones y la corrección están en el navegador y el informe se puede editar. No hay autenticación ni validación de la nota en un servidor. La referencia del intento no es una firma ni permite verificarlo. Para un examen con calificación certificada, realiza la evaluación en Moodle o incorpora un servidor que registre y verifique las respuestas.

## Material utilizado

| Sala                           | Contenido                                                     | Fuente                                                          |
| ------------------------------ | ------------------------------------------------------------- | --------------------------------------------------------------- |
| HTML · El archivo perdido      | Estructura, head/body, enlaces, imágenes, listas y semántica  | `introduccionhtml (1).html`                                     |
| CSS · El laboratorio de estilo | Hoja externa, selectores, caja, cascada, Flexbox y responsive | `2clase (1).html`                                               |
| JavaScript · El núcleo lógico  | script y consola, let/const, Number, límites, && y else if    | `clase-01-javascript (3).html` y `clase-02-javascript (1).html` |

Los apuntes originales se conservan sin cambios. Para adaptar los retos, edita `questions.js`. Si cambias sus soluciones o su orden en una versión ya publicada, incrementa `Game.VERSION` y cambia `STORAGE_KEY` en `app.js` para evitar recuperar intentos incompatibles. Si cambias la cantidad de retos, adapta también los contadores y textos de la interfaz.

## Publicar en GitHub Pages

En **Settings → Pages**, selecciona **Deploy from a branch**, rama **main**, carpeta **/ (root)** y guarda. `index.html` es la entrada y `.nojekyll` evita procesamientos innecesarios. No hay compilación ni claves que configurar.

La URL de este proyecto será `https://davidsoto11.github.io/scaperoom/` una vez que GitHub termine el despliegue. Documentación: [crear un sitio en GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## Comprobaciones

Requiere Node.js solo para ejecutar las pruebas de la corrección y la validación del progreso:

```sh
node --test tests/game.test.cjs
```

Las pruebas de navegador están en `tests/browser.cjs`; requieren Playwright instalado fuera del proyecto y Chrome:

```sh
python3 -m http.server 4173
# En otra terminal, con playwright disponible en NODE_PATH:
node tests/browser.cjs
```

Los artefactos de la prueba se guardan en una carpeta temporal, no en el repositorio. El juego no depende de Playwright.
