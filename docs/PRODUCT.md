# PRODUCT

## Nombre

Pokédex // 2027

## Visión

Crear una Pokédex web que combine exploración rápida, profundidad de información y una presentación visual propia de una interfaz digital avanzada.

El producto debe resultar útil para buscar y comparar Pokémon, explorar evoluciones, revisar estadísticas y descubrir relaciones entre tipos.

## Usuario objetivo

### Usuario principal

Persona familiarizada con Pokémon que desea:

- encontrar rápidamente un Pokémon;
- explorar detalles;
- comparar estadísticas;
- revisar evoluciones;
- descubrir tipos, habilidades y formas;
- crear favoritos o un equipo.

### Usuario secundario

Desarrollador o diseñador que observa el proyecto como referencia de:

- React;
- CSS moderno;
- visualización de datos;
- motion;
- WebGL;
- arquitectura frontend;
- consumo de APIs.

## Objetivos de producto

### O1. Exploración rápida

El usuario debe poder encontrar un Pokémon por:

- nombre;
- número;
- tipo;
- generación.

### O2. Detalle rico

La página de un Pokémon debe reunir:

- identidad;
- artwork;
- tipos;
- estadísticas;
- biometría;
- especie;
- descripción;
- habilidades;
- evolución;
- formas relevantes;
- sprites.

### O3. Comparación

El usuario debe poder comparar dos Pokémon visualmente.

### O4. Persistencia ligera

El usuario debe poder guardar:

- favoritos;
- equipo de hasta seis Pokémon;
- preferencias visuales que tenga sentido persistir.

### O5. Navegación compartible

Las búsquedas, filtros y entidades principales deben ser representables mediante URL cuando sea razonable.

## Fuera de alcance para V1

No implementar inicialmente:

- login;
- backend propio;
- multiplayer;
- marketplace;
- colección personal compleja;
- inventario;
- sistema de cuentas;
- integración con juegos oficiales;
- battle simulator completo;
- modelos 3D completos de todos los Pokémon;
- edición de datos;
- comentarios sociales;
- chat.

## Experiencias principales

### 1. Explorer

Vista de navegación general.

Debe incluir:

- búsqueda;
- filtros;
- orden;
- navegación por generación;
- virtualización o estrategia equivalente si el volumen lo requiere;
- carga progresiva;
- estados vacíos;
- errores recuperables.

### 2. Pokémon Detail

Pantalla central del proyecto.

Debe sentirse como una ficha avanzada de investigación.

Información mínima:

- ID;
- nombre;
- artwork;
- shiny;
- tipos;
- altura;
- peso;
- estadísticas base;
- habilidades;
- descripción;
- generación;
- flags legendary/mythical;
- cadena evolutiva.

### 3. Evolution Explorer

Representación clara de una cadena evolutiva.

Debe soportar:

- ramas;
- múltiples condiciones;
- navegación a cada Pokémon;
- visualización responsive.

### 4. Compare

Comparación lado a lado.

Debe incluir:

- tipos;
- estadísticas;
- altura;
- peso;
- diferencias;
- navegación al detalle.

### 5. Favorites / Team

Persistencia local.

Team:

- máximo seis;
- añadir;
- quitar;
- reordenar;
- detectar duplicados;
- mostrar composición por tipos.

## Navegación propuesta

- `/`
- `/pokedex`
- `/pokemon/:idOrName`
- `/compare`
- `/evolution/:id`
- `/favorites`
- `/team`

Opcional:

- `/generation/:generation`
- `/type/:type`

## Estados de interfaz obligatorios

Cada feature de datos debe contemplar:

- loading;
- success;
- empty;
- error;
- retry;
- partial data cuando aplique.

## Principios de interacción

- Respuesta visible inmediata.
- Navegación predecible.
- Movimiento con propósito.
- Información crítica disponible sin hover.
- Transiciones cortas.
- Navegación mediante teclado.
- Estados de filtros visibles.
- Botones con labels claros.
- URLs coherentes.

## Métricas técnicas internas

No se requiere analytics en la primera iteración.

La calidad se evalúa con:

- Core Web Vitals;
- Lighthouse;
- bundle size;
- cantidad de requests;
- errores de consola;
- cobertura de flujos críticos;
- accesibilidad;
- estabilidad visual.

## Criterio de éxito

La V1 es exitosa cuando:

1. la Pokédex es usable sin entrenamiento;
2. el diseño es reconocible y coherente;
3. las pantallas principales son visualmente diferenciadas;
4. la aplicación funciona correctamente en desktop y móvil;
5. los efectos no degradan la interacción;
6. los datos de PokéAPI se consumen mediante una capa estable;
7. existe un conjunto confiable de tests;
8. puede desplegarse como sitio estático.
