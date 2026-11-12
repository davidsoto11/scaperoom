# Código de fuga · guía para una sesión de dos horas

La versión ampliada combina 36 retos (12 por sala), nueve objetos que se pueden inspeccionar y un proyecto final. Dieciocho retos son actividades prácticas: reconstrucción de bloques, reparación de código, laboratorio visual CSS y predicciones de varias salidas de consola. No hay una cuenta atrás ni esperas para consumir tiempo: los 120 minutos son una propuesta de clase, no una duración garantizada.

## Preparación

Comparte https://davidsoto11.github.io/scaperoom/ y prepara una tarea de Moodle que acepte HTML o PDF. No hacen falta cuentas ni instalar paquetes. Para las ampliaciones opcionales se puede usar el editor de código habitual. En equipos compartidos, cada alumno debe descargar su informe antes de borrar los datos y empezar otro intento.

## Distribución de los 120 minutos

| Minutos | Actividad                                                                                            | Evidencia y acompañamiento                                                                                                                                      |
| ------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0–10    | Presentar la misión, las reglas y la nota. Introducir nombre y grupo. Inspeccionar el primer sector. | Cada alumno localiza los apuntes y distingue pista con descuento de objeto de consulta gratuito.                                                                |
| 10–40   | Sala HTML: 12 retos.                                                                                 | Pedir que expliquen head/body, reconstruyan el documento y justifiquen la selección de etiquetas. Reservar los últimos 5 minutos para comentar un error.        |
| 40–70   | Sala CSS: 12 retos y laboratorios.                                                                   | Comparar visualmente padding y margin, probar valores alternativos antes de enviar la respuesta y explicar la cascada. Comentar cómo cambia una fila a columna. |
| 70–100  | Sala JavaScript: 12 retos y pruebas de consola.                                                      | En papel o en su editor, trazar los valores de las variables y probar condiciones en las fronteras. Justificar al menos una salida antes de validarla.          |
| 100–115 | Taller final: tarjeta del agente y bitácora.                                                         | Personalizar HTML y CSS, probar el ancho móvil y explicar una decisión de HTML, una de CSS y una condición JavaScript.                                          |
| 115–120 | Descarga, revisión y entrega.                                                                        | Comprobar nombre, grupo y nota en el informe. Subir el HTML o el PDF a Moodle. La tarjeta puede entregarse también como archivo adicional.                      |

Se puede trabajar por parejas para comentar ideas, pero cada alumno debe realizar su propio intento si se requiere un informe individual. Una explicación oral breve de los fallos aporta más que acelerar a la siguiente pantalla.

## Actividades si terminan pronto

No alteran la nota automática. Se pueden incorporar al proyecto o a su bitácora y revisar con el profesor.

1. **HTML · 10 minutos:** añadir una sección de objetivos y un segundo enlace interno. Crear una lista ordenada con los pasos para ejecutar un programa. Comprobar qué ocurre si el id del destino no coincide.
2. **CSS · 10 minutos:** crear un segundo tema de colores, añadir un efecto `:hover` y una transición, y comparar el diseño a 280 px y al ancho completo. Explicar por qué se ha usado `padding` en vez de `margin` en un elemento.
3. **JavaScript · 10–15 minutos:** en el editor habitual, escribir un programa de entradas con los tramos de edad de los apuntes. Probar 5, 6, 15 y 16 años y guardar en la bitácora los resultados. Cambiar `<` por `<=` en uno de los límites y explicar qué caso cambia. La vista previa del taller ejecuta HTML y CSS, no JavaScript.
4. **Depuración · 5 minutos:** inventar un error de ruta, selector o conversión de texto a número. Explicar el síntoma y cómo se corrige.

## Calificación y evidencia

La calificación automática es **puntos de los 36 retos / 36 × 10**. Cada reto cuenta como una unidad, aunque contenga varios huecos; todos sus apartados deben ser correctos para conseguir el punto. Con pista, un acierto vale 0,75; con error vale 0. Una respuesta enviada no se puede sustituir. Los apuntes y objetos de la sala son de consulta libre y no descuentan.

El proyecto final requiere HTML, CSS y una explicación de al menos 40 caracteres para cerrar la misión. El navegador verifica que existen, pero **no puntúa automáticamente su calidad**. El código y la bitácora se incluyen en el informe como evidencia para revisión docente, sin cambiar la nota de los retos.

Preguntas útiles para revisar el proyecto:

- ¿La tarjeta está personalizada y utiliza estructura semántica?
- ¿Los enlaces internos tienen un destino correcto?
- ¿El alumno explica sus cambios de colores, espaciado y esquinas?
- ¿Ha probado el ancho móvil y puede explicar una condición JavaScript?

Si necesitas que el proyecto tenga peso en la nota oficial, configura esa parte de la evaluación en Moodle y comunica el criterio antes de empezar.

## Guardado, versiones y privacidad

Los intentos se guardan en el navegador. La versión 2 utiliza un espacio de guardado distinto y reconoce los intentos de la primera versión: permite terminarlos o descargar su informe con sus 18 retos y su escala original. El botón de nuevo intento inicia la versión de 36 retos.

El proyecto se muestra dentro de un iframe aislado. No se ejecutan scripts del alumno ni se cargan recursos externos; se pueden utilizar enlaces internos. La tarjeta exportada mantiene estas restricciones y el informe conserva el código original como texto.

No hay envío automático a Moodle ni registro central. Al ser un sitio estático, el informe y el cálculo de la nota se pueden manipular en el navegador; úsalo como actividad formativa acompañada de la evidencia y la explicación del alumno.
