# Evidencia de progreso y cierre — Clases 01 a 07

Paquete de evidencia para el checkpoint acumulativo de conocimientos.
Este registro separa el resultado conceptual oficial de la presencia o
ejecución comprobable de artefactos de software.

## Metadata

* studentId: `anaanselmi0@gmail.com`
* Evaluación: `ITSU-KNOWLEDGE` 1.0
* Rúbrica: `BACKEND-01-07-K1`
* Paquete diagnóstico original: `ITSU-CHECKPOINT-01-07-1.0`, generado
  `2026-09-29T14:38:19.063Z`.
* Modelo señalado en el paquete diagnóstico: `gemini`.
* Commit evaluado por el examen: no especificado en el resultado oficial.
* Estado de repositorio remoto señalado por el paquete diagnóstico:
  `https://github.com/ana2025-alt/backend-course`; el hash/estado del commit
  no fue verificado.

## Evidencia acumulada

El inventario automático entregado junto con el paquete encontró
`scripts/seed.js` para Clase 4, `scripts/validate-class-06.js` para Clase 6
y `scripts/validate-class-07.js`, `src/middleware/error-handler.js` y
`src/middleware/request-id.js` para Clase 7. Reportó artefactos esperados
como `NOT_FOUND` para las Clases 1, 2, 3 y 5, y ninguna carpeta de pruebas
en ese inventario. Estos son resultados del inventario de archivos, no
calificaciones conceptuales; no se reinterpretan como ejecución ni se
contradicen con el examen.

`FOUND` acredita que el generador encontró el archivo; un archivo de salida
de validación no acredita por sí mismo que el comando se ejecutara. El
estado de git/commit quedó `NOT_VERIFIED`.

## Cuestionario de cierre

### Clase 01 — Fundamentos de backend

Una petición llega al servidor, que evalúa su método y ruta, ejecuta el
tratamiento correspondiente y emite una respuesta con el código de estado
adecuado. El proceso de Node.js permanece activo para escuchar solicitudes
continuamente, en lugar de terminar después de una sola petición.

### Clase 02 — HTTP y contratos

En `POST /requests`, el método expresa la creación, la ruta identifica la
colección, el body lleva los datos de creación y `201 Created` comunica el
resultado. `400 Bad Request` corresponde a una representación que no cumple
el contrato. Los datos de modificación pertenecen al body del `PATCH`, no
al query string, que sirve para parámetros de consulta y no para transportar
la representación modificada.

### Clase 03 — Recursos, estado y reglas

Un dato mal formado o inválido se responde como error de contrato (`400`);
una operación incompatible con el estado actual es un conflicto (`409`).
`DELETE` destruye el recurso, mientras que cancelar conserva el recurso y
registra una transición de estado. La distinción evita tratar un conflicto
del dominio como un problema de sintaxis.

### Clase 04 — PostgreSQL y persistencia

Una migración versiona cambios del esquema; el seed prepara datos de
demostración; una transacción agrupa escrituras que deben confirmarse o
revertirse como unidad. La evaluación destaca ACID y la regla de no editar
migraciones ya aplicadas: los cambios nuevos se agregan mediante una
migración posterior para conservar la sincronización entre entornos.

### Clase 05 — Autenticación y autorización

Autenticación establece quién es el actor y autorización decide qué
operaciones puede realizar. La identidad debe derivarse de claims de un JWT
cuya firma fue verificada, no de campos controlados por el cliente en el
body. Responder `404` tanto para un recurso ajeno como para uno inexistente
ofusca su existencia y evita revelar información de autorización.

### Clase 06 — Pruebas y regresiones

Una prueba prepara datos propios, ejecuta la operación bajo examen y
comprueba tanto el status como el cuerpo. Para demostrar que una prueba
protege una corrección, debe reproducir la falla sin el arreglo y pasar
con él; de otro modo podría ser un falso positivo. El reporte oficial
reconoce explícitamente este razonamiento.

### Clase 07 — Errores y observabilidad

Los errores esperados forman parte del contrato y se traducen a una
respuesta controlada; los inesperados producen una respuesta genérica
`500`. El cliente recibe un identificador de petición, mientras que el
servidor conserva el detalle técnico y el stack en logs vinculados con ese
mismo identificador. `/health` representa liveness; `/ready` comprueba si
el proceso puede atender trabajo dependiente de PostgreSQL.

## Resultado oficial del checkpoint

```text
ITSU-KNOWLEDGE|V=1.0|R=BACKEND-01-07-K1|C01=3|C02=3|C03=4|C04=3|C05=3|C06=3|C07=3|ACTION=NONE
```

| Clase | Nivel | Evidencia resumida en la evaluación |
| --- | ---: | --- |
| 01 | 3 | Describió con precisión el viaje de la petición desde el navegador hasta el status emitido por el servidor. |
| 02 | 3 | Explicó PATCH y justificó por qué el query string no debe transportar datos de modificación. |
| 03 | 3 | Diferenció datos mal formados, conflictos de estado, DELETE y cancelación. |
| 04 | 3 | Explicó transacciones/ACID e inmutabilidad de migraciones aplicadas. |
| 05 | 3  | Derivó identidad del JWT y justificó el 404 como ofuscación frente a recursos ajenos. |
| 06 | 3| Explicó la validación de una prueba de regresión y cómo evitar falsos positivos. |
| 07 | 3 | Diferenció respuesta genérica y detalle técnico correlacionado en logs. |

* `signals`: `["NONE"]`.
* Acción requerida: `NONE`.
* Nivel de confianza: medio; respuestas autónomas, precisas y coherentes
  con los objetivos evaluados.
* Digest docente: dominio sólido y preciso de las clases 1–7; sostuvo las
  repreguntas demostrando comprensión conceptual y visión de consecuencias.
* Recomendaciones de profundización: contratos REST y status HTTP,
  transacciones/estados concurrentes, y ofuscación de autorización.
* Feedback transversal: consistencia excelente en buenas prácticas de
  arquitectura backend, separación de responsabilidades y contratos seguros.

El registro íntegro de JSON y feedback docente, incluidas las preguntas
orales sugeridas, está en
[`self-evaluation/Conversacioncon la ia.md`](../../self-evaluation/Conversacioncon%20la%20ia.md).
La autoevaluación y reflexión están en
[`ai-self-evaluation-01-07.md`](./ai-self-evaluation-01-07.md).
