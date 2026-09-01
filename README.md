# Backend con Node.js

## Tu nombre
- **Estudiante:** Ana Anselmi
- **Cédula:** 29.640.288

---

## Descripción del repositorio
Este repositorio contiene las actividades prácticas, los artefactos de diseño, las reflexiones técnicas y el proyecto transversal desarrollados a lo largo del curso de backend. Su propósito es evidenciar la evolución técnica en Node.js, el cumplimiento de contratos HTTP estrictos, el diseño de arquitecturas modulares con Express y el control de ciclos de vida mediante máquinas de estado finito.

---

## Índice enlazado de actividades
- **[Clase 01: Servidor HTTP básico sin librerías externas](./clase-01/)**  
  Implementación de un servidor nativo con el módulo `http` de Node.js, ruteo básico manual por método/URL y serialización de respuestas JSON.
- **[Clase 02: HTTP como contrato y Request API Lite](./clase-02/)**  
  Primer servidor con Express, diseño formal de contratos HTTP, separación de capas (rutas/datos) y validaciones de entrada.
- **[Clase 03: Recursos, Estado y Reglas](./clase-03/)**  
  Diseño previo (`class-03-design`), mapa de transiciones, máquina de estados finitos, actualización parcial (`PATCH`), formato unificado de errores y bitácora de uso de IA.

---

## Enlace al proyecto transversal
El proyecto transversal (**Request API Full**) representa el servicio acumulativo que evoluciona e integra los conceptos de cada sesión:

- 📂 **[Código y Documentación del Proyecto](./project/)**
- 📄 **[Contrato HTTP del Proyecto (v3)](./project/docs/http-contract-v3.md)**
- 📝 **[Nota de Decisión Técnica 001: Cancelar en lugar de eliminar](./project/docs/adr-001-cancel-vs-delete.md)**

---

## Instrucciones de ejecución
Asegúrate de contar con **Node.js v18** o superior instalado en tu entorno.

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

# 2. Navegar al proyecto transversal (Clase 03)
cd project

# 3. Instalar dependencias
npm install

# 4. Iniciar el servidor
npm start


Estado de cada entregaEntregaMódulo / TemaEstadoEvidencias / EnlaceClase 01Servidor nativo Node.js (HTTP)CompletadoVer entregaClase 02Express & Contratos HTTP LiteCompletadoVer entregaClase 03Máquina de Estados, PATCH & ErroresCompletadoVer entregaProyectoRequest API Full (v3)CompletadoVer proyecto
