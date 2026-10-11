# Documentación — Semana 3: Functional Proof

**Proyecto:** GENUINA — Trazabilidad y autenticidad de la esmeralda colombiana

---

## Front construido

El front vive en `frontend/` (fuera de `docs/`) y es una aplicación web de una sola página (Vite + React) con tres pantallas, una por cada paso que el equipo decidió construir de forma real en el recorte del MVP definido en el Product Blueprint (`docs/semana2/ProductBlueprint.md`, sección "Flujo real que va a construir el equipo"). Las tres pantallas operan directamente contra **Stellar Testnet** usando `@stellar/stellar-sdk`; no hay backend propio ni base de datos: todo lo que se ve se lee o se escribe en la red.

**1. Emitir pasaporte digital (`/`)**
Corresponde al paso 1 del flujo recortado del Blueprint: "El equipo carga los datos de una esmeralda de ejemplo (...) y emite el activo en Stellar Testnet". El formulario pide peso (campo libre, en quilates), corte, tono y claridad (los tres como listas desplegables con categorías gemológicas estándar, para que el dato quede consistente entre gemas) y un hash de ejemplo del "jardín" óptico (campo libre, simulando el resultado de un escaneo real). Al enviarlo, la aplicación:

- Genera un código de activo único de hasta 12 caracteres (ej. `ESMFRRJI`).
- Crea y fondea (vía Friendbot) una cuenta Testnet para el laboratorio emisor.
- Crea y fondea una segunda cuenta Testnet que representa al primer poseedor (el minero).
- Establece la línea de confianza (`changeTrust`) del minero hacia el activo.
- Emite el activo con una operación de pago de 1 unidad del emisor al minero.

El resultado (código del activo y llave pública del emisor) se muestra en pantalla y queda guardado en el `localStorage` del navegador para que el equipo pueda seguir operando esa gema en las otras dos pantallas, igual que un identificador que en el producto final iría en un código QR.

**2. Registrar paso de custodia (`/custodia`)**
Corresponde al paso 2 del flujo recortado: "El equipo simula (...) las transacciones de transferencia de custodia (minero → taller → comercializador)". La pantalla lista las gemas ya emitidas (leídas de `localStorage`), muestra quién tiene la custodia actual y ofrece un botón para avanzar al siguiente rol de la cadena. Cada clic:

- Crea y fondea una cuenta Testnet nueva para el siguiente poseedor.
- Establece su línea de confianza hacia el activo.
- Firma, con la llave del poseedor actual, un pago de 1 unidad hacia la cuenta nueva.

Esto deja un historial real de transacciones en Stellar Testnet, no una simulación en memoria.

**3. Verificar esmeralda (`/verificar`)**
Corresponde al paso 3, el único que según el Blueprint debe funcionar "sin intervención del equipo": la consulta pública. El usuario elige el identificador de la gema (en el MVP, desde una lista — en el producto final sería el resultado de escanear el QR de la joya) y la aplicación consulta Horizon (el API de lectura de Stellar) pidiendo los pagos de las cuentas involucradas, filtra los que corresponden a ese activo y arma una tabla cronológica con fecha, cuenta de origen, cuenta de destino y un enlace al explorador público (`stellar.expert`) para cada transacción. Ninguno de esos datos sale de `localStorage`: solo el identificador de qué consultar sale de ahí, igual que un código QR solo apunta a un identificador y no contiene el historial en sí.

**Cómo correrlo:** ver `README.md` en la raíz del repositorio. En local, el flujo completo (emitir → registrar dos pasos de custodia → verificar) se probó de punta a punta contra Stellar Testnet y las tres transacciones quedaron confirmadas y visibles en la pantalla de verificación.

---

## Decisión técnica

**Opción elegida: B — Solución existente del ecosistema (Stellar Classic, sin contrato propio).**

El equipo usará los **activos nativos de Stellar** (un asset único por esmeralda, emitido con una operación de pago desde la cuenta del laboratorio) junto con **Horizon** como API de lectura pública, sin escribir ni desplegar un contrato Soroban propio esta semana.

Esta decisión no es nueva: ya se había justificado en el Product Blueprint de la semana 2, en la sección "Uso de Stellar y justificación". Stellar permite emitir activos de forma nativa, cada transferencia de custodia queda como una transacción de pago firmada públicamente, y las cuentas del emisor pueden protegerse con **multi-firma nativa del protocolo**, sin necesidad de programar esa lógica. Dado que el equipo tiene pocas semanas de desarrollo, evitar escribir y auditar un contrato propio para algo que el protocolo ya resuelve de forma nativa reduce el riesgo técnico del proyecto sin sacrificar lo que importa: que el registro de cada gema sea público, verificable e inmutable en una red real.

**Qué se descartó:** la opción A, un contrato propio (en Soroban), porque la lógica que necesita GENUINA en este MVP —un identificador único por gema y una cadena de transferencias trazable— no requiere reglas de negocio personalizadas que los activos nativos no puedan expresar. Un contrato propio tendría sentido más adelante si el producto necesitara, por ejemplo, reglas de transferencia condicionadas (que solo un comercializador verificado pueda recibir la custodia) o lógica de multi-firma más compleja entre varios actores simultáneos; eso queda fuera del alcance de esta semana y se evaluará si hace falta en semana 4, aprovechando la sesión del equipo sobre cómo armar contratos en Soroban.

---

## Participación del equipo

| Integrante | Usuario de GitHub | Aporte en este entregable |
| --- | --- | --- |
| Giovanny Agudelo | [GioAgudelo](https://github.com/GioAgudelo) | Scaffold del frontend (Vite + React), integración con `@stellar/stellar-sdk`, implementación de las tres pantallas (emisión, custodia, verificación), pruebas end-to-end contra Stellar Testnet y esta documentación. |
| Manuel Quintero | [Mluz1123](https://github.com/Mluz1123) | Sin aportes ni commits en esta entrega. El repositorio sigue abierto para que sume cambios en cualquier momento. |

---

## Bloqueos y siguiente paso

- Las llaves de todas las cuentas Testnet (emisor y cada poseedor) se guardan en el `localStorage` del navegador del equipo, porque en este recorte del MVP es el equipo quien opera todas las transacciones y no cada actor por separado. Esto es válido **solo para Testnet y solo para esta prueba de concepto**; no debe usarse así en producción.
- El front todavía no está hospedado (ej. en Vercel); por ahora se corre en local siguiendo el `README.md`. Siguiente paso: desplegarlo y dejar el enlace en el campo "Website" de Apex.
- El hash del "jardín" óptico sigue siendo un dato de ejemplo cargado a mano, como ya estaba definido en el alcance del MVP del Blueprint; no hay escaneo real todavía.
- El tablero Kanban del backlog priorizado sigue pendiente (ya estaba marcado como pendiente en el Product Blueprint de la semana 2).
- Próximo paso hacia el MVP: con la decisión técnica ya tomada (Opción B), la semana 4 es para reforzar la cuenta emisora con multi-firma real y, si el equipo lo considera necesario tras la sesión de Soroban, evaluar si algún paso del flujo sí requiere lógica de contrato propio.
