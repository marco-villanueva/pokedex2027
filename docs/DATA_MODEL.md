# DATA MODEL

## Objetivo

Crear modelos internos estables para aislar la UI de las respuestas crudas de PokéAPI.

## PokemonSummary

```ts
interface PokemonSummary {
  id: number
  name: string
  displayName: string
  types: PokemonTypeRef[]
  artwork: PokemonArtworkSummary
}
```

Debe ser suficiente para cards y resultados.

## PokemonArtworkSummary

```ts
interface PokemonArtworkSummary {
  official?: string
  officialShiny?: string
  home?: string
  sprite?: string
}
```

## PokemonDetails

```ts
interface PokemonDetails {
  id: number
  name: string
  displayName: string

  artwork: PokemonArtwork

  types: PokemonTypeRef[]
  abilities: PokemonAbility[]
  stats: PokemonStat[]

  heightMeters: number
  weightKilograms: number

  species: PokemonSpeciesSummary
}
```

## PokemonArtwork

```ts
interface PokemonArtwork {
  official?: string
  officialShiny?: string
  home?: string
  homeShiny?: string
  dreamWorld?: string
  spriteFront?: string
  spriteBack?: string
  showdown?: string
  showdownShiny?: string
  versions?: PokemonVersionSprite[]
}
```

Todos los campos de imagen deben tolerar ausencia.

## PokemonStat

```ts
type PokemonStatName = 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed'

interface PokemonStat {
  name: PokemonStatName
  value: number
}
```

## PokemonAbility

```ts
interface PokemonAbility {
  name: string
  displayName: string
  hidden: boolean
}
```

Detalles de habilidad pueden cargarse bajo demanda.

## PokemonSpeciesSummary

```ts
interface PokemonSpeciesSummary {
  id: number
  genus?: string
  description?: string
  generation?: string
  isLegendary: boolean
  isMythical: boolean
  evolutionChainId?: number
}
```

## EvolutionNode

Una cadena puede ramificarse.

```ts
interface EvolutionNode {
  speciesId: number
  speciesName: string
  details: EvolutionCondition[]
  children: EvolutionNode[]
}
```

## EvolutionCondition

Debe abstraer las condiciones más comunes:

- level;
- item;
- trigger;
- held item;
- known move;
- location;
- friendship;
- time of day;
- gender;
- relative physical stats;
- rain;
- upside down;
- otras condiciones disponibles.

La UI debe poder mostrar una condición desconocida de forma segura.

## PokemonTypeRef

```ts
interface PokemonTypeRef {
  id?: number
  name: string
}
```

## TypeEffectiveness

```ts
interface TypeEffectiveness {
  doubleDamageFrom: string[]
  halfDamageFrom: string[]
  noDamageFrom: string[]
  doubleDamageTo: string[]
  halfDamageTo: string[]
  noDamageTo: string[]
}
```

## ComparePokemon

Usar un modelo derivado.

No duplicar toda la entidad.

```ts
interface ComparePokemon {
  pokemon: PokemonDetails
  totalStats: number
}
```

## Team

```ts
interface PokemonTeam {
  version: number
  members: number[]
}
```

Reglas:

- máximo 6;
- IDs únicos salvo que el producto decida explícitamente lo contrario;
- persistencia local.

## Normalización

Los mappers deben:

- convertir unidades;
- resolver imagen preferida;
- traducir nombres internos a labels;
- filtrar descripciones por idioma;
- asegurar fallback;
- producir estructuras consistentes.

## Idioma

La primera versión puede usar UI en inglés o español, pero debe decidirse una sola estrategia.

PokéAPI incluye nombres y textos localizados en recursos de especie.

No mezclar idiomas involuntariamente.

## Nullability

Nunca asumir que:

- existe una imagen;
- existe sprite de una versión;
- existe traducción concreta;
- una evolución es lineal;
- existe segunda evolución;
- una habilidad tiene descripción cargada.

La UI debe degradar con gracia.
