# Backend con Node.js

## Datos del Estudiante
* **Nombre:** Ana Anselmi
* **Cédula:** 29.640.288

---

## Descripción del repositorio
Este repositorio contiene las actividades prácticas, los artefactos de diseño, las reflexiones y el proyecto transversal desarrollados a lo largo del curso de backend. Su propósito es evidenciar la evolución técnica, el cumplimiento de contratos HTTP estrictos, el diseño de arquitecturas modulares en capas, el control de ciclo de vida mediante máquinas de estado y la persistencia relacional con transacciones atómicas en PostgreSQL, integrando además la interfaz de usuario frontend.

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
npm run db:check

# Iniciar el servidor backend
npm start 

```

### 2. Ejecutar el Frontend (Clase 05 — `/app` y `/learn`)

```bash
# En una nueva pestaña de la terminal, accede a la carpeta del frontend
cd frontend
npm install

# Configurar el archivo de entorno (.env con VITE_API_URL apuntando a tu backend)
cp .env.example .env

# Iniciar el servidor de desarrollo del frontend
npm run dev
# Accede en tu navegador a: http://localhost:5173

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

```


