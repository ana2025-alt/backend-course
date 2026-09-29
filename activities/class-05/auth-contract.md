
# Contrato de autenticación — Request API v5

**Cómo llenar:** cada endpoint es una ficha; los campos pendientes están marcados con tres guiones bajos. Reemplaza cada marca con tu decisión; en los bloques de código escribe la respuesta completa.

### Ficha de ejemplo (endpoint inventado, solo para ver el formato)

| Campo | Decisión |
| --- | --- |
| ¿Público o protegido? | Protegido (Bearer) |
| Body permitido | ninguno |

Respuesta de éxito:

```http
200 OK

{ "status": "brewing" }

```

Errores:

| Situación | HTTP | error.code |
| --- | --- | --- |
| La tetera está ocupada | 418 | TEAPOT_BUSY |

---

## POST /auth/register

| Campo | Decisión |
| --- | --- |
| ¿Público o protegido? | Público |
| Campos permitidos en el body | email, password |
| Campos que producen rechazo explícito | role, id, createdAt, createdBy, passwordHash |
| Reglas del email | String con formato email válido, trim y en minúsculas |
| Reglas de la password | String de 15 a 128 caracteres, permite espacios y caracteres Unicode |

Respuesta de éxito (código + body con TODOS sus campos):

```http
201 Created

{
  "id": 1,
  "email": "usuario@ejemplo.com",
  "role": "requester",
  "createdAt": "2026-09-14T12:00:00.000Z"
}

```

Errores:

| Situación | HTTP | error.code |
| --- | --- | --- |
| Campo controlado por el servidor en el body | 400 | SERVER_CONTROLLED_FIELD |
| Email inválido | 400 | INVALID_EMAIL |
| Password fuera de las reglas | 400 | INVALID_PASSWORD |
| Email ya registrado | 409 | ACCOUNT_CANNOT_BE_CREATED |

## POST /auth/login

| Campo | Decisión |
| --- | --- |
| ¿Público o protegido? | Público |
| Body permitido | email, password |

Respuesta de éxito (código + body: el token y sus dos acompañantes):

```http
200 OK

{
  "accessToken": "ey...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}

```

Errores — atención: las tres filas deben tener EXACTAMENTE la misma respuesta.

¿Por qué?: Prevenir ataques de enumeración de usuarios y no revelar si una cuenta existe en el sistema.

| Situación | HTTP | error.code |
| --- | --- | --- |
| Email inexistente | 401 | INVALID_CREDENTIALS |
| Password incorrecta | 401 | INVALID_CREDENTIALS |
| Cuenta no disponible | 401 | INVALID_CREDENTIALS |

## GET /auth/me

| Campo | Decisión |
| --- | --- |
| ¿Público o protegido? | Protegido (Bearer) |
| Qué devuelve | id, email, role |
| Qué JAMÁS devuelve | password, passwordHash, salt |

Respuesta de éxito:

```http
200 OK

{
  "id": 1,
  "email": "usuario@ejemplo.com",
  "role": "requester"
}

```

Errores:

| Situación | HTTP | error.code |
| --- | --- | --- |
| Sin header Authorization o sin esquema Bearer | 401 | AUTHENTICATION_REQUIRED |
| Token inválido, alterado o expirado | 401 | INVALID_TOKEN |

## Semántica de errores (el criterio, no solo ejemplos)

| Frase | Código HTTP | ¿Cuándo lo usas en esta API? |
| --- | --- | --- |
| "No sé quién eres" | 401 | Petición a endpoint protegido sin Bearer token, token inválido o expirado, o credenciales erróneas en login |
| "Sé quién eres; esto no" | 403 | El usuario está autenticado válidamente pero su rol carece de permisos para la acción solicitada |
| "Para ti, no existe" | 404 | Recurso no existente o solicitud que pertenece a otro requester para prevenir filtración de existencia |
| "Existe, pero choca" | 409 | Conflicto de estado como duplicado de email en registro o transición de estado no permitida en la máquina de estados |

---

