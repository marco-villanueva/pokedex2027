# DESIGN VISION

## Idea central

Pokédex // 2027 debe parecer una interfaz científica avanzada creada para observar, clasificar y comparar especies Pokémon.

Referencias conceptuales:

- archivo científico;
- interfaz de laboratorio;
- dispositivo portátil premium;
- tarjeta coleccionable holográfica;
- instrumentación;
- HUD de ciencia ficción sobrio;
- materiales ópticos;
- visualización de datos.

No copiar interfaces concretas de Pokémon oficiales.

## Personalidad

La interfaz debe ser:

- precisa;
- curiosa;
- dinámica;
- tecnológica;
- táctil;
- expresiva;
- legible;
- juguetona de forma controlada.

## Antiobjetivos visuales

Evitar:

- dashboard corporativo;
- estética SaaS;
- exceso de paneles rectangulares;
- paleta morado/azul genérica;
- neón indiscriminado;
- glassmorphism en todos los elementos;
- estilo gamer agresivo;
- ruido visual constante;
- motion continuo sin utilidad;
- apariencia infantil;
- skeuomorphism pesado.

## Dirección visual

### Fondo

El fondo es profundo y atmosférico, pero no debe competir con el contenido.

Puede incluir:

- gradientes ambientales;
- grano sutil;
- halos;
- partículas lentas;
- geometría técnica;
- grids;
- luz contextual.

### Superficies

Usar diferentes materiales visuales:

- vidrio técnico;
- metal mate;
- polímero oscuro;
- superficies holográficas;
- panel translúcido;
- tinta digital.

No todos los componentes deben usar el mismo material.

### Tipografía

Jerarquía propuesta:

- Display: identidad y números grandes.
- Heading: nombres y secciones.
- Body: contenido descriptivo.
- Label: datos técnicos.
- Mono: números, IDs, unidades y telemetría.

La UI debe conservar legibilidad incluso cuando los fondos cambien por tipo.

## Identidad por tipo

El tipo principal de un Pokémon modifica el ambiente.

No se limita a cambiar un color.

### Fire

- temperatura cálida;
- rojo/naranja profundo;
- partículas suaves;
- reflejos ámbar.

### Water

- azul y cyan;
- refracción;
- ondas;
- caustics muy sutiles.

### Electric

- amarillo;
- líneas energéticas;
- flashes breves;
- acentos fríos.

### Grass

- verde;
- partículas orgánicas;
- iluminación difusa;
- textura sutil.

### Psychic

- violeta/magenta;
- campos orbitales;
- distorsión controlada;
- profundidad.

### Ghost

- niebla;
- bajo contraste de fondo;
- aberración cromática ligera;
- movimiento flotante.

### Ice

- cyan pálido;
- superficies cristalinas;
- refracción;
- destellos secos.

### Rock / Ground

- minerales;
- ocres;
- geometría más sólida;
- partículas pesadas.

### Dark

- baja luminancia;
- contraste alto;
- acentos intensos;
- movimiento mínimo.

### Fairy

- tonos claros;
- partículas luminosas;
- gradientes suaves;
- refracción delicada.

Los demás tipos deben definirse con el mismo criterio.

## Composición

### Desktop

Priorizar:

- profundidad;
- composición amplia;
- información paralela;
- hero dominante;
- movimiento de cursor moderado.

### Mobile

Pensar como dispositivo portátil.

Priorizar:

- foco vertical;
- acciones accesibles al pulgar;
- carruseles cuando aporten;
- paneles apilados;
- gestures opcionales;
- navegación compacta.

Mobile no es desktop reducido.

## Cards

Una Pokémon Card puede tener:

- profundidad CSS;
- tilt;
- specular highlight;
- foil;
- artwork fuera de límites;
- número grande;
- tipos;
- stat dominante;
- información secundaria progresiva.

La card debe seguir siendo legible sin efectos.

## Página de detalle

El Pokémon es el centro.

Capas sugeridas:

1. ambiente;
2. geometría 3D;
3. scanner;
4. artwork;
5. telemetría;
6. datos;
7. navegación contextual.

El artwork puede ser 2D dentro de un espacio tridimensional.

## Movimiento

El movimiento debe comunicar:

- entrada;
- selección;
- continuidad;
- relación espacial;
- cambio de estado;
- feedback.

Evitar:

- animar todo;
- loops visibles permanentes;
- delays largos;
- easing dramático para acciones simples.

## Regla de extravagancia

"Extravagante" significa alto nivel de dirección artística y detalle, no saturación.

Cuando exista duda entre un efecto espectacular y una interfaz clara, gana la claridad.
