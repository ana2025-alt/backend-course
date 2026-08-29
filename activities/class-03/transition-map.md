# Mapa de Transiciones de Estado — Request API

## 1. Diagrama Conceptual de Estados

```text
       ┌──────────────┐
       │     open     │ (Estado Inicial)
       └──┬────────┬──┘
          │        │
          ▼        ▼
┌──────────────┐ ┌──────────────┐
│ in-progress  │ │  cancelled   │ (Terminal)
└──┬────────┬──┘ └──────────────┘
   │        │
   ▼        ▼
┌──────────────┐ ┌──────────────┐
│   resolved   │ │  cancelled   │ (Terminal)
└──────────────┘ └──────────────┘
   (Terminal) 

   Estado Actual,Transición hacia open,Transición hacia in-progress,Transición hacia resolved,Transición hacia cancelled
open,Inválida (mismo estado),Válida,Inválida (no salta etapas),Válida
in-progress,Inválida (no retrocede),Inválida (mismo estado),Válida,Válida
resolved (Terminal),Inválida,Inválida,Inválida,Inválida
cancelled (Terminal),Inválida,Inválida,Inválida,Inválida



3. Estados Terminales y Justificación
resolved: La avería fue resuelta. No tiene sentido reabrirla ni modificar su descripción/título original; si vuelve a fallar, corresponde emitir un nuevo ticket para trazabilidad.

cancelled: La solicitud fue anulada por error o duplicado. No admite modificaciones posteriores para preservar la auditoría.

Respuesta ante intento de cambio: Cualquier intento de mutar un estado terminal o ejecutar una transición no permitida debe responder HTTP 409 Conflict con código de error REQUEST_IN_TERMINAL_STATUS o INVALID_STATUS_TRANSITION.