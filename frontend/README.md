# Request Frontend — Entregas 05A y 05B

Interfaz frontend desarrollada con **Vite** en una estructura multi-página, conectada a la API del backend y acompañada de un módulo educativo interactivo sobre seguridad y autenticación.

---

## Estructura del Proyecto

* **`/app`** (Entrega 05A): Interfaz completa de solicitudes con autenticación (login y registro), roles diferenciados (*requester* y *agent*), creación de peticiones y gestión dinámica de prioridades y estados.
* **`/learn`** (Entrega 05B): Módulo interactivo titulado *«El mundo de la autenticación»*, que incluye 20 conceptos teóricos organizados y 3 herramientas interactivas (Simulador de tokens JWT, Validador de contraseñas de más de 15 caracteres y un Quiz dinámico de seguridad).

---

## Arranque y Ejecución

Sigue estos pasos para poner en marcha el proyecto localmente:

```bash
# 1. Instalar las dependencias
npm install

# 2. Configurar las variables de entorno (apuntando a tu backend real)
cp .env.example .env

# 3. Iniciar el servidor de desarrollo local
npm run dev 

El frontend correrá por defecto en: http://localhost:5173

Nota: Asegúrate de que tu backend tenga configurado FRONTEND_ORIGIN=http://localhost:5173 en su archivo .env para permitir las peticiones de CORS correctamente.

Decisiones de Arquitectura y Seguridad
Token en Memoria: Por razones de seguridad frente a vulnerabilidades de tipo XSS (evitando el almacenamiento persistente vulnerable en localStorage), el token de sesión se administra directamente en memoria. Esto significa que al recargar o cerrar la pestaña la sesión se reinicia de manera segura.

Diseño y Estética: Personalizado con una interfaz limpia y profesional basada en una paleta de colores lila y rosada (--primary: #f368e0, --bg: #140b1a).

Desarrollado como parte de las entregas académicas de la Clase 05.