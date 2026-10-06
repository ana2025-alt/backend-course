# Backend con Node.js

## Datos del Estudiante
* **Nombre:** Ana Alexandra Anselmi Pallares
* **Cédula:** 29.640.288

---
## 📂 Estructura del Repositorio
Este proyecto sigue un enfoque de **desarrollo continuo**, donde la aplicación backend crece y se refactoriza clase a clase.

Para revisar el código correspondiente a una entrega o hito específico, puedes utilizar los tags de Git:
- **Clase 05:** `git checkout class-05`
- **Clase 06:** `git checkout class-06`
- **Clase 07:** `git checkout class-07`
- **Clase 08:** `git checkout class-08` 

## Descripción del repositorio
Este repositorio contiene las actividades prácticas, los artefactos de diseño, las reflexiones, las autoevaluaciones y el proyecto transversal desarrollados a lo largo del curso de backend. Su propósito es evidenciar la evolución técnica, el cumplimiento de contratos HTTP estrictos, el diseño de arquitecturas modulares en capas, el manejo seguro de errores con trazabilidad  la persistencia relacional con transacciones atómicas en PostgreSQL, y la integración de endpoints avanzados, auditoría histórica y cierre de bloque.

---

## Índice enlazado de actividades
* **[Clase 01: Servidor HTTP básico sin librerías externas](./activities/class-01/README.md)**
* **[Clase 02: HTTP como contrato y Request API Lite](./activities/class-02/README.md)**
* **[Clase 03: Recursos, Estado y Reglas](./activities/class-03/README.md)**
* **[Clase 04: Persistencia Relacional y Transacciones](./activities/class-04/README.md)**
* **[Clase 05: Autenticación, Seguridad y Módulos Multi-página](./frontend/README.md)**
* **[Clase 06: Request API Avanzada, Historial y Corrección de Regresiones](./project/README.md)**
* **[Clase 07: Manejo de Errores, Logging Seguro y Trazabilidad](./class-07/README.md)**
* **[Clase 08: Cierre de Bloque, Evidencias y Autoevaluación](./activities/class-08/README.md)**

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
```bash
cd project
npm install
npm run class-06:doctor
npm run db:seed
npm start

Validación y Pruebas (Clase 07 y Clase 08)
Bash
cd class-07
npm install
npm test
node scripts/validate-class-07.js

| Entrega | Tag de Git | Estado | Descripción |
| :--- | :--- | :--- | :--- |
| **Clase 01** | | **Completado** | Servidor nativo con `node:http`. |
| **Clase 02** | `class-02-submission` | **Completado** | API Lite con Express y diseño Contract-First. |
| **Clase 03** | `class-03-submission` | **Completado** | Máquina de estados y PATCH. |
| **Clase 04** | `class-04-submission` | **Completado** | PostgreSQL, pool de conexiones y transacciones. |
| **Clase 05** | `class-05-submission` | **Completado** | Frontend multi-página (`/app` y `/learn`) y RBAC. |
| **Clase 06** | `class-06-submission` | **Completado** | Auditoría histórica (`FEATURE-206`) y corrección de bug (`BUG-106`). |
| **Clase 07** | `class-07` | **Completado** | Manejo de errores seguros, *Correlation IDs* y *logging* interno. |
| **Clase 08** | `class-08` | **Completado** | Evaluación de conocimientos, autoevaluación integral y cierre de ticket (`FEATURE-801`). |