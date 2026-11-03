# Instrucciones de Copilot - Proyecto PokeApiWeb

## Resumen del Proyecto

**PokeApiWeb** es una aplicación web tipo Pokédex que consume la PokéAPI para mostrar información de Pokémon.

### Estado Actual - Lo que Hemos Hecho

#### ✅ Estructura HTML (PokeAPI.html)

- Interfaz en español con estructura semántica
- Sección de filtrado por tipo de Pokémon
- Grid responsivo para mostrar Pokémon
- Botón de cambio de tema (claro/oscuro)
- Indicadores de carga y error

#### ✅ Funcionalidad JavaScript (script.js)

- Integración con PokéAPI REST
- Sistema de filtrado por tipo de Pokémon (18 tipos disponibles)
- Gestión de temas claro/oscuro con localStorage
- Array `allPokemon` para almacenar datos
- Sistema de colores por tipo asociados

#### ✅ Estilos y Tema (styles.css)

- Diseño responsivo con CSS custom properties
- Dos temas: claro (morado) y oscuro (azul oscuro)
- Variables CSS para mantener consistencia
- Soporte para modo oscuro

## Lo que Estamos Haciendo

### 🔄 Mejoras y Desarrollo Pendiente

- Completar la lógica de filtrado de Pokémon por tipo
- Cargar y mostrar tarjetas de Pokémon en el grid
- Implementar búsqueda por nombre
- Optimizar las peticiones a la API
- Mejorar la accesibilidad (ARIA labels, navegación por teclado)

## Guía de Desarrollo

### Estructura de Archivos

```
PokeApiWeb/
├── PokeAPI.html      # Estructura HTML en español
├── script.js         # Lógica de consuma de API y interactividad
├── styles.css        # Estilos y temas
└── copilot-instructions.md  # Este archivo
```

### Tipos de Pokémon Soportados

normal, fighting, flying, poison, ground, rock, bug, ghost, steel, fire, water, grass, electric, psychic, ice, dragon, dark, fairy

### Características Principales

- **Tema Dinámico**: Alterna entre modo claro y oscuro
- **Filtrado**: Selecciona múltiples tipos para filtrar Pokémon
- **Responsivo**: Se adapta a diferentes tamaños de pantalla
- **API Integrada**: Consume datos en tiempo real de PokéAPI

## Notas para Futuras Mejoras

- Implementar paginación o scroll infinito
- Agregar detalles específicos del Pokémon (stats, movimientos, evoluciones)
- Guardar favoritos en localStorage
- Mejorar performance con lazy loading
- Agregar filtros adicionales (generación, altura, peso)
