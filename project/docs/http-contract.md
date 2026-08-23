# Contrato HTTP — Request API Full

## Recurso

Una solicitud (`request`) representa un reporte o ticket de mantenimiento dentro de una institucion o edificio (averias, equipos rotos o problemas de conectividad).

### Forma del recurso

| Campo         | Tipo    | Obligatorio | Quien lo asigna | Notas |
| ------------- | ------- | ----------- | --------------- | ----- |
| `id`          | Numero  | Si          | Servidor        | Autoincremental con `generateId()` |
| `title`       | String  | Si          | Cliente         | Titulo descriptivo no vacio |
| `description` | String  | No          | Cliente         | Detalle del problema. String vacio por defecto |
| `status`      | String  | Si          | Servidor        | Estado inicial por defecto: `'open'` |
| `priority`    | String  | No          | Cliente         | Prioridad asignada (`'low'`, `'medium'`, `'high'`) |

---

## Endpoint 1 — Listar solicitudes

| Elemento              | Valor |
| --------------------- | ----- |
| Metodo                | `GET` |
| Ruta                  | `/requests` |
| Entrada               | Ninguna (filtro opcional por query param `?status=open`) |
| Respuesta de exito    | `200 OK` con un arreglo JSON de solicitudes |
| Respuestas de error   | N/A |

**Ejemplo de respuesta**

```json
[
  {
    "id": 1,
    "title": "Projector does not turn on",
    "description": "The projector in room 204 shows no image during class.",
    "status": "open",
    "priority": "high"
  }
] 