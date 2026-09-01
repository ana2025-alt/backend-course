# Backend con Node.js

**Estudiante:** Ana Anselmi  
**Cédula:** 29.640.288  

---

## Descripción del repositorio
Este repositorio contiene las actividades prácticas, los artefactos de diseño, las reflexiones y el proyecto transversal desarrollados a lo largo del curso de backend. Su propósito es evidenciar la evolución técnica, el cumplimiento de contratos HTTP estrictos, el diseño de arquitecturas modulares en Express y el control de ciclo de vida mediante máquinas de estado.

---

## Índice enlazado de actividades

* **[Clase 01: Servidor HTTP básico sin librerías externas](./activities/class-01/README.md)**
  * Servidor nativo con el módulo `http` de Node.js, ruteo básico por método y URL, y respuestas JSON.

* **[Clase 02: HTTP como contrato y Request API Lite](./activities/class-02/README.md)**
  * Primer servidor con Express, diseño de contratos HTTP, separación inicial de rutas/datos y validaciones de entrada.
  
* **[Clase 03: Recursos, Estado y Reglas](./activities/class-03/README.md)**
  * Diseño previo (`class-03-design`), mapa de transiciones, máquina de estados finitos, actualización parcial (`PATCH`), formato unificado de error y registro de uso de IA.

---

## Proyecto Transversal (Request API Full)

El proyecto transversal representa el servicio acumulativo que evoluciona en cada clase:

* **[Código y Documentación del Proyecto](./project/README.md)**
* **[Contrato HTTP del Proyecto (v3)](./project/docs/http-contract.md)**
* **[Nota de Decisión Técnica 001: Cancelar en lugar de eliminar](./project/docs/decisions/001-cancel-instead-of-delete.md)**

---

## Instrucciones de ejecución

Asegúrate de contar con Node.js instalado (v18 o superior).

### 1. Ejecutar el Proyecto Transversal (Clase 03 actual)
```bash
cd project
npm install
npm start 
```
