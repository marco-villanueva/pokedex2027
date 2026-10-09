# POKEAPI

## Fuente

API pública:

https://pokeapi.co/

Documentación:

https://pokeapi.co/docs/v2

## Regla general

Consumir PokéAPI exclusivamente a través de la capa `src/api/pokeapi`.

Los componentes no deben construir URLs de PokéAPI.

## Recursos principales

### Pokémon

`/api/v2/pokemon/{id or name}`

Usos:

- stats;
- types;
- abilities;
- height;
- weight;
- sprites;
- forms relacionadas;
- moves.

### Pokémon species

`/api/v2/pokemon-species/{id or name}`

Usos:

- flavor text;
- genus;
- generation;
- legendary;
- mythical;
- evolution chain;
- names localizados.

### Evolution chain

`/api/v2/evolution-chain/{id}`

Usos:

- árbol evolutivo;
- condiciones.

### Type

`/api/v2/type/{id or name}`

Usos:

- damage relations;
- Pokémon por tipo;
- relaciones.

### Generation

`/api/v2/generation/{id or name}`

Usos:

- navegación histórica;
- especies asociadas.

> Nota V1 (D-017): no se consume `/generation/`; la generación se deriva
> del DTO de species + rangos locales (`domain/explorer/generations.ts`).

### Ability

`/api/v2/ability/{id or name}`

Cargar bajo demanda cuando se necesite detalle.

### Move

`/api/v2/move/{id or name}`

No precargar todos los movimientos en la vista de Pokémon.

> Nota V1: no se consume `/move/`; solo se muestran nombres de movimientos
> provenientes de condiciones de evolución (`known_move`).

## Paginación

Los endpoints de colección usan:

- `limit`
- `offset`

No asumir que la respuesta completa cabe en una sola petición.

## Estrategia de Explorer

Evitar el patrón:

1. cargar lista completa;
2. disparar una petición por cada Pokémon visible de forma descontrolada.

Opciones aceptables:

- paginar;
- infinite query;
- prefetch limitado;
- batching de UX a nivel cliente;
- cargar detalle únicamente para cards visibles.

Medir antes de optimizar.

## Caché

PokéAPI solicita que los clientes cacheen los recursos.

TanStack Query debe configurarse con tiempos largos para datos que cambian muy poco.

Datos de PokéAPI son esencialmente estáticos para la sesión del usuario.

## Retry

No ejecutar retries agresivos.

Errores 404 deben considerarse definitivos.

Errores temporales pueden reintentarse de forma limitada.

## Abort

Las peticiones deben aceptar `AbortSignal` cuando sea posible.

## Prefetch

Candidatos:

- hover/focus de card;
- navegación probable;
- Pokémon anterior/siguiente;
- cadena evolutiva visible.

No hacer prefetch masivo.

## Imágenes

PokéAPI expone múltiples sprites y artworks.

Prioridad sugerida para Hero:

1. official artwork;
2. home artwork;
3. dream world;
4. sprite;
5. placeholder.

La UI debe admitir ausencia.

## Shiny

El toggle shiny cambia la fuente de artwork cuando exista.

Si no existe versión shiny usable:

- mantener artwork normal;
- indicar que no hay recurso disponible;
- no romper layout.

## Localización

Para descripciones:

- seleccionar idioma configurado;
- limpiar saltos y caracteres extraños cuando sea necesario;
- no mostrar múltiples flavor texts repetidos.

## Mappers

Los mappers deben convertir DTOs a domain.

Ejemplo:

```text
PokemonDTO
    ↓
mapPokemonDetails()
    ↓
PokemonDetails
```

## Errores

La capa API debe exponer errores tipados o normalizados.

No mostrar al usuario respuestas crudas del servidor.

## Pruebas

Los mappers deben tener tests unitarios.

Usar fixtures pequeñas y estables.

No depender de PokéAPI real para todos los tests automatizados.
