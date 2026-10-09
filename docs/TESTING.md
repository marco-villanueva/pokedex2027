# TESTING

## Estrategia

La suite debe proteger comportamiento real, no detalles internos.

## Pirámide

### Unit

Para:

- mappers;
- parsers;
- formatters;
- type calculations;
- local persistence;
- evolution tree transformation.

### Component

Para:

- SearchField;
- Filter controls;
- PokemonCard;
- StatBar;
- Team interactions;
- Compare selectors.

### Integration

Para:

- Explorer + queries;
- filters + URL;
- Detail composition;
- evolution loading;
- favorites persistence.

### E2E

Playwright para flujos críticos.

## Fixtures

Mantener fixtures pequeñas.

Pokémon recomendados para casos:

- Bulbasaur: tipos dobles y cadena simple;
- Pikachu: popular y evolución;
- Eevee: cadena ramificada;
- Charizard: hero visual;
- Ditto: caso particular;
- Pokémon legendary/mythical;
- Pokémon sin determinados sprites.

No depender únicamente de estos nombres si la API evoluciona.

## API mocks

Los tests automáticos no deben depender siempre de red real.

Usar mocking de fetch/MSW o estrategia equivalente.

Debe existir un pequeño grupo opcional de smoke tests contra PokéAPI real, fuera de la suite crítica.

## Unit tests obligatorios

- `mapPokemonDetails`;
- unidades de height/weight;
- artwork fallback;
- species localization;
- evolution mapper;
- team persistence versioning.

## Explorer E2E

Flujo:

1. abrir `/pokedex`;
2. buscar;
3. filtrar tipo;
4. comprobar URL;
5. abrir Pokémon;
6. volver;
7. preservar estado razonable.

## Detail E2E

- render;
- shiny;
- previous/next;
- evolution link;
- error 404.

## Compare E2E

- seleccionar izquierda;
- seleccionar derecha;
- URL;
- reload;
- misma comparación.

## Team E2E

- añadir;
- máximo seis;
- quitar;
- reload;
- persistencia.

## Error hygiene / resilience E2E (`e2e/outage.spec.ts`)

Con todo el tráfico a PokéAPI abortado:

- explorer y dossier muestran estados de error recuperables con retry;
- ningún mensaje expone URLs crudas, payloads ni stack traces (§39).

## Cross-tab sync E2E (`e2e/collections.spec.ts`)

- un toggle de favorito en una pestaña se refleja en otra abierta sin recarga
  (storage event → estado); persistencia versionada y malformaciones seguras.

## Accessibility tests

- roles;
- focus;
- teclado;
- axe;
- reduced motion smoke.

## Visual regression

Puede añadirse en RC7/RC8.

Prioridad:

- PokemonCard;
- detail hero;
- evolution;
- compare;
- mobile.

## CI

Pipeline mínimo:

```text
install
typecheck
lint
unit/component
build
e2e
```

E2E puede separarse si coste es alto.

## Regla

No escribir tests frágiles ligados a clases CSS o estructura accidental si existen roles, labels o comportamiento observable.
