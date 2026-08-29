# Notas sobre Recursos y Modelado de Dominio

## 1. Identificación y Ciclo de Vida
* **Recurso principal:** `Request` (Solicitud de mantenimiento).
* **Ciclo de estados:** `open` → `in-progress` → `resolved` / `cancelled`.
* **Inmutabilidad:** Los estados `resolved` y `cancelled` son terminales y no permiten modificaciones posteriores (`409 Conflict`).

## 2. Convenciones de Diseño
* **Persistencia:** En memoria durante las fases tempranas del desarrollo.
* **Operaciones:** `GET` (lectura/filtrado), `POST` (creación), `PATCH` (modificación parcial y transición de estado).
* **Eliminación:** Se descarta el borrado físico (`DELETE`) en favor de la cancelación lógica (`cancelled`) para preservar trazabilidad. 