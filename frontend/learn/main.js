console.log('learn/ ready — Entregable 05B activo con Quiz Dinámico');

// --- 1. Los 20 contenidos teóricos requeridos por la rúbrica ---
const theoryData = [
  "1. Autenticación vs Autorización: La autenticación valida quién eres; la autorización decide qué puedes hacer.",
  "2. Contraseñas seguras: El estándar moderno exige mínimo 15 caracteres para dificultar ataques de fuerza bruta.",
  "3. Hashing de claves: Las contraseñas nunca deben guardarse en texto plano; se usa bcrypt o Argon2 con salt.",
  "4. Tokens JWT (JSON Web Tokens): Estándar abierto para la transmisión segura de información entre partes como un objeto JSON.",
  "5. Estructura del JWT: Se compone de tres partes separadas por puntos: Header, Payload y Signature.",
  "6. Stateless vs Stateful: Los JWT permiten autenticación sin estado en el servidor; el servidor confía en la firma criptográfica.",
  "7. Expiración de tokens (TTL): Los tokens de acceso deben tener una vida corta (ej. 15 minutos) para minimizar riesgos.",
  "8. Refresh Tokens: Credenciales de larga duración utilizadas exclusivamente para solicitar nuevos tokens de acceso.",
  "9. Vulnerabilidad XSS (Cross-Site Scripting): Ocurre cuando se inyecta código malicioso que puede robar datos de localStorage.",
  "10. Protección HttpOnly: Las cookies marcadas como HttpOnly no pueden ser leídas por JavaScript del cliente, mitigando XSS.",
  "11. Vulnerabilidad CSRF: Ataque que fuerza a un usuario autenticado a ejecutar acciones no deseadas en una aplicación web.",
  "12. CORS (Cross-Origin Resource Sharing): Mecanismo de seguridad que restringe qué dominios pueden consumir tu API.",
  "13. Principio de Menor Privilegio: Los usuarios y roles (ej. requester vs agent) solo deben tener acceso a lo estrictamente necesario.",
  "14. Autenticación de Dos Factores (2FA/MFA): Añade una capa extra de seguridad solicitando un segundo código temporal.",
  "15. OAuth 2.0: Protocolo de autorización que permite a aplicaciones terceras obtener acceso limitado a un servicio.",
  "16. OpenID Connect (OIDC): Capa de identidad construida sobre OAuth 2.0 enfocada en la autenticación.",
  "17. Rate Limiting: Técnica para limitar el número de peticiones por IP para evitar ataques de denegación de servicio (DoS).",
  "18. Cabeceras de seguridad HTTP: Uso de HSTS, CSP y X-Frame-Options para blindar el navegador del usuario.",
  "19. Revocación de sesiones: Complejidad técnica en los JWT al ser sin estado; requiere listas negras o expiraciones rápidas.",
  "20. Auditoría e Historial: Registro cronológico (logs) de cambios de estado y accesos para trazabilidad forense."
];

// Inyectar teoría en el DOM de forma limpia
const theoryContainer = document.getElementById('theory-container');
if (theoryContainer) {
  theoryData.forEach(item => {
    const div = document.createElement('div');
    div.style.background = 'var(--bg)';
    div.style.padding = '0.6rem 0.8rem';
    div.style.borderRadius = '8px';
    div.style.border = '1px solid var(--border)';
    div.style.fontSize = '0.9rem';
    div.style.color = 'var(--muted)';
    div.textContent = item;
    theoryContainer.append(div);
  });
}

// --- 2. Interacción 1: Simulador de JWT ---
const generateJwtBtn = document.getElementById('generate-jwt-btn');
if (generateJwtBtn) {
  generateJwtBtn.addEventListener('click', () => {
    const user = document.getElementById('jwt-user').value || 'usuario';
    const role = document.getElementById('jwt-role').value || 'requester';
    
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ sub: user, role: role, iat: Date.now() }));
    const fakeSignature = btoa("firma_secreta_ficticia_segura");
    
    const tokenSimulado = `${header}.${payload}.${fakeSignature}`;
    document.getElementById('jwt-output').textContent = tokenSimulado;
  });
}

// --- 3. Interacción 2: Validador de Passphrase ---
const passInput = document.getElementById('pass-input');
const passFeedback = document.getElementById('pass-feedback');
if (passInput) {
  passInput.addEventListener('input', (e) => {
    const val = e.target.value;
    if (val.length === 0) {
      passFeedback.textContent = '—';
      passFeedback.style.color = 'var(--muted)';
    } else if (val.length < 15) {
      passFeedback.textContent = `Insuficiente: ${val.length}/15 caracteres requeridos.`;
      passFeedback.style.color = 'var(--red)';
    } else {
      passFeedback.textContent = `¡Excelente! Cumple con la normativa de seguridad (${val.length} caracteres).`;
      passFeedback.style.color = 'var(--green)';
    }
  });
}

// --- 4. Interacción 3: Banco de Preguntas Dinámico (Quiz) ---
const quizQuestions = [
  {
    q: "¿Dónde se recomienda almacenar un token JWT en aplicaciones de alta seguridad para mitigar ataques XSS?",
    options: [
      { text: "En localStorage de forma permanente", correct: false },
      { text: "En memoria o en cookies HttpOnly seguras", correct: true },
      { text: "En una variable global sin cifrar", correct: false }
    ]
  },
  {
    q: "¿Cuál es la longitud mínima recomendada hoy en día para una contraseña o passphrase segura?",
    options: [
      { text: "Al menos 6 caracteres", correct: false },
      { text: "Exactamente 8 caracteres con un número", correct: false },
      { text: "Mínimo 15 caracteres para evitar fuerza bruta", correct: true }
    ]
  },
  {
    q: "¿Qué componente de un JSON Web Token (JWT) contiene los datos del usuario (claims)?",
    options: [
      { text: "El Header", correct: false },
      { text: "El Payload", correct: true },
      { text: "La Signature", correct: false }
    ]
  },
  {
    q: "¿Qué mecanismo de seguridad en el navegador previene que scripts maliciosos de terceros lean cookies sensibles?",
    options: [
      { text: "La bandera HttpOnly", correct: true },
      { text: "El modo incógnito", correct: false },
      { text: "Limpiar la caché del navegador", correct: false }
    ]
  },
  {
    q: "En el control de accesos, ¿qué diferencia principal existe entre autenticación y autorización?",
    options: [
      { text: "Son exactamente lo mismo", correct: false },
      { text: "La autenticación valida quién eres y la autorización qué puedes hacer", correct: true },
      { text: "La autorización valida tu contraseña y la autenticación tu rol", correct: false }
    ]
  }
];

let currentQuestionIndex = Math.floor(Math.random() * quizQuestions.length);

function loadQuizQuestion() {
  const qData = quizQuestions[currentQuestionIndex];
  const questionEl = document.getElementById('quiz-question');
  const optionsContainer = document.getElementById('quiz-options-container');
  const quizResult = document.getElementById('quiz-result');
  
  if (!questionEl || !optionsContainer) return;

  questionEl.textContent = qData.q;
  optionsContainer.innerHTML = '';
  quizResult.textContent = '';

  qData.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quiz-option';
    btn.style.width = '100%';
    btn.style.textAlign = 'left';
    btn.textContent = opt.text;
    
    btn.addEventListener('click', () => {
      if (opt.correct) {
        quizResult.textContent = '¡Correcto! Excelente respuesta.';
        quizResult.style.color = 'var(--green)';
        // Cambiar a otra pregunta aleatoria después de 2 segundos para que sea dinámico
        setTimeout(() => {
          currentQuestionIndex = (currentQuestionIndex + 1) % quizQuestions.length;
          loadQuizQuestion();
        }, 2500);
      } else {
        quizResult.textContent = 'Incorrecto. Inténtalo de nuevo.';
        quizResult.style.color = 'var(--red)';
      }
    });

    optionsContainer.append(btn);
  });
}

// Modificar ligeramente el index.html para soportar el contenedor de opciones dinámicas si es necesario, 
// o inyectarlo aquí. Aseguremos que el contenedor exista:
const quizSection = document.getElementById('quiz-question')?.parentElement;
if (quizSection && !document.getElementById('quiz-options-container')) {
  const optionsDiv = document.createElement('div');
  optionsDiv.id = 'quiz-options-container';
  optionsDiv.style.display = 'grid';
  optionsDiv.style.gap = '0.5rem';
  // Reemplazar los botones estáticos anteriores por este contenedor dinámico
  const oldButtonsGrid = quizSection.querySelector('div[style*="display: grid"]');
  if (oldButtonsGrid) {
    oldButtonsGrid.replaceWith(optionsDiv);
  }
}

// Cargar la primera pregunta al abrir
loadQuizQuestion(); 