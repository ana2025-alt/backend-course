# Modelo de Recurso — Request (Solicitud de Mantenimiento)

## 1. Identificación del Recurso
* **Nombre:** Solicitud de mantenimiento (`request`)
* **Propósito:** Representa una incidencia o reporte de mantenimiento dentro de una institución o edificio.

---

## 2. Propiedades del Recurso

| Campo | Tipo | Requerido al crear | Quién lo asigna | Modificable por cliente (PATCH) | Valores permitidos / Reglas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | Número | No | Servidor | No | Entero positivo incremental. |
| `title` | String | Sí | Cliente | Sí | Texto no vacío (sin solo espacios). |
| `description` | String | No | Cliente | Sí | Texto opcional; cadena vacía por defecto si no se envía. |
| `status` | String | No | Servidor | Sí (con restricciones) | `'open'`, `'in-progress'`, `'resolved'`, `'cancelled'`. Inicial: `'open'`. |
| `priority` | String | No | Cliente | Sí | `'low'`, `'medium'`, `'high'`. Por defecto: `'medium'`. |
| `createdAt` | String (ISO 8601) | No | Servidor | No | Timestamp de creación (`new Date().toISOString()`). |
| `updatedAt` | String (ISO 8601) | No | Servidor | No | Timestamp de última modificación. |

---

## 3. Estados Permitidos
* `open`: Solicitud registrada, pendiente de atención.
* `in-progress`: Solicitud en proceso de resolución por el personal técnico.
* `resolved`: Solicitud completada y reparada (Estado terminal).
* `cancelled`: Solicitud descartada o anulada (Estado terminal).

---

## 4. Reglas de Negocio
1. `id`, `createdAt` y `updatedAt` son administrados exclusivamente por el servidor. Si el cliente los envía en `POST` o `PATCH`, el servidor los ignora.
2. Si un recurso se encuentra en un estado terminal (`resolved` o `cancelled`), no se permite ninguna modificación mediante `PATCH` (retorna `409 Conflict`).
3. El cambio de estado mediante `PATCH` debe respetar estrictamente la máquina de transiciones permitidas. 