const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

let accessToken = null;
let currentUser = null;

async function api(method, path, body) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
    const text = await response.text();
    let parsed = null;
    try { parsed = text ? JSON.parse(text) : null; } catch { /* no-json */ }
    return { status: response.status, body: parsed };
  } catch {
    return { status: 0, body: null };
  }
}

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authFeedback = document.getElementById('auth-feedback');
const registerFeedback = document.getElementById('register-feedback');
const authPanel = document.getElementById('auth-panel');

const requestsPanel = document.getElementById('requests-panel');
const requestsState = document.getElementById('requests-state');
const requestsList = document.getElementById('requests-list');
const createRequestSection = document.getElementById('create-request-section');
const createRequestForm = document.getElementById('create-request-form');
const createFeedback = document.getElementById('create-feedback');

const detailPanel = document.getElementById('detail-panel');
const editRequestForm = document.getElementById('edit-request-form');
const editFeedback = document.getElementById('edit-feedback');
const historyList = document.getElementById('history-list');

const sessionUser = document.getElementById('session-user');
const logoutBtn = document.getElementById('logout-btn');
const backToListBtn = document.getElementById('back-to-list-btn');

function setFeedback(element, message, kind) {
  element.textContent = message;
  element.className = `feedback${kind ? ` is-${kind}` : ''}`;
}

function describeError(status, body) {
  if (status === 0) return 'No se pudo contactar al backend. ¿Está encendido? ¿CORS?';
  if (status === 400) return 'Datos inválidos. Revisa los campos enviados.';
  if (status === 401) return body?.error?.code === 'INVALID_CREDENTIALS' ? 'Credenciales incorrectas.' : 'Sesión inválida o expirada.';
  if (status === 403) return 'Operación denegada. No tienes permisos.';
  if (status === 404) return 'Recurso inexistente o privado.';
  if (status === 409) return body?.error?.message ?? 'Conflicto.';
  if (status >= 500) return 'Error interno del servidor.';
  return body?.error?.message ?? 'Error inesperado.';
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setFeedback(authFeedback, 'Entrando...', '');
  
  const data = new FormData(loginForm);
  const login = await api('POST', '/auth/login', Object.fromEntries(data));
  
  if (login.status !== 200) {
    return setFeedback(authFeedback, describeError(login.status, login.body), 'error');
  }
  
  accessToken = login.body.accessToken;
  const me = await api('GET', '/auth/me');
  
  if (me.status !== 200) {
    accessToken = null;
    return setFeedback(authFeedback, describeError(me.status, me.body), 'error');
  }
  
  currentUser = me.body;
  iniciarSesionUI();
});

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setFeedback(registerFeedback, 'Registrando...', '');
  
  const data = new FormData(registerForm);
  const register = await api('POST', '/auth/register', Object.fromEntries(data));
  
  if (register.status !== 201) {
    return setFeedback(registerFeedback, describeError(register.status, register.body), 'error');
  }
  
  setFeedback(registerFeedback, '¡Registro exitoso! Ahora puedes iniciar sesión.', 'ok');
  registerForm.reset();
});

logoutBtn.addEventListener('click', () => {
  accessToken = null;
  currentUser = null;
  sessionUser.textContent = 'Sin sesión';
  logoutBtn.hidden = true;
  requestsPanel.hidden = true;
  detailPanel.hidden = true;
  authPanel.hidden = false;
});

function iniciarSesionUI() {
  sessionUser.textContent = `${currentUser.email} (${currentUser.role})`;
  logoutBtn.hidden = false;
  authPanel.hidden = true;
  detailPanel.hidden = true;
  requestsPanel.hidden = false;
  
  if (currentUser.role === 'agent') {
    createRequestSection.hidden = true;
  } else {
    createRequestSection.hidden = false;
  }
  
  setFeedback(authFeedback, '');
  loadRequests();
}

async function loadRequests() {
  setFeedback(requestsState, 'Cargando solicitudes...', '');
  requestsList.replaceChildren();

  const result = await api('GET', '/requests');
  if (result.status !== 200) {
    return setFeedback(requestsState, describeError(result.status, result.body), 'error');
  }

  if (result.body.length === 0) {
    return setFeedback(requestsState, 'No hay solicitudes.');
  }

  setFeedback(requestsState, `${result.body.length} solicitud(es) encontrada(s).`, 'ok');
  
  result.body.forEach(request => {
    const item = document.createElement('li');
    item.className = 'clickable-request';
    item.innerHTML = `<strong>#${request.id}</strong> ${request.title} <span class="badge">[${request.status}]</span>`;
    item.addEventListener('click', () => loadRequestDetail(request.id));
    requestsList.append(item);
  });
}

createRequestForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setFeedback(createFeedback, 'Creando...', '');
  
  const data = new FormData(createRequestForm);
  const result = await api('POST', '/requests', Object.fromEntries(data));
  
  if (result.status !== 201) {
    return setFeedback(createFeedback, describeError(result.status, result.body), 'error');
  }
  
  setFeedback(createFeedback, 'Solicitud creada con éxito.', 'ok');
  createRequestForm.reset();
  loadRequests();
});

backToListBtn.addEventListener('click', () => {
  detailPanel.hidden = true;
  requestsPanel.hidden = false;
});

async function loadRequestDetail(id) {
  requestsPanel.hidden = true;
  detailPanel.hidden = false;
  setFeedback(editFeedback, 'Cargando detalle...', '');
  historyList.replaceChildren();

  const reqResult = await api('GET', `/requests/${id}`);
  const historyResult = await api('GET', `/requests/${id}/history`);

  if (reqResult.status !== 200) {
    return setFeedback(editFeedback, describeError(reqResult.status, reqResult.body), 'error');
  }

  const request = reqResult.body;
  document.getElementById('detail-title').textContent = `Solicitud #${request.id}`;
  document.getElementById('edit-id').value = request.id;
  
  document.getElementById('edit-title').value = request.title;
  document.getElementById('edit-description').value = request.description;
  document.getElementById('edit-priority').value = request.priority;
  document.getElementById('edit-status').value = request.status;

  const isAgent = currentUser.role === 'agent';
  const isOpen = request.status === 'open';

  document.getElementById('requester-fields').disabled = isAgent || !isOpen;
  document.getElementById('agent-fields').disabled = !isAgent;
  document.getElementById('save-changes-btn').hidden = (!isAgent && !isOpen);

  setFeedback(editFeedback, '');

  if (historyResult.status === 200 && historyResult.body.length > 0) {
    historyResult.body.forEach(log => {
      const li = document.createElement('li');
      const rawDate = log.created_at || log.createdAt;
      const formattedDate = rawDate ? new Date(rawDate).toLocaleString() : 'Fecha reciente';
      const statusText = log.status || 'estado actualizado';
      const actorText = log.changed_by || log.changedBy || 'sistema';

      li.textContent = `[${formattedDate}] Cambio a ${statusText} (Actor: ${actorText})`;
      historyList.append(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'Sin historial registrado todavía.';
    historyList.append(li);
  }
}

editRequestForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setFeedback(editFeedback, 'Guardando...', '');
  
  const id = document.getElementById('edit-id').value;
  const isAgent = currentUser.role === 'agent';
  
  const body = isAgent 
    ? { 
        priority: document.getElementById('edit-priority').value, 
        status: document.getElementById('edit-status').value 
      }
    : { 
        title: document.getElementById('edit-title').value, 
        description: document.getElementById('edit-description').value 
      };

  const result = await api('PATCH', `/requests/${id}`, body);

  if (result.status !== 200) {
    return setFeedback(editFeedback, describeError(result.status, result.body), 'error');
  }

  setFeedback(editFeedback, 'Cambios guardados con éxito.', 'ok');
  loadRequestDetail(id);
}); 