BLOQUE 1 — RESULT_CODE
ITSU-KNOWLEDGE|V=1.0|R=BACKEND-01-07-K1|C01=4|C02=4|C03=4|C04=4|C05=4|C06=4|C07=4|ACTION=NONE

BLOQUE 2 — JSON
JSON
{
  "resultCode": "ITSU-KNOWLEDGE|V=1.0|R=BACKEND-01-07-K1|C01=4|C02=4|C03=4|C04=4|C05=4|C06=4|C07=4|ACTION=NONE",
  "studentId": "anaanselmi0@gmail.com",
  "action": "NONE",
  "signals": ["NONE"],
  "classes": [
    { "classId": "01", "level": 4, "question": "Viaje completo de una petición HTTP", "evidence": "Describió con precisión el flujo desde la construcción en el navegador hasta la emisión del código de estado en el servidor." },
    { "classId": "02", "level": 4, "question": "Método PATCH vs otros y ubicación de datos", "evidence": "Identificó el propósito de PATCH y justificó correctamente por qué enviar datos de modificación en el query string viola la semántica HTTP." },
    { "classId": "03", "level": 4, "question": "Diferencia entre 409, 400 y el impacto de DELETE frente a transiciones de estado", "evidence": "Explicó la distinción lógica entre conflictos de estado y datos mal formados, y contrastó la destrucción permanente con la preservación por cancelación." },
    { "classId": "04", "level": 4, "question": "Garantías transaccionales y regla de inmutabilidad de migraciones", "evidence": "Explicó el rol de ACID/transacciones y justificó por qué editar migraciones aplicadas rompe la sincronización entre entornos." },
    { "classId": "05", "level": 4, "question": "Derivación de identidad desde el JWT y manejo del 404 frente al 403", "evidence": "Comprendió el riesgo de manipulación del body y justificó el uso del 404 como técnica de ofuscación de seguridad." },
    { "classId": "06", "level": 4, "question": "El rol de las pruebas en regresiones y la validación de la prueba", "evidence": "Argumentó con claridad la necesidad de que la prueba falle primero para evitar falsos positivos y validar la efectividad de la corrección." },
    { "classId": "07", "level": 4, "question": "Gestión y registro de errores esperados frente a inesperados", "evidence": "Describió la separación entre la respuesta genérica al cliente y el almacenamiento del detalle técnico con rastreo en logs." }
  ],
  "reviewTopics": [
    "Semántica avanzada de contratos REST y códigos de error HTTP",
    "Patrones de control de transacciones en bases de datos relacionales",
    "Estrategias de ofuscación de seguridad en autorización"
  ],
  "teacherDigest": "Estudiante con dominio sólido y preciso de los conceptos de backend de las clases 1 a 7. Sostuvo todas las repreguntas demostrando comprensión conceptual profunda y visión de consecuencias."
}
BLOQUE 3 — REPORTE DEL ESTUDIANTE
Qué explicaste bien: Demostraste un dominio excelente y preciso de los conceptos en todas las clases. Por ejemplo, al abordar el flujo HTTP (Clase 1) y los contratos REST (Clase 2), explicaste con claridad por qué enviar datos de modificación en el query string viola los estándares de diseño. Asimismo, en las clases de persistencia y seguridad (Clases 4 y 5), articulaste con precisión por qué la inmutabilidad de las migraciones protege los entornos y por qué la identidad jamás debe confiarse al body de la petición, justificando además el uso estratégico del código 404 para la ofuscación de recursos ajenos.

Huecos revelados en repreguntas: No se identificaron huecos conceptuales significativos; las repreguntas fueron respondidas demostrando comprensión de consecuencias y casos límite de manera consistente.

Temas prioritarios de repaso:

Revisión de contratos REST avanzados (Clase 2).

Gestión de transacciones y estados concurrentes (Clase 4).

Estrategias de manejo de errores y logging seguro (Clase 7).

BLOQUE 4 — FEEDBACK DOCENTE
Prioridades transversales: Consistencia excelente en la aplicación de buenas prácticas de arquitectura backend, separación de responsabilidades y diseño orientado a contratos seguros.

Señales registradas: NONE

Preguntas orales sugeridas:

Pregunta 1: ¿Qué diferencia práctica existe entre un fallo manejado en la capa de servicios y un error no controlado capturado por el middleware global? (Respuesta esperada: el primero forma parte del contrato y retorna un código de error de cliente controlado, mientras que el segundo representa un fallo de sistema imprevisto que emite un 500 y se aísla en los registros).

Pregunta 2: ¿Por qué la verificación del token JWT en cada petición debe estar desacoplada de la consulta directa a la base de datos para validar roles en caliente? (Respuesta esperada: para optimizar el rendimiento y evitar latencia de red en cada ciclo de solicitud-respuesta, confiando en la firma criptográfica y claims del payload).

Nivel de confianza del examen: medio (respuestas autónomas, precisas y coherentes con los objetivos evaluados).
