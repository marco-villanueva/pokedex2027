# ACCESSIBILITY

## Objetivo

La identidad visual no puede depender de excluir usuarios.

## Semántica

Usar HTML semántico:

- header;
- nav;
- main;
- section;
- article;
- button;
- form;
- input;
- list cuando corresponda.

No recrear controles mediante `div`.

## Teclado

Todos los flujos críticos deben ser accesibles mediante teclado.

Validar:

- Tab;
- Shift+Tab;
- Enter;
- Space;
- Escape;
- flechas cuando exista patrón apropiado.

## Focus

`focus-visible` debe ser claro.

No remover outline sin reemplazo.

## Motion

Respetar:

```css
@media (prefers-reduced-motion: reduce) { ... }
```

Reducir:

- parallax;
- tilt;
- partículas;
- loops;
- boot animations;
- transiciones complejas.

## Color

No comunicar:

- tipo;
- estado;
- error;
- selección;

solo mediante color.

Añadir texto, iconos o patrones.

## Contraste

Mantener contraste suficiente en:

- texto;
- controles;
- labels;
- focus;
- selected states.

Los temas por tipo deben conservar contraste.

## Images

Artwork:

- alt útil;
- evitar redundancia cuando imagen sea decorativa.

Sprites de galería deben tener nombre o contexto.

## Canvas

Canvas 3D es decorativo o complementario.

La información esencial debe estar en DOM.

Cuando el canvas sea decorativo:

- ocultarlo de accessibility tree cuando corresponda.

## Cards

Una card no debe contener múltiples acciones ambiguas dentro de un único enlace sin estructura clara.

Preferir:

- enlace principal;
- acciones auxiliares independientes;
- foco visible.

## Filters

Filtros deben:

- tener nombre;
- indicar estado;
- ser limpiables;
- anunciar cantidad de resultados cuando sea útil.

## Search

- label accesible;
- clear button accesible;
- mensajes de no resultados;
- evitar actualizaciones excesivamente verbosas en screen reader.

## Stats

Las barras necesitan valor textual.

Ejemplo:

```text
Attack: 84
```

La longitud visual es secundaria.

## Evolution tree

Debe tener representación lógica navegable.

El árbol gráfico no puede ser la única forma de entender la evolución.

## Compare

Orden de lectura coherente en DOM.

No depender de posición visual absoluta para comprensión.

## Mobile

Touch targets suficientemente grandes.

No depender de hover.

## Testing

Incluir:

- axe cuando sea viable;
- tests de roles;
- keyboard flows;
- Playwright.

## Objetivo

Lighthouse Accessibility >= 95 y cero problemas críticos conocidos antes de release.
