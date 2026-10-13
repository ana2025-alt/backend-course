# Clase 06: Request API Avanzada y Auditoría

## Objetivo de la actividad
Resolver tickets de desarrollo (BUG-106 y FEATURE-206) asegurando la correcta devolución de colecciones vacías y la implementación del endpoint de auditoría histórica cronológica.

## Instrucciones de ejecución
\`\`\`bash
cd project
npm install
npm run class-06:doctor
npm run db:seed
npm run validate:class-06
\`\`\`

## Solución desarrollada y casos comprobados
* Ajuste del método `listRequests` para retornar `[]` con código `200` en lugar de `404` cuando no existan registros.
* Implementación de la ruta `GET /api/v1/requests/:id/history` ordenada cronológicamente de forma ascendente.

## Evidencia reproducible
* Salida del validador con 12/12 PASS registrada en `validation-evidence.txt`.

## Explicación conceptual
* Uso de transacciones atómicas en PostgreSQL para garantizar consistencia en el almacenamiento del historial de estados.

## Falla diagnosticada
* Manejo inadecuado de errores HTTP en respuestas de colecciones vacías y ausencia de ordenamiento explícito por marcas de tiempo en los eventos históricos.

## AI usage
* Uso de herramientas de IA como apoyo analítico para la estructuración y depuración de consultas SQL y validación de contratos de API.

## Reflexión breve sobre lo aprendido
* Consolidar un backend robusto requiere comprender a profundidad las reglas de negocio, los contratos HTTP estrictos y la integridad transaccional para evitar regresiones al modificar sistemas existentes. 