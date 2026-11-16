# Hospital de código · Clase autónoma de 60 minutos

Abre `hospital.html` o utiliza el enlace de la portada del escape room. Al publicar estos archivos en el GitHub Pages existente, la ruta será `https://davidsoto11.github.io/scaperoom/hospital.html`. También funciona abriendo el archivo local, con los demás archivos del proyecto en la misma carpeta.

Preparación para el examen del jueves 19 de noviembre de 2026: repaso de los cuatro apuntes originales. Contiene **32 preguntas tipo test y tres reparaciones de una palabra**. No requiere programar una aplicación ni instalar herramientas. Las preguntas son nuevas y cubren HTML, CSS y ambas clases de JavaScript.

| Minutos | Bloque | Trabajo autónomo |
| --- | --- | --- |
| 0–5 | Triaje | 6 preguntas de diagnóstico. Intentar responder sin apuntes. |
| 5–15 | HTML | 6 ejercicios: head/body, enlaces internos, imágenes, listas, semántica y CSS externo. |
| 15–27 | CSS | 6 ejercicios: selectores, caja, especificidad, Flexbox, responsive, esquinas y hover. |
| 27–45 | JavaScript | 9 ejercicios: carga del script, let/const, Number, operaciones, comparación estricta, else if, &&, \|\| y fronteras. |
| 45–55 | Simulacro | 8 preguntas nuevas: dos de HTML, dos de CSS y cuatro de JavaScript. Corrección al entregar el bloque completo. |
| 55–60 | Plan de repaso | Revisar errores, escribir una reflexión de al menos 30 caracteres, cerrar y descargar el informe. |

Los tiempos son orientativos: no se bloquean pantallas para consumir minutos. El reloj muestra el tiempo desde el inicio, incluidas pausas y cierres de pestaña. Si terminan pronto, deben tapar una solución, explicar el error y predecir el resultado cambiando un dato. En JavaScript conviene comprobar un valor inferior al límite, el propio límite y otro superior.

## Instrucciones para el alumnado

1. Introduce tu nombre y grupo. Si el navegador conserva el intento de otro alumno, empieza uno nuevo.
2. Lee el código antes de elegir; en los tres huecos escribe solo una palabra. JavaScript distingue mayúsculas: `Number` lleva N mayúscula.
3. En el repaso, usa las dos pistas y los apuntes si los necesitas. Después de comprobar, lee la explicación. Puedes reparar un fallo; el primer resultado se conserva. Para continuar basta con haber respondido todo el bloque.
4. En el simulacro responde las ocho preguntas antes de entregar. Puedes cambiar tus elecciones hasta la entrega. Después aparecen las soluciones y las respuestas quedan cerradas.
5. Escribe qué has aprendido y qué practicarás. Cierra la guardia y descarga el HTML. Comprueba tu nombre, grupo y resultados; súbelo a Moodle. Si necesitas PDF, abre el HTML descargado y utiliza Imprimir → Guardar como PDF.

## Resultados y entrega

El diagnóstico se presenta como aciertos de seis, separado del resto. El tratamiento cuenta primeros aciertos de 21, señala pistas utilizadas y reparaciones posteriores. El simulacro vale **aciertos / 8 × 10**, sin restar por errores. Una reparación posterior nunca cambia la primera puntuación. Las recomendaciones por tema incluyen práctica y simulacro, sin diagnóstico; son orientación, no certificación de dominio.

El informe incluye nombre, grupo, fechas en Madrid, tiempo transcurrido, resultados, plan personal y los 35 ejercicios con opciones, código, primera respuesta, solución y explicación. Configura Moodle para aceptar `.html`, o PDF si lo guardan mediante impresión. No existe envío automático ni registro central.

El intento se guarda en `localStorage` bajo una clave propia y no altera el escape room. Si el navegador bloquea el guardado, aparece un aviso; deben mantener la pestaña abierta y descargar antes de salir. En equipos compartidos, descargar antes de sustituir un intento. Las soluciones y la nota se calculan en el navegador, y el informe se puede editar: es una actividad de repaso, no el examen oficial.

## Comprobación

`node --test tests/hospital.test.cjs` comprueba contenido, puntuación y recuperación. La prueba de navegador es `NODE_PATH=/ruta/a/node_modules node tests/hospital-browser.cjs`, con Playwright y Chrome disponibles y un servidor del proyecto en el puerto 4173. No son dependencias de la actividad.
