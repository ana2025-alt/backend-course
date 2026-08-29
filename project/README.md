# Request API Full — Proyecto Transversal

API REST en Express para la gestión de solicitudes de mantenimiento institucional. Este proyecto evoluciona de manera acumulativa a lo largo del curso.

---

## Requisitos e Instalación

* **Node.js:** v18 o superior (`node --version`).
* **Dependencias:** Express (`npm install`).

```bash
cd project
npm install
npm start

Servidor en ejecución en http://localhost:3000.

Estructura Actual del Proyecto (Clase 03)
La arquitectura organiza el código por dominio dentro de src/modules/requests/:

project/
├── package.json
├── README.md
├── docs/
│   ├── http-contract.md
│   └── decisions/
│       └── 001-cancel-instead-of-delete.md
└── src/
    ├── app.js
    ├── server.js
    └── modules/
        └── requests/
            ├── request-status.js
            ├── requests.store.js
            └── requests.routes.js 

    Historial de IncrementosIncremento 2: Recursos, Estado y Reglas (Clase 03 — Actual)
    Arquitectura modular: Se consolidaron rutas, reglas de negocio y almacén en memoria en src/modules/requests/.
            
    Máquina de estados: Ciclo de vida controlado (open $\rightarrow$ in-progress $\rightarrow$ resolved / cancelled).
            
    Nuevo endpoint: PATCH /requests/:id con control estricto de transiciones válidas y bloqueo de modificaciones sobre estados terminales (409 Conflict).
            
    Filtros avanzados: Búsqueda combinable por query params (GET /requests?status=&priority=).
            
    Formato de error unificado: { "error": { "code": "...", "message": "..." } }.
            
    Decisión técnica: Adopción de cancelación lógica en lugar de borrado físico (docs/decisions/001-cancel-instead-of-delete.md).


    Incremento 1: HTTP como contrato y Request API Lite (Clase 02 — Base)
    
    Andamiaje inicial: Separación básica de responsabilidades entre src/server.js, src/app.js, src/routes/ y src/data/.
    
    Contrato HTTP estricto: Definición previa de endpoints, métodos y códigos de estado en docs/http-contract.md.
    
    Endpoints iniciales:
    GET /requests $\rightarrow$ Lista completa en memoria.
    
    GET /requests/:id $\rightarrow$ Búsqueda por identificador con validación 404.
    
    POST /requests $\rightarrow$ Creación con validación de campo requerido title (400 Bad Request).


| Archivo                                        | Responsabilidad                                                                                        |
| :--------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| `src/server.js`                                | Inicializa el proceso y escucha peticiones en el puerto 3000.                                          |
| `src/app.js`                                   | Instancia Express, configura `express.json()` y monta los módulos de rutas.                            |
| `src/modules/requests/request-status.js`        | Define estados válidos, matriz de transiciones y validadores de estados terminales.                    |
| `src/modules/requests/requests.store.js`       | Manejo de persistencia volátil en memoria y operaciones CRUD (`findAll`, `findById`, `create`, `update`). |
| `src/modules/requests/requests.routes.js`      | Enrutamiento HTTP (`GET`, `POST`, `PATCH`), validación de parámetros y respuestas semánticas.          |
| `docs/http-contract.md`                        | Especificación del contrato HTTP de la API.                                                            |
| `docs/decisions/001-cancel-instead-of-delete.md`| Justificación técnica sobre la omisión de `DELETE` a favor de `status: cancelled`.                     |


Reglas de Negocio y Exclusiones
Sin base de datos externa: Persistencia en memoria volátil (arreglo en requests.store.js).

Sin borrado físico: Las solicitudes se cancelan mediante PATCH /requests/:id con status: "cancelled".

Protección de estados terminales: Solicitudes en resolved o cancelled rechazan modificaciones con 409 Conflict.

Sin librerías de validación de terceros: Validaciones nativas en JavaScript con módulos ES (import/export).