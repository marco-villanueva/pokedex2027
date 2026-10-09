# MOTION AND 3D

## Objetivo

Usar movimiento y profundidad para reforzar la experiencia sin perjudicar rendimiento, accesibilidad o legibilidad.

> Nota V1 (D-019): toda la motion actual es CSS puro (`px-enter`, tilt por
> custom properties, retículas, transiciones de tokens). Motion y
> Three.js/R3F se desinstalaron al no aportar valor medido; se reintroducen
> solo ante springs/gestos o una escena 3D real.

## Capas de tecnología

### CSS

Primera opción para:

- hover;
- transforms;
- opacity;
- masks;
- gradients;
- foil;
- parallax simple;
- transitions;
- perspective;
- scroll effects simples.

### Motion

Usar para:

- entrada/salida;
- shared layout;
- orchestration;
- springs;
- gestures;
- transiciones de componentes;
- cambios de estado coordinados.

### React Three Fiber / Three.js

Reservar para:

- scanner 3D;
- geometría espacial;
- partículas;
- iluminación;
- anillos;
- hologramas;
- ambient worlds;
- data visualization tridimensional con una razón clara.

## Regla 3D

El Pokémon puede ser artwork 2D situado en un espacio tridimensional.

No es requisito tener un modelo 3D real.

## PokemonCard

Efectos posibles:

- tilt por pointer;
- specular highlight;
- foil;
- artwork con profundidad;
- sombras ópticas;
- borde reactivo.

Implementación:

- preferir CSS custom properties actualizadas directamente;
- evitar `setState` por cada movimiento del puntero;
- deshabilitar o reducir en touch;
- respetar reduced motion.

## Hero Scanner

Elementos sugeridos:

- plano de artwork;
- anillo principal;
- anillos secundarios;
- grid;
- partículas;
- luz contextual;
- labels DOM alrededor.

No colocar contenido textual esencial dentro del canvas.

## Partículas

Reglas:

- cantidad adaptativa;
- evitar overdraw innecesario;
- pausar fuera de viewport;
- reducir en dispositivos modestos;
- eliminar con reduced motion si distraen.

## DPR

Limitar device pixel ratio del canvas.

No renderizar automáticamente a DPR extremo.

## Postprocessing

Usar con mucha cautela.

Permitidos si hay presupuesto:

- bloom sutil;
- chromatic aberration ligera en Ghost/Psychic;
- depth effects moderados.

Evitar pipelines pesados por defecto.

## View Transitions

Candidatos:

- Card -> Detail;
- artwork;
- nombre;
- número;
- hero image.

Debe existir fallback convencional.

## Scroll-driven animations

Usar para:

- revelar telemetría;
- mover capas de fondo;
- evolución;
- transiciones de secciones.

No bloquear el scroll.

> Estado V1-backlog (D-022): implementado en `scroll-reveals.css` —
> reveals de entrada para cards del explorer y paneles del dossier +
> parallax contenido del chamber, todo tras
> `@supports (animation-timeline: view())` con contenido visible por
> defecto. El reveal es solo `transform` (nunca opacity) para que el
> contraste AA sea invariante durante el vuelo; kill con
> `prefers-reduced-motion`.

## Reduced motion

Cuando `prefers-reduced-motion: reduce`:

- eliminar boot animation;
- eliminar tilt reactivo;
- desactivar loops decorativos;
- reducir partículas;
- usar fades mínimos;
- mantener transiciones instantáneas o cortas.

## Mobile

Evitar efectos dependientes de cursor.

Usar:

- scroll;
- touch;
- tap;
- orientación solamente si existe un caso claro y permiso apropiado.

## Budget conceptual

Un efecto visual entra si:

1. mejora la experiencia;
2. no afecta interacción;
3. mantiene FPS razonables;
4. tiene fallback;
5. no duplica otro efecto.

## Anti-patrones

- canvas full-screen en todas las rutas;
- partículas constantes en todo momento;
- bloom agresivo;
- blur masivo;
- 3D para botones comunes;
- texto dentro de WebGL;
- animaciones infinitas en múltiples componentes;
- motion que retrasa la navegación.
