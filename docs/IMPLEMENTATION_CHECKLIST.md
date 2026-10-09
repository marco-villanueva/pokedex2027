# IMPLEMENTATION CHECKLIST

Checklist transversal para cualquier feature.

## Antes

- [ ] Entiendo el objetivo del RC.
- [ ] Revisé implementación existente.
- [ ] Revisé documento especializado.
- [ ] La tarea no amplía alcance sin decisión.
- [ ] Sé qué estado vive en URL, query, local o store.

## Datos

- [ ] No consumo DTOs directamente en UI.
- [ ] Hay fallback de campos opcionales.
- [ ] Se usan query keys centralizadas.
- [ ] La consulta puede cancelarse.
- [ ] El cache es apropiado.
- [ ] No creé N+1 innecesario.

## UI

- [ ] Loading.
- [ ] Empty.
- [ ] Error.
- [ ] Retry.
- [ ] Focus.
- [ ] Keyboard.
- [ ] Mobile.
- [ ] Reduced motion.
- [ ] Contraste.
- [ ] Sin overflow horizontal.

## Motion

- [ ] La animación tiene una función.
- [ ] No se ejecuta React state por pointermove.
- [ ] Existe fallback.
- [ ] No retrasa navegación.
- [ ] Respeta reduced motion.

## Performance

- [ ] No añadí dependencia innecesaria.
- [ ] No cargué código pesado en ruta inicial.
- [ ] Imágenes tienen dimensiones.
- [ ] No existe canvas innecesario.
- [ ] No hay loops fuera de viewport.
- [ ] Revisé network.

## Testing

- [ ] Unit tests donde aplica.
- [ ] Component test donde aplica.
- [ ] E2E si afecta flujo crítico.
- [ ] Build.
- [ ] Typecheck.
- [ ] Lint.

## Final

- [ ] Revisé desktop.
- [ ] Revisé mobile.
- [ ] Revisé consola.
- [ ] Actualicé PROGRESS.
- [ ] Registré decisiones.
