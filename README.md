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
* **[Clase 02: HTTP como contrato y Request API Lite](./activities/class-02/README.md)**
* **[Clase 03: Recursos, Estado y Reglas](./activities/class-03/README.md)**
* **[Clase 04: Persistencia Relacional y Transacciones](./activities/class-04/README.md)**
* **[Clase 05: Autenticación, Seguridad y Módulos Multi-página](./frontend/README.md)**
* **[Clase 06: Request API Avanzada, Historial y Corrección de Regresiones](./project/README.md)**

---

## Enlace al proyecto transversal
* **[Código y Documentación del Proyecto](./project/README.md)**
* **[Contrato HTTP del Proyecto (v4)](./project/docs/http-contract.md)**
* **[Modelo de Datos y Restricciones](./project/docs/data-model.md)**
* **[Matriz de Consultas SQL](./project/docs/query-matrix.md)**
* **[Plan de Transacciones](./project/docs/transaction-plan.md)**
* **[Matriz de Pruebas con Evidencia](./project/docs/test-matrix.md)**

---

## Instrucciones de ejecución

### Backend (Proyecto Transversal)
cd project
npm install
npm run class-06:doctor
npm run db:seed
npm start

### Validación y Pruebas (Clase 06)
cd project
npm install
npm run class-06:doctor
npm run db:seed
npm run validate:class-06
---

## Estado de cada entrega

| Entrega | Tag de Git | Estado | Descripción |
| :--- | :--- | :--- | :--- |
| **Clase 01** |  | **Completado** | Servidor nativo con `node:http`. |
| **Clase 02** | `class-02-submission` | **Completado** | API Lite con Express y diseño Contract-First. |
| **Clase 03** | `class-03-submission` | **Completado** | Máquina de estados y PATCH. |
| **Clase 04** | `class-04-submission` | **Completado** | PostgreSQL, pool de conexiones y transacciones. |
| **Clase 05** | `class-05-submission` | **Completado** | Frontend multi-página (`/app` y `/learn`) y RBAC. |
| **Clase 06** | `class-06-submission` | **Completado** | Auditoría histórica (`FEATURE-206`) y corrección de bug (`BUG-106`). | 