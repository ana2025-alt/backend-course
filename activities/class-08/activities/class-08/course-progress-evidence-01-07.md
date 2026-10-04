# course-progress-evidence-01-07

Paquete de evidencia para el diagnóstico acumulativo 7 en 1.
Generado automáticamente — completa las secciones marcadas con [COMPLETAR] antes de ejecutar el prompt.

## Metadata

* studentId: anaanselmi0@gmail.com
* promptVersion: ITSU-CHECKPOINT-01-07-1.0
* rubricVersion: BACKEND-01-07-R1
* generatedAt: 2026-09-29T14:38:19.063Z (EXECUTED_NOW)
* repoRoot: class-08
* commit: NOT_VERIFIED (git no disponible) 
* repositorioRemoto:https://github.com/ana2025-alt/backend-course
* modeloUtilizado: gemini 

### Contexto de git (informativo, EXECUTED_NOW)

El curso se trabaja en computadoras compartidas: el historial local puede
estar incompleto o pertenecer a otra sesión sin que falte trabajo real.
Este contexto NO es evidencia requerida — la evidencia son los archivos
del repositorio remoto del estudiante y sus respuestas. La ausencia de
commits aquí no debe interpretarse como evidencia faltante.

## Evidencia por clase

Los archivos listados existen en el repositorio (FOUND). Un archivo de salida guardado, como validation-evidence.txt, es TEXTO: demuestra que se guardó, no que se ejecutó (NOT_VERIFIED como ejecución).

### Clase 01 — Fundamentos de backend

* NOT_FOUND: ningún artefacto esperado de esta clase

### Clase 02 — HTTP y contratos

* NOT_FOUND: ningún artefacto esperado de esta clase

### Clase 03 — Recursos, estado y reglas

* NOT_FOUND: ningún artefacto esperado de esta clase

### Clase 04 — PostgreSQL y persistencia

* FOUND: scripts\seed.js

### Clase 05 — Autenticación y autorización

* NOT_FOUND: ningún artefacto esperado de esta clase

### Clase 06 — Onboarding y pruebas

* FOUND: scripts\validate-class-06.js

### Clase 07 — Diagnóstico y errores

* FOUND: scripts\validate-class-07.js
* FOUND: src\middleware\error-handler.js
* FOUND: src\middleware\request-id.js

## Estado previo a la clase 8

* Validadores disponibles (clases 1-7): scripts\validate-class-06.js, scripts\validate-class-07.js
* Carpetas de pruebas: NOT_FOUND
* Último commit antes del taller: NOT_VERIFIED

## Cuestionario diagnóstico (responde aquí, 3-6 líneas cada una)

Sé específico: cita archivos o rutas concretas de TU proyecto cuando puedas. La extensión no suma.

### Pregunta clase 01

Describe qué ocurre desde que una petición llega al backend hasta que sale una respuesta y explica por qué el servidor debe permanecer activo.

Respuesta: Una petición llega al servidor, el cual evalúa su método y ruta para procesarla y retornar el código de estado adecuado (como 200 o 404). El servidor permanece activo gracias a Node.js, lo que evita que el proceso finalice de inmediato y le permite escuchar solicitudes de forma continua.

### Pregunta clase 02

Elige un endpoint del proyecto y explica cómo método, ruta, body y status forman su contrato.

Respuesta: En el endpoint POST /requests: el método (POST) indica la creación, la ruta (/requests) define el recurso, el body aporta los datos obligatorios (como el título), y el status reporta el resultado de la operación (201 Created o 400 Bad Request).   

### Pregunta clase 03

Explica, usando una solicitud del proyecto, la diferencia entre representación, dato inválido y transición incompatible con el estado actual.

Respuesta: Representación: Los datos públicos en formato JSON que expone el recurso (como los campos del ticket).   

Dato inválido: Incumplimiento de las reglas de entrada o campos requeridos faltantes (ej. crear una solicitud sin título), respondido con 400 Bad Request.

 Transición incompatible: Violar el ciclo de vida o intentar modificar un recurso que ya se encuentra en estado terminal (ej. resolved), respondido con 409 Conflict. 

### Pregunta clase 04

Explica la diferencia entre migración, seed y transacción, e indica dónde aparece cada concepto en el proyecto.

Respuesta: [COMPLETAR]

### Pregunta clase 05

Explica la diferencia entre autenticación y autorización y por qué un JWT decodificado todavía debe verificarse.

Respuesta: [COMPLETAR]

### Pregunta clase 06

Elige una prueba del proyecto, identifica preparación, acción y comprobación, y explica qué regresión protege.

Respuesta: [COMPLETAR]

### Pregunta clase 07

Describe un fallo investigado distinguiendo síntoma, hipótesis y causa; luego indica qué señal correspondería a health o readiness.

Respuesta: [COMPLETAR]

---
Nota de seguridad: este paquete fue generado excluyendo .env y redactando
posibles secretos. Revisa una vez más antes de pegarlo en un modelo:
si ves una credencial real, reemplázala por [REDACTED] y avisa al docente.
