# AGENTS.md

## Propósito

Este archivo define cómo debe trabajar cualquier agente automático dentro de Pokédex // 2027.

Todas las decisiones deben alinearse con la documentación de `docs/`.

## Orden de lectura obligatorio

Antes de modificar código:

1. leer `docs/PRODUCT.md`;
2. leer `docs/DESIGN_VISION.md`;
3. leer `docs/ROADMAP.md`;
4. leer `docs/PROGRESS.md`;
5. leer los documentos especializados relacionados con la tarea;
6. inspeccionar el código existente antes de diseñar una solución.

## Flujo de trabajo obligatorio

Para cada iteración:

1. identificar el RC activo;
2. identificar la tarea incompleta de mayor prioridad;
3. inspeccionar implementación existente;
4. formular una solución mínima que preserve la arquitectura;
5. implementar;
6. ejecutar typecheck;
7. ejecutar lint;
8. ejecutar tests relevantes;
9. ejecutar build;
10. inspeccionar visualmente cuando la tarea afecte UI;
11. comprobar desktop y mobile;
12. revisar consola y red;
13. corregir regresiones;
14. actualizar `docs/PROGRESS.md`;
15. actualizar `docs/DECISIONS.md` cuando exista una decisión arquitectónica, visual o de alcance.

## Reglas de implementación

- No reescribir módulos funcionales sin una razón concreta.
- No introducir dependencias para resolver problemas triviales.
- No crear abstracciones especulativas.
- No duplicar lógica de dominio.
- No consumir PokéAPI directamente desde componentes visuales.
- No guardar server state en Zustand.
- No usar `any` como solución rápida.
- No ignorar errores TypeScript.
- No silenciar warnings importantes.
- No añadir efectos visuales que perjudiquen legibilidad o FPS.
- No convertir cada interacción en animación.
- No usar WebGL donde CSS sea suficiente.
- No ejecutar renders de React por cada `pointermove`.
- No bloquear contenido esencial detrás de WebGL.
- No depender del hover para información crítica.
- No asumir mouse como única entrada.
- No romper `prefers-reduced-motion`.

## Regla visual

Una implementación funcional no se considera terminada si visualmente parece genérica.

Evitar especialmente:

- dashboard SaaS genérico;
- grid de tarjetas idénticas;
- exceso de bordes redondeados;
- glassmorphism indiscriminado;
- glow azul o morado aplicado a toda la aplicación;
- gradientes arbitrarios;
- animaciones sin función;
- iconografía inconsistente;
- sombras exageradas;
- exceso de texto decorativo;
- aspecto de plantilla de componentes.

Cada efecto debe responder a una de estas funciones:

- jerarquía;
- profundidad;
- feedback;
- orientación;
- relación espacial;
- identidad del tipo Pokémon;
- lectura de datos;
- transición entre estados.

## Regla de rendimiento

Objetivo: mantener una experiencia fluida en equipos de gama media.

Antes de incrementar complejidad visual:

1. comprobar coste;
2. usar CSS si es suficiente;
3. limitar DPR de canvas;
4. evitar postprocesado excesivo;
5. reducir partículas;
6. suspender animaciones fuera de viewport;
7. respetar reduced motion.

## Regla de alcance

El agente trabaja un RC a la vez.

No avanzar al siguiente RC hasta cumplir sus criterios de aceptación.

Las ideas nuevas se registran en `docs/DECISIONS.md` o como backlog, pero no interrumpen el RC activo salvo que resuelvan un bloqueo real.

## Regla de calidad

Nunca marcar una tarea como completa si existe alguno de estos problemas:

- error de TypeScript;
- error de lint;
- test roto;
- build roto;
- error de consola;
- fetch redundante evidente;
- layout roto;
- overflow horizontal;
- contraste crítico insuficiente;
- navegación por teclado bloqueada;
- animación esencial incompatible con reduced motion;
- URL no compartible cuando el estado debería estar en URL.

## Regla de documentación

Actualizar `docs/PROGRESS.md` al final de cada iteración.

Formato mínimo:

- RC activo;
- completado;
- en progreso;
- pendientes;
- problemas conocidos;
- siguiente acción recomendada.
