# Reflexión — Clase 03: Recursos, Estado y Reglas

### 1. ¿Qué cambió fundamentalmente en la arquitectura desde la Clase 02?
En la Clase 02 la aplicación estaba separada por tipo de archivo (`routes/` y `data/`). En la Clase 03 evolucionó a una modularización por dominio temático dentro de `modules/requests/`, reuniendo en un solo lugar sus rutas, su almacén de datos y sus reglas de estado.

### 2. ¿Qué regla de negocio o transición costó más trabajo proteger y por qué?
La protección de los estados terminales (`resolved` y `cancelled`), asegurando que ningún `PATCH` pudiera mutar sus propiedades una vez alcanzado ese estado, devolviendo un error semántico `409 Conflict` antes de evaluar cambios en otros campos.

### 3. ¿Cuál es la diferencia conceptual entre "validar datos" y "proteger estados"?
* **Validar datos:** Revisa que los tipos y formatos de entrada sean correctos (ej: que `title` sea un string no vacío o que `priority` sea uno de los valores permitidos).
* **Proteger estados:** Aplica reglas de negocio sobre el ciclo de vida del recurso, verificando si una transición es lógica y permitida según el estado actual de la entidad.

### 4. ¿Por qué se tomó la decisión de no implementar DELETE?
Porque en sistemas de incidencias la trazabilidad y auditoría son críticas. Eliminar un registro destruye el historial de averías; cancelar lógicamente (`cancelled`) mantiene el dato preservado y bloqueado para futuras ediciones.

### 5. ¿Qué beneficio técnico aporta que los errores tengan la estructura `{ error: { code, message } }`?
Permite al cliente frontend desacoplarse del texto del mensaje legible (`message`) y reaccionar mediante lógica programática basada en el código de máquina estandarizado (`code`), facilitando la internacionalización y el control de flujos de error.

### 6. ¿Qué limitaciones tiene todavía la persistencia actual en memoria?
Los datos son volátiles; cualquier reinicio del proceso de Node.js o caída del servidor restablece el arreglo a los tres elementos iniciales, perdiendo las creaciones y actualizaciones realizadas.

### 7. ¿Por qué es crucial congelar el diseño antes de implementar con IA?
Porque evita que la IA tome decisiones arquitectónicas arbitrarias, cambie rutas, invente campos no contemplados o altere los códigos de error pactados en el contrato original.

### 8. ¿Qué sugerencia o código propuesto por la IA decidiste rechazar y por qué?
Se rechazó cualquier estructura de carpetas sobrecargada (como `controllers/`, `services/` o `entities/`) para cumplir estrictamente con el principio de mantener solo tres archivos con responsabilidades claras y sin abstracciones innecesarias. 