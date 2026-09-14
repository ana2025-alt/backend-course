# Request API Full — Proyecto Transversal

API REST en Express para la gestión de solicitudes de mantenimiento institucional. Este proyecto evoluciona de manera acumulativa a lo largo del curso.

---

## Requisitos e Instalación

* **Node.js:** v18 o superior (`node --version`).
* **Base de datos:** Instancia de PostgreSQL (Supabase).
* **Dependencias:** Express, pg, dotenv (`npm install`).

### Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz de `project/` basándote en `.env.example`:

```env
DATABASE_URL=postgresql://usuario:contraseña@host:5432/postgres 

cd project
npm install
npm run db:check   # Valida la conexión a PostgreSQL y tablas
npm start          # Inicia el servidor


project/
├── .env.example
├── package.json
├── README.md
├── database/
│   └── migrations/
│       ├── 001_create_requests.sql
│       └── 002_create_request_status_history.sql
├── docs/
│   ├── http-contract.md
│   └── decisions/
│       └── 001-cancel-instead-of-delete.md
├── scripts/
│   └── check-database.js
└── src/
    ├── app.js
    ├── server.js
    ├── database/
    │   ├── pool.js
    │   └── transaction.js
    └── modules/
        └── requests/
            ├── request.mapper.js
            ├── request-status.js
            ├── requests.routes.js
            ├── requests.service.js
            └── requests.store.js


            Historial de Incrementos
Incremento 3: Persistencia Relacional y Transacciones (Clase 04 — Actual)
Migración a PostgreSQL (Supabase): Se reemplazó el almacenamiento en memoria por persistencia relacional mediante el driver nativo pg y un pool de conexiones (src/database/pool.js).

Arquitectura en 3 capas:

Store (requests.store.js): Consultas SQL parametrizadas sin ORM para evitar inyección SQL.

Service (requests.service.js): Orquestación de reglas de negocio y transacciones atómicas.

Routes/Controller (requests.routes.js): Enrutamiento HTTP, validaciones y códigos de estado.

Trazabilidad transaccional: Implementación de withTransaction para registrar cambios de estado atómicamente en la tabla request_status_history.

Capa de transformación (Mapper): request.mapper.js traduce entre la convención de base de datos (snake_case) y la representación HTTP (camelCase).


Incremento 2: Recursos, Estado y Reglas (Clase 03)Arquitectura modular: Organización por dominio en src/modules/requests/.
Máquina de estados: Transiciones controladas (open $\rightarrow$ in_progress $\rightarrow$ resolved / cancelled).
Filtros combinables: Parámetros de consulta en GET /api/v1/requests?status=&priority=.
Cancelación lógica: Documentada en docs/decisions/001-cancel-instead-of-delete.md.

Incremento 1: HTTP como contrato (Clase 02)Andamiaje inicial: Separación entre server.js, app.js y routers.Contrato HTTP estricto: Especificación en docs/http-contract.md.

| Archivo | Responsabilidad |
| --- | --- |
| `src/database/pool.js` | Conexión con PostgreSQL mediante connection pooling. |
| `src/database/transaction.js` | Manejador de transacciones ACID (`BEGIN`, `COMMIT`, `ROLLBACK`). |
| `src/modules/requests/request.mapper.js` | Traduce filas SQL (`snake_case`) a DTOs para la API (`camelCase`). |
| `src/modules/requests/requests.store.js` | Consultas SQL directas y parametrizadas (`$1`, `$2`). |
| `src/modules/requests/requests.service.js` | Reglas de negocio, validaciones lógicas y manejo transaccional. |
| `src/modules/requests/requests.routes.js` | Endpoints HTTP (`GET`, `POST`, `PATCH`, `DELETE`). |

Reglas de Negocio
Sin ORM: Acceso directo a base de datos usando SQL estándar parametrizado.

Persistencia Atómica: Toda mutación de estado registra su historial de auditoría bajo la misma transacción.

Cancelación Lógica: No se permite borrado físico (DELETE); se actualiza el estado a cancelled.

Formato Consistente: Entrada y salida de datos estructurada con camelCase.