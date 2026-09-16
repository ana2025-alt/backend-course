Aquí tienes ambos archivos corregidos, limpios de caracteres extraños, con el formato impecable en Markdown y actualizados para incluir formalmente la **Clase 06** (con su respectivo tag `class-06-submission`, el estado completado y la inclusión del endpoint de historial).

---

### Archivo 1: `domain-model.md` (o Notas sobre Recursos y Modelado de Dominio)

```markdown
# Notas sobre Recursos y Modelado de Dominio

## 1. Identificación y Ciclo de Vida
* **Recurso principal:** `Request` (Solicitud de mantenimiento institucional).
* **Ciclo de estados:** `open` → `in_progress` → `resolved` / `cancelled`.
* **Inmutabilidad:** Los estados `resolved` y `cancelled` son terminales; cualquier intento de modificación posterior es rechazado con `409 Conflict`.
* **Auditoría:** Cada transición genera un registro histórico inmutable en `request_status_history` bajo una transacción atómica.

## 2. Convenciones de Diseño
* **Persistencia:** Relacional mediante PostgreSQL (Supabase) con connection pooling (`pg.Pool`) y consultas parametrizadas.
* **Operaciones:** 
  * `GET /api/v1/requests` (lectura y filtrado por query params).
  * `GET /api/v1/requests/:id` (detalle con objeto de solicitud).
  * `GET /api/v1/requests/:id/history` (trazabilidad y auditoría de eventos cronológicos ordenados de más antiguo a más nuevo).
  * `POST /api/v1/requests` (creación transaccional con estado inicial `open`).
  * `PATCH /api/v1/requests/:id` (transición controlada de máquina de estados y actualización de atributos).
  * `DELETE /api/v1/requests/:id` (cancelación lógica).
* **Eliminación:** Se descarta el borrado físico (`DELETE` en BD) en favor de la cancelación lógica (`cancelled`) para garantizar la trazabilidad completa del ciclo de vida.

## 3. Control de Accesos y Roles (RBAC)
* **Requester (Solicitante):** Permisos para crear nuevas solicitudes (`POST`), consultar únicamente sus propias solicitudes o el detalle de las mismas, y revisar su historial.
* **Agent (Agente/Gestor):** Permisos para listar todas las solicitudes del sistema, modificar estados y prioridades mediante `PATCH`, y gestionar la trazabilidad operativa completa.

## 4. Reglas de Validación y Códigos de Error (HTTP)
* **400 Bad Request:** Si faltan campos obligatorios o los valores del payload no coinciden con el esquema permitido.
* **401 Unauthorized:** Si la petición no incluye un token JWT válido o ha expirado.
* **403 Forbidden:** Si un usuario con rol `Requester` intenta ejecutar acciones exclusivas de un `Agent` (ej. cambiar estados o prioridades).
* **404 Not Found:** Si el identificador (`id`) de la solicitud no existe en la base de datos o no pertenece al usuario autorizado.
* **409 Conflict:** Al intentar modificar una solicitud cuyo estado actual ya es terminal (`resolved` o `cancelled`).

```

---

### Archivo 2: `README.md` (Principal del repositorio)

```markdown
# Backend con Node.js

## Datos del Estudiante
* **Nombre:** Ana Alexandra Anselmi Pallares
* **Cédula:** 29.640.288

---

## Descripción del repositorio
Este repositorio contiene las actividades prácticas, los artefactos de diseño, las reflexiones y el proyecto transversal desarrollados a lo largo del curso de backend. Su propósito es evidenciar la evolución técnica, el cumplimiento de contratos HTTP estrictos, el diseño de arquitecturas modulares en capas, el control de ciclo de vida mediante máquinas de estado, la persistencia relacional con transacciones atómicas en PostgreSQL, y la integración de endpoints avanzados como la API de solicitudes y su auditoría histórica.

---

## Índice enlazado de actividades

* **[Clase 01: Servidor HTTP básico sin librerías externas](./activities/class-01/README.md)**
  * Servidor nativo con el módulo `http` de Node.js, ruteo básico por método y URL, y respuestas JSON.
* **[Clase 02: HTTP como contrato y Request API Lite](./activities/class-02/README.md)**
  * Primer servidor con Express, diseño de contratos HTTP, separación inicial de rutas/datos y validaciones de entrada.
* **[Clase 03: Recursos, Estado y Reglas](./activities/class-03/README.md)**
  * Diseño previo (`class-03-design`), mapa de transiciones, máquina de estados finitos, actualización parcial (`PATCH`), formato unificado de error y registro de uso de IA.
* **[Clase 04: Persistencia Relacional y Transacciones](./activities/class-04/README.md)**
  * Migración de memoria volátil a PostgreSQL (Supabase), pool de conexiones, arquitectura en 3 capas (Store/Service/Routes), orquestación transaccional (`withTransaction`) para auditoría de estados y mapeo DTO.
* **[Clase 05: Autenticación, Seguridad y Módulos Multi-página (`/app` y `/learn`)](./frontend/README.md)**
  * Implementación de interfaz multi-página en Vite, consumo de API con token en memoria, control de accesos (RBAC) y módulo educativo interactivo con teoría de seguridad, simulador JWT, validador de passphrase y quiz dinámico.
* **[Clase 06: Request API Avanzada, Historial y Corrección de Regresiones](./project/README.md)**
  * Implementación del endpoint de auditoría histórica (`GET /api/v1/requests/:id/history`) ordenado cronológicamente, solución de bugs por colecciones vacías (BUG-106), pruebas automatizadas y validación estricta de contratos.

---

## Enlace al proyecto transversal

El proyecto transversal representa el servicio acumulativo que evoluciona en cada clase:

* **[Código y Documentación del Proyecto](./project/README.md)**
* **[Contrato HTTP del Proyecto (v4)](./project/docs/http-contract.md)**
* **[Modelo de Datos y Restricciones](./project/docs/data-model.md)**
* **[Matriz de Consultas SQL](./project/docs/query-matrix.md)**
* **[Plan de Transacciones](./project/docs/transaction-plan.md)**
* **[Contrato de Persistencia del Store](./project/docs/persistence-contract.md)**
* **[Mapa de Errores](./project/docs/error-map.md)**
* **[Matriz de Pruebas con Evidencia](./project/docs/test-matrix.md)**
* **[Nota de Decisión Técnica 001: Cancelar en lugar de eliminar](./project/docs/decisions/001-cancel-instead-of-delete.md)**

---

## Instrucciones de ejecución

Asegúrate de contar con Node.js instalado (v18 o superior) y una base de datos PostgreSQL activa (Supabase).

### 1. Ejecutar el Backend (Proyecto Transversal)
```bash
cd project
npm install

# Configurar variables de entorno (.env con DATABASE_URL y FRONTEND_ORIGIN=http://localhost:5173)
# Comprobar la conexión a la base de datos
npm run class-06:doctor

# Poblar la base de datos con el seed inicial si es necesario
npm run db:seed

# Iniciar el servidor backend
npm start 

```

### 2. Ejecutar la Validación y Pruebas (Clase 06)
```bash
# Entra a la carpeta del proyecto backend
cd project
npm install

# Configurar el archivo de entorno (.env con DATABASE_URL)
# Comprobar la salud del entorno y la base de datos
npm run class-06:doctor

# Poblar la base de datos con los datos de prueba (seed)
npm run db:seed

# Ejecutar el script de validación integral (debe arrojar 12/12 PASS)
npm run validate:class-06 
```

### 3. Ejecutar actividades anteriores (Clases 01 a 03)

```bash
# Para la actividad de la Clase 01
cd activities/class-01
npm start

# Para la actividad de la Clase 02
cd activities/class-02
npm install
npm start

# Para la actividad de la Clase 03
cd activities/class-03
npm install
npm start

# Para la actividad de la Clase 04
cd activities/class-04
npm install
npm start

```

---

## Resumen de Entregas

| Entrega | Tag de Git | Estado | Descripción |
| --- | --- | --- | --- |
| **Clase 01** | `class-01-submission` | **Completado** | Servidor nativo con `node:http`, sin dependencias. |
| **Clase 02** | `class-02-submission` | **Completado** | API Lite con Express y diseño Contract-First. |
| **Clase 03 (Diseño)** | `class-03-design` | **Completado** | Artefactos previos de diseño, modelo y matriz de pruebas. |
| **Clase 03 (Final)** | `class-03-submission` | **Completado** | Máquina de estados, `PATCH`, arquitectura modular y reflexión. |
| **Clase 04 (Final)** | `class-04-submission` | **Completado** | Arquitectura en 3 capas, PostgreSQL, pool de conexiones, transacciones atómicas para historial y suite de documentación. |
| **Clase 05 (Final)** | `class-05-submission` | **Completado** | Frontend multi-página (`/app` y `/learn`), diseño lila/rosado, manejo seguro de token en memoria y guía interactiva de autenticación. |
| **Clase 06 (Final)** | `class-06-submission` | **Completado** | Feature de historial de solicitudes (`FEATURE-206`), corrección de regresión de colecciones vacías (`BUG-106`) y validador en verde (12/12). |

```
