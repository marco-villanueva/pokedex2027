# ARCHITECTURE

## Objetivo

Mantener una arquitectura frontend clara, predecible y suficientemente flexible para crecer durante varios RC.

## Principios

- dominio separado de transporte;
- componentes visuales sin conocimiento de DTOs de PokéAPI;
- server state gestionado por TanStack Query;
- URL state para búsqueda, filtros y navegación compartible;
- local storage únicamente para persistencia local legítima;
- lazy loading por ruta y por escena pesada;
- feature-first para lógica de producto;
- UI reutilizable sin sobreabstracción.

## Estructura sugerida

> Estado V1: la estructura real sigue este mapa con tres divergencias
> aplicadas — `domain/generation/` vive como `domain/explorer/generations.ts`;
> `features/search/` + `features/filters/` se consolidaron en
> `features/pokedex/`; `scenes/` y `components/data-viz/` no existen
> (D-019: sin WebGL en V1) y los tests van co-ubicados (`*.test.tsx`,
> `e2e/`).

```text
src/
├── app/
│   ├── router/
│   ├── providers/
│   ├── layout/
│   └── styles/
├── api/
│   └── pokeapi/
│       ├── client.ts
│       ├── endpoints/
│       ├── dto/
│       ├── mappers/
│       └── query-keys.ts
├── domain/
│   ├── pokemon/
│   ├── evolution/
│   ├── type/
│   └── generation/
├── features/
│   ├── pokedex/
│   ├── pokemon-details/
│   ├── search/
│   ├── filters/
│   ├── compare/
│   ├── favorites/
│   └── team-builder/
├── components/
│   ├── ui/
│   ├── motion/
│   └── data-viz/
├── scenes/
│   ├── pokemon-scanner/
│   ├── hologram/
│   └── ambient-world/
├── hooks/
├── lib/
├── assets/
└── tests/
```

## Capa API

Responsabilidades:

- base URL;
- fetch;
- abort signal;
- errores;
- DTO typing;
- caching headers cuando aplique;
- mappers.

No hacer:

- manipulación visual;
- acceso al DOM;
- lógica de componentes.

## Domain

Define estructuras estables utilizadas por la aplicación.

Ejemplos:

- `PokemonSummary`
- `PokemonDetails`
- `PokemonSpecies`
- `PokemonArtwork`
- `PokemonStat`
- `PokemonAbility`
- `EvolutionChain`
- `EvolutionNode`
- `PokemonType`
- `PokemonGeneration`

## Query layer

TanStack Query maneja:

- caché;
- loading;
- retry;
- deduplicación;
- prefetch;
- invalidación cuando sea necesaria;
- infinite queries.

### Query keys

Deben centralizarse.

Ejemplo conceptual:

```ts
pokemonKeys.all
pokemonKeys.list(filters)
pokemonKeys.detail(id)
pokemonKeys.species(id)
pokemonKeys.evolution(id)
```

## Router

El router representa estado navegable.

Ejemplos:

```text
/pokedex?type=fire&generation=1&sort=id
/pokemon/6
/compare?left=6&right=9
```

No guardar este estado exclusivamente en memoria.

## Estado local

Preferir:

1. component state;
2. URL;
3. TanStack Query;
4. Context;
5. Zustand si sigue existiendo un caso legítimo.

Casos plausibles para Zustand:

- estado coordinado de Team Builder;
- preferencias UI globales;
- paneles complejos desconectados del router.

No usar Zustand como caché de PokéAPI.

## Persistencia

Local Storage para:

- favoritos;
- team;
- preferencia reduced effects manual si se implementa;
- settings no sensibles.

Versionar payloads persistidos.

Ejemplo:

```json
{
  "version": 1,
  "favorites": [1, 6, 25]
}
```

## Errores

Definir una taxonomía simple:

- network;
- not found;
- rate/service error;
- malformed data;
- unknown.

Los errores deben mapearse a estados de UI comprensibles.

## Lazy loading

Separar:

- rutas;
- compare;
- evolution explorer;
- escenas 3D;
- componentes de visualización pesada.

El listado principal no debe cargar todo el stack 3D si todavía no es necesario.

## Boundary entre 2D y 3D

El 3D es una capa de presentación.

La información esencial debe existir en DOM.

Nunca hacer que el texto principal o controles esenciales existan solo dentro de canvas.

## Observabilidad local

Durante desarrollo:

- errores de console;
- React Profiler cuando sea necesario;
- Network panel;
- bundle visualizer;
- Lighthouse;
- Performance panel.

## Dependencias

Toda nueva dependencia debe justificar:

- problema real;
- coste de bundle;
- mantenimiento;
- alternativa nativa;
- compatibilidad.

Registrar decisiones relevantes en `DECISIONS.md`.
